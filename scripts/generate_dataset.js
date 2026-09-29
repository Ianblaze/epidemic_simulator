import fs from 'fs';
import { stepSEIR } from './src/simulation/seir.js';

// We will generate 2000 random pandemic scenarios
const NUM_SAMPLES = 2000;
const WORLD_POP = 8000000000;
const SIM_DAYS = 365;

let csv = 'r0,incubation,infectious,cfr,peak_day,peak_infections,total_deaths\n';

for (let i = 0; i < NUM_SAMPLES; i++) {
    // Generate random parameters
    const r0 = 1.2 + Math.random() * 4.8; // 1.2 to 6.0
    const incubation = 2 + Math.random() * 12; // 2 to 14 days
    const infectious = 5 + Math.random() * 15; // 5 to 20 days
    const cfr = 0.005 + Math.random() * 0.095; // 0.5% to 10%

    const params = {
        r0,
        incubationPeriod: incubation,
        infectiousPeriod: infectious,
        caseFatalityRate: cfr,
        interventionStringency: 0,
        livestockAffection: 0
    };

    let state = { S: WORLD_POP - 10, E: 5, I: 5, R: 0, D: 0 };
    
    let peakDay = 0;
    let peakI = 0;
    
    for (let day = 1; day <= SIM_DAYS; day++) {
        // Run SEIR for 1 step (which internally scales by timeScale 0.3 to match UI)
        state = stepSEIR(state, params, 1);
        
        if (state.I > peakI) {
            peakI = state.I;
            peakDay = day;
        }
    }
    
    csv += `${r0.toFixed(3)},${incubation.toFixed(3)},${infectious.toFixed(3)},${cfr.toFixed(4)},${peakDay},${Math.round(peakI)},${Math.round(state.D)}\n`;
}

fs.writeFileSync('pandemic_dataset.csv', csv);
console.log(`Generated dataset with ${NUM_SAMPLES} samples.`);
