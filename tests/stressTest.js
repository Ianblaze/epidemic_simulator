import { runPrediction } from '../src/simulation/predictor.js';
import { generateDoomsdayDisease } from '../src/simulation/diseaseGenerator.js';
import { initAegisDefenses } from '../src/simulation/aegisController.js';
import countriesData from '../src/data/countries.js';

function runScenario(mode, seed, cId, diseaseParams = null) {
    let params = diseaseParams;
    if (mode === 'DOOMSDAY') {
        const country = countriesData.find(c => c.id === cId);
        const profile = generateDoomsdayDisease(country);
        params = {
            r0: profile.r0, incubationPeriod: profile.incubationPeriod, infectiousPeriod: profile.infectiousPeriod,
            caseFatalityRate: profile.caseFatalityRate, airImmunity: profile.airTransmission, waterImmunity: profile.waterTransmission, mutationRate: profile.mutationRate
        };
        const defs = country.defenses || { interventionStringency: 0.0, borderStrictness: 0.05, hygieneCompliance: 0.15, quarantineEfficiency: 0.1, vaccineFunding: 0.05 };
        params = { ...params, ...defs };
    } else {
        const defs = initAegisDefenses(params);
        params = { ...params, ...defs };
    }
    params.seed = seed;
    const result = runPrediction(params, cId, mode, seed);
    return { predictedDay: result.predictedDay, actualDay: result.actualDay, success: result.success };
}

console.log("Running stress tests...");
let ds=0, dt=0, dp=0, da=0;
for(let i=0; i<100; i++) {
    const res = runScenario('DOOMSDAY', Math.floor(Math.random()*1000000), countriesData[Math.floor(Math.random()*countriesData.length)].id);
    if(res.success) { ds++; if(res.actualDay <= res.predictedDay) dt++; }
    dp+=res.predictedDay; da+=res.actualDay;
}

let as=0, at=0, ap=0, aa=0;
for(let i=0; i<100; i++) {
    const dummy = countriesData[Math.floor(Math.random()*countriesData.length)];
    const p = generateDoomsdayDisease(dummy);
    const res = runScenario('AEGIS', Math.floor(Math.random()*1000000), countriesData[Math.floor(Math.random()*countriesData.length)].id, p);
    if(res.success) { as++; if(res.actualDay <= res.predictedDay) at++; }
    ap+=res.predictedDay; aa+=res.actualDay;
}

console.log("\\n--- FINAL REPORT ---");
console.log("DOOMSDAY\\nSuccessful: " + ds + "/100\\nOn-time: " + dt + "/100\\nAverage predicted day: " + Math.floor(dp/100) + "\\nAverage actual day: " + Math.floor(da/100));
console.log("\\nAEGIS\\nSuccessful: " + as + "/100\\nOn-time: " + at + "/100\\nAverage predicted day: " + Math.floor(ap/100) + "\\nAverage actual day: " + Math.floor(aa/100));
