import countriesData from '../data/countries.js';
import { setGlobalSeed } from './rng.js';
import { stepSimulation } from './stepSimulation.js';

export function runPrediction(params, seedCountry, gameMode, seed) {
    setGlobalSeed(seed);
    let states = new Map();
    countriesData.forEach(c => {
        states.set(c.id, { S: c.population, E: 0, I: 0, R: 0, D: 0, vaccineAvailable: false });
    });

    const initTarget = states.get(seedCountry);
    if (initTarget) {
        initTarget.S -= 500;
        initTarget.E += 400;
        initTarget.I += 100;
    }

    let day = 1;
    let currentParams = { ...params };
    let variants = [];
    let vaccineProgress = 0;
    let vaccineStarted = false;
    let prevTotalGlobalI = 0;

    while (day <= 3000) { 
        const result = stepSimulation(states, currentParams, day, gameMode, prevTotalGlobalI, vaccineProgress, vaccineStarted, variants);
        states = result.newStates;
        currentParams = result.newParams;
        vaccineProgress = result.newVaccineProgress;
        vaccineStarted = result.newVaccineStarted;
        variants = result.newVariants;
        prevTotalGlobalI = result.totalGlobalI;

        if (result.isFinished) {
            let predictedDay = day;
            if (result.reason === 'Global infection reached' || result.reason === 'Eradicated') {
                predictedDay = Math.floor(day * 1.05) + 10;
                return { predictedDay, actualDay: day, success: true, reason: result.reason, sumS: result.globalS };
            }
            return { predictedDay: day, actualDay: day, success: false, reason: result.reason, sumS: result.globalS };
        }
        day++;
    }
    return { predictedDay: 3000, actualDay: 3000, success: false, reason: 'Timeout' };
}
