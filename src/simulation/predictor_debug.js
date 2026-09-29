import { stepSEIR, initCountryState } from './seir.js';
import { checkMutation, applyVariantEffects } from './mutations.js';
import countriesData from '../data/countries.js';
import { setGlobalSeed, random } from './rng.js';

export function runPrediction(params, seedCountry, gameMode, seed) {
    setGlobalSeed(seed);

    let states = new Map();
    countriesData.forEach(c => {
        states.set(c.id, {
            S: c.population,
            E: 0,
            I: 0,
            R: 0,
            D: 0,
            vaccineAvailable: false
        });
    });

    const initTarget = states.get(seedCountry);
    if (initTarget) {
        initTarget.S -= 1000;
        initTarget.E += 1000;
    }

    let day = 1;
    let currentParams = { ...params };
    let variants = [];
    let vaccineProgress = 0;
    let vaccineStarted = false;
    let nukeFired = false;

    const countriesDataCache = countriesData;

    while (day <= 3000) { 
        vaccineProgress += (currentParams.vaccineFunding || 0) * 0.50;
        
        let newStates = new Map();
        let totalGlobalI = 0;

        states.forEach((state, countryId) => {
            let newState = stepSEIR(state, currentParams, 1);
            newState.vaccineAvailable = state.vaccineAvailable;

            if (newState.vaccineAvailable && newState.S > 0) {
                const vacAmount = Math.min(newState.S, (newState.S + newState.E + newState.I + newState.R + newState.D) * 0.015);
                newState.S -= vacAmount;
                newState.R += vacAmount;

                const c = countriesDataCache.find(x => x.id === countryId);
                if (c && c.neighbors && random() < 0.08) {
                    const nid = c.neighbors[Math.floor(random() * c.neighbors.length)];
                    const ns = newStates.get(nid);
                    if (ns) ns.vaccineAvailable = true;
                }
            }

            if (newState.I > 100) {
                const c = countriesDataCache.find(x => x.id === countryId);
                const borderSpreadChance = 0.01 * (currentParams.r0 || 2.0);
                const stealthFactor = Math.min(0.8, (currentParams.incubationPeriod || 5) / 20);
                const effectiveStrictness = Math.max(0, (currentParams.borderStrictness || 0) - stealthFactor);
                
                if (c && c.neighbors && random() < borderSpreadChance && random() > effectiveStrictness) {
                    const nid = c.neighbors[Math.floor(random() * c.neighbors.length)];
                    const ns = newStates.get(nid);
                    if (ns && ns.S > 10) {
                        const amount = Math.floor(10 + random() * 40 + (currentParams.r0 * 3));
                        ns.S -= amount;
                        ns.E += amount;
                    }
                }
            }

            const infectionPressure = 1 - Math.exp(-newState.I / 15000);
            const transmissionMultiplier = 0.5 + 1.5 * ((currentParams.airImmunity || 0) + (currentParams.waterImmunity || 0)) / 2;
            const infectionProbability = Math.min(0.98, infectionPressure * transmissionMultiplier);

            // Important fix: Instead of only targeting when random() < prob, target every tick with that prob to ensure spread
            if (newState.I > 500 && random() < infectionProbability) {
                const keys = Array.from(newStates.keys());
                const rTargetId = keys[Math.floor(random() * keys.length)];
                const rTarget = newStates.get(rTargetId);
                if (rTarget && rTarget.S > 10) {
                    const amount = Math.floor(10 + random() * 40 + (currentParams.r0 * 3));
                    rTarget.S -= amount;
                    rTarget.E += amount;
                }
            }

            newStates.set(countryId, newState);
            totalGlobalI += newState.I;
        });

        // ROGUE SEEDING
        if (gameMode === 'DOOMSDAY' && totalGlobalI > 100000 && random() < 0.20) {
            const keys = Array.from(newStates.keys());
            const randomId = keys[Math.floor(random() * keys.length)];
            const target = newStates.get(randomId);
            // Relaxed the condition to just S > 0 so even small islands get hit
            if (target && target.I === 0 && target.S > 0) {
                const amount = Math.min(target.S, 100);
                target.S -= amount;
                target.E += amount;
            }
        }

        if (vaccineProgress >= 50 && !vaccineStarted) {
            vaccineStarted = true;
            const prominentCountries = ['USA', 'CHN', 'GBR', 'FRA', 'DEU', 'JPN'];
            let count = 0;
            prominentCountries.forEach(id => {
                if (count < 3 && newStates.has(id)) {
                    newStates.get(id).vaccineAvailable = true;
                    count++;
                }
            });
        }
        if (vaccineProgress >= 75) {
            let limit = 10;
            Array.from(newStates.values()).forEach(s => {
                if (limit > 0 && !s.vaccineAvailable) {
                    s.vaccineAvailable = true;
                    limit--;
                }
            });
        }
        if (vaccineProgress >= 100) {
            newStates.forEach(s => s.vaccineAvailable = true);
        }

        let sumS = 0, sumE = 0, sumI = 0, sumD = 0;
        newStates.forEach(s => { sumS += s.S; sumE += s.E; sumI += s.I; sumD += s.D; });
        const globalPop = sumS + sumE + sumI + sumD;

        if (gameMode === 'AEGIS' && !nukeFired) {
            const infectedRatio = (sumE + sumI) / (globalPop + 1);
            if (infectedRatio >= 0.25 && vaccineProgress < 100) {
                nukeFired = true;
                newStates.forEach(c => {
                    c.D += (c.E + c.I);
                    c.E = 0;
                    c.I = 0;
                });
                sumE = 0;
                sumI = 0;
            }
        }
        
        // AEGIS DYNAMIC ADAPTATION
        if (gameMode === 'AEGIS') {
            const infectedRatio = (sumE + sumI) / (globalPop + 1);
            if (infectedRatio > 0.01 && sumI > totalGlobalI * 0.95) { // rough proxy for growth
                currentParams.interventionStringency = Math.min(1.0, currentParams.interventionStringency + 0.02);
                currentParams.borderStrictness = Math.min(1.0, currentParams.borderStrictness + 0.02);
                currentParams.hygieneCompliance = Math.min(1.0, currentParams.hygieneCompliance + 0.02);
                currentParams.quarantineEfficiency = Math.min(1.0, currentParams.quarantineEfficiency + 0.02);
            }
        }

        const mutation = checkMutation(day, totalGlobalI, currentParams, variants, gameMode);
        if (mutation) {
            variants.push(mutation);
            newStates = applyVariantEffects(newStates, mutation);
            currentParams.r0 = Math.min(20, currentParams.r0 * mutation.r0Modifier);
        }

        states = newStates;

        if (gameMode === 'DOOMSDAY') {
            if (sumS <= 1000) {
                return { predictedDay: day, success: true, reason: 'Global infection reached' };
            } else if (sumE < 1 && sumI < 1) {
                return { predictedDay: day, success: false, reason: 'Disease died out', sumS };
            }
        } else if (gameMode === 'AEGIS') {
            if (sumE < 1 && sumI < 1) {
                return { predictedDay: day, success: true, reason: 'Eradicated' };
            } else if ((sumS <= 1000 && vaccineProgress < 100) || sumD > 2000000000) {
                return { predictedDay: day, success: false, reason: 'Humanity collapsed' };
            }
        }

        day++;
    }
    
    return { predictedDay: 3000, success: false, reason: 'Timeout' };
}
