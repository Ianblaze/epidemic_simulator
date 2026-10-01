import { stepSEIR } from './seir.js';
import { checkMutation, applyVariantEffects } from './mutations.js';
import { random } from './rng.js';
import countriesData from '../data/countries.js';
import { airports, seaports } from '../data/transit.js';
import { adaptAegisDefenses } from './aegisController.js';
import { fallbackFlightNeighbors, flightNeighbors, landNeighbors, shipNeighbors } from './countryNetwork.js';

export function stepSimulation(states, currentParams, day, gameMode, prevTotalGlobalI, vaccineProgress, vaccineStarted, variants) {
    let newStates = new Map();
    let transitEvents = [];
    let totalGlobalI = 0;
    
    let newVaccineProgress = vaccineProgress;
    // We will calculate vaccine progress at the BOTTOM of the function when we have globalR!
    
    if (newVaccineProgress > 100) newVaccineProgress = 100;
    
    const countryKeysCache = Array.from(states.keys());
    states.forEach((state, countryId) => { newStates.set(countryId, { ...state }); });

    states.forEach((state, countryId) => {
        let targetState = newStates.get(countryId);
        let newState = stepSEIR(targetState, currentParams, 1, gameMode);
        
        targetState.S = newState.S;
        targetState.E = newState.E;
        targetState.I = newState.I;
        targetState.R = newState.R;
        targetState.D = newState.D;
        
        if (targetState.vaccineAvailable && targetState.S > 0) {
            const vacAmount = Math.min(targetState.S, (targetState.S + targetState.E + targetState.I + targetState.R + targetState.D) * 0.015);
            targetState.S -= vacAmount;
            targetState.R += vacAmount;

            const c = countriesData.find(x => x.id === countryId);
            if (c && c.neighbors && random() < 0.08) {
                const nid = c.neighbors[Math.floor(random() * c.neighbors.length)];
                const ns = newStates.get(nid);
                if (ns) ns.vaccineAvailable = true;
            }
        }
    });

    let globalS = 0, globalE = 0, globalD = 0, globalR = 0;
    const getAirports = (cid) => airports.filter(a => a.country === cid || a.country === cid.replace(/\s+/g, '')).length;
    const getSeaports = (cid) => seaports.filter(s => s.country === cid || s.country === cid.replace(/\s+/g, '')).length;

    states.forEach((state, countryId) => {
        let targetState = newStates.get(countryId);
        globalS += targetState.S;
        globalE += targetState.E;
        totalGlobalI += targetState.I;
        globalR += targetState.R;
        globalD += targetState.D;

        if (targetState.vaccineAvailable && newVaccineProgress >= 100) {
            // Distribute vaccine via air/sea transit mathematically
            for (let i = 0; i < 2; i++) {
                const rTargetId = countryKeysCache[Math.floor(random() * countryKeysCache.length)];
                if (rTargetId !== countryId) {
                    const rTarget = newStates.get(rTargetId);
                    if (rTarget && !rTarget.vaccineAvailable) {
                        if (random() < (newVaccineProgress >= 100 ? 0.3 : 0.05)) {
                            rTarget.vaccineAvailable = true;
                            transitEvents.push({ origin: countryId, target: rTargetId, type: random() > 0.3 ? 'flight' : 'ship', isVaccine: true });
                        }
                    }
                }
            }
        }

        if (targetState.I > (gameMode === 'DOOMSDAY' ? 1 : 250)) {
            const infectionPressure = 1 - Math.exp(-targetState.I / 50000);
            const c = countriesData.find(x => x.id === countryId);
            const borderStrictness = currentParams.borderStrictness || 0;
            const airTrans = currentParams.airImmunity !== undefined ? currentParams.airImmunity : (currentParams.airTransmission || 0.5);
            const waterTrans = currentParams.waterImmunity !== undefined ? currentParams.waterImmunity : (currentParams.waterTransmission || 0.5);

            if (gameMode === 'DOOMSDAY' && c) {
                // Use actual shared land borders from the map topology. The
                // legacy countries.js neighbor lists contain non-bordering
                // countries, which caused unexplained Doomsday infections.
                for (const nid of landNeighbors.get(countryId) || []) {
                    const ns = newStates.get(nid);
                    if (ns && ns.S > 0) {
                        const routeRisk = Math.min(1.0, infectionPressure * 1.5 * (1 - borderStrictness));
                        if (random() < routeRisk) {
                            const amount = Math.floor(1 + random() * 20);
                            const actualAmount = Math.min(ns.S, amount);
                            if (actualAmount > 0) {
                                ns.S -= actualAmount;
                                ns.E += actualAmount;
                                transitEvents.push({ origin: countryId, target: nid, type: 'land', amount: actualAmount, alreadyApplied: true });
                            }
                        }
                    }
                }
            } else if (gameMode !== 'DOOMSDAY' && c && c.neighbors && c.neighbors.length > 0) {
                c.neighbors.forEach(nid => {
                    const ns = newStates.get(nid);
                    if (ns && ns.S > 10 && random() < Math.min(1.0, infectionPressure * 1.5 * (1 - borderStrictness))) {
                        const amount = Math.min(ns.S, Math.floor(1 + random() * 20));
                        if (amount > 0) transitEvents.push({ origin: countryId, target: nid, type: 'land', amount });
                    }
                });
            }

            if (gameMode === 'DOOMSDAY') {
              // Seed distant countries only through actual flight and ship routes.
              // The engine applies infection; the map shows the matching red transit.
              for (const rTargetId of flightNeighbors.get(countryId) || []) {
                const rTarget = newStates.get(rTargetId);
                if (!rTarget || rTarget.S <= 0) continue;
                const destAirports = getAirports(rTargetId);
                const airVolume = fallbackFlightNeighbors.get(countryId)?.has(rTargetId)
                  ? Math.max(0.65, Math.min(1.0, (destAirports + 2.0) / 6))
                  : Math.min(1.0, (destAirports + 2.0) / 6);
                const travelVolume = currentParams.travelVolume ?? 0.5;

                const airRisk = Math.min(1.0, infectionPressure * airVolume * airTrans * travelVolume * (1 - borderStrictness) * (fallbackFlightNeighbors.get(countryId)?.has(rTargetId) ? 1.2 : 0.65));
                if (random() < airRisk) {
                    const amount = Math.min(rTarget.S, Math.floor(5 + random() * 25));
                    rTarget.S -= amount;
                    rTarget.E += amount;
                    transitEvents.push({ origin: countryId, target: rTargetId, type: 'flight', amount, alreadyApplied: true });
                }

              }

              for (const rTargetId of shipNeighbors.get(countryId) || []) {
                const rTarget = newStates.get(rTargetId);
                if (!rTarget || rTarget.S <= 0) continue;
                const destSeaports = getSeaports(rTargetId);
                const seaVolume = Math.min(1.0, (destSeaports + 1.5) / 5);
                const travelVolume = currentParams.travelVolume ?? 0.5;
                const seaRisk = Math.min(1.0, infectionPressure * seaVolume * waterTrans * travelVolume * (1 - borderStrictness) * 0.35);
                if (random() < seaRisk) {
                    const amount = Math.min(rTarget.S, Math.floor(1 + random() * 5));
                    rTarget.S -= amount;
                    rTarget.E += amount;
                    transitEvents.push({ origin: countryId, target: rTargetId, type: 'ship', amount, alreadyApplied: true });
                }
              }
            } else {
              // AEGIS: fewer, smaller export events so the pathogen is containable.
              for (let i = 0; i < 2; i++) {
                const rTargetId = countryKeysCache[Math.floor(random() * countryKeysCache.length)];
                if (rTargetId === countryId) continue;
                const rTarget = newStates.get(rTargetId);
                if (!rTarget || rTarget.S <= 10) continue;
                const destAirports = getAirports(rTargetId);
                const destSeaports = getSeaports(rTargetId);
                const airVolume = Math.min(1.0, (destAirports + 1.0) / 10);
                const seaVolume = Math.min(1.0, (destSeaports + 0.5) / 5);
                const airRisk = Math.min(1.0, infectionPressure * airVolume * airTrans * (1 - borderStrictness) * 0.0015);
                if (random() < airRisk) {
                  transitEvents.push({ origin: countryId, target: rTargetId, type: 'flight', amount: Math.min(rTarget.S, 1 + Math.floor(random() * 2)) });
                }
                const seaRisk = Math.min(1.0, infectionPressure * seaVolume * waterTrans * (1 - borderStrictness) * 0.0008);
                if (random() < seaRisk) {
                  transitEvents.push({ origin: countryId, target: rTargetId, type: 'ship', amount: Math.min(rTarget.S, 1) });
                }
              }
            }
        }
    });

    // Cross-border infections can modify countries already visited in the loop;
    // aggregate after all routes so totals reflect the completed daily state.
    globalS = 0;
    globalE = 0;
    globalD = 0;
    globalR = 0;
    totalGlobalI = 0;
    newStates.forEach(state => {
        globalS += state.S;
        globalE += state.E;
        totalGlobalI += state.I;
        globalR += state.R;
        globalD += state.D;
    });

    let globalPop = globalS + globalE + totalGlobalI + globalR + globalD;

    let newParams = { ...currentParams };
    let nukeFired = false;
    
    
    const totalCases = globalPop - globalS;
    if (gameMode === 'AEGIS' && totalCases > 1000000) {
        newVaccineProgress += (currentParams.vaccineFunding || 0) * 0.20; // Slower, more realistic development time
    }
    if (newVaccineProgress > 100) newVaccineProgress = 100;

    let newVaccineStarted = vaccineStarted;
    if (newVaccineProgress > 0 && !vaccineStarted) {
        newVaccineStarted = true;
    }
    
    // AT EXACTLY 100%, GIVE VACCINE TO MAJOR HUBS SO THEY CAN START EXPORTING IT VIA BLUE PLANES
    if (newVaccineProgress >= 100 && vaccineProgress < 100) { // wait, vaccineProgress is the previous tick's progress
        const prominentCountries = ['UNITEDSTATESOFAMERICA', 'CHINA', 'UNITEDKINGDOM', 'FRANCE', 'GERMANY', 'JAPAN'];
        prominentCountries.forEach(id => {
            if (newStates.has(id)) {
                newStates.get(id).vaccineAvailable = true;
            }
        });
    }
    // Vaccine now spreads strictly via transit events at 100% progress

    if (gameMode === 'AEGIS') {
        const infectedRatio = (globalE + totalGlobalI) / (globalPop + 1);
        if (infectedRatio >= 0.25 && newVaccineProgress < 100) {
            nukeFired = true;
            newStates.forEach(c => {
                c.D += (c.E + c.I);
                c.E = 0;
                c.I = 0;
            });
            globalE = 0;
            totalGlobalI = 0;
        } else {
            newParams = adaptAegisDefenses(newParams, totalGlobalI, prevTotalGlobalI, globalPop, newVaccineProgress);
        }
    }

    let newVariants = [...variants];
    const mutation = checkMutation(day, totalGlobalI, newParams, newVariants, gameMode);
    if (mutation) {
        if (gameMode === 'DOOMSDAY' && mutation.r0Modifier < 0.9) {
            // Ignore bad mutation
        } else {
            newVariants.push(mutation);
            newStates = applyVariantEffects(newStates, mutation);
            newParams.r0 = Math.min(25, newParams.r0 * mutation.r0Modifier);
        }
    }

    let isFinished = false;
    let reason = '';
    
    if (gameMode === 'DOOMSDAY') {
        if (globalS < 1) {
            isFinished = true;
            reason = 'Global infection reached';
        } else if (globalE < 1 && totalGlobalI < 1) {
            isFinished = true;
            reason = 'Disease died out';
        }
    } else if (gameMode === 'AEGIS') {
        if (globalE < 1 && totalGlobalI < 1) {
            isFinished = true;
            reason = 'Eradicated';
        } else if ((globalS <= 1000 && newVaccineProgress < 100) || globalD > 2000000000) {
            isFinished = true;
            reason = 'Humanity collapsed';
        }
    }

    if (transitEvents.length > 48) {
        const vaccines = transitEvents.filter(event => event.isVaccine);
        const infections = transitEvents.filter(event => !event.isVaccine);
        transitEvents = vaccines.concat(infections.slice(-48));
    }

    return {
        newStates, newParams, totalGlobalI, globalS, globalE, globalD, globalPop,
        newVaccineProgress, newVaccineStarted, newVariants, nukeFired, isFinished, reason, transitEvents
    };
}
