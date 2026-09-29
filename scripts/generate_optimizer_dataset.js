import fs from 'fs';
import { stepSEIR } from './src/simulation/seir.js';

const NUM_SAMPLES = 2500;
const WORLD_POP = 8000000000;
const SIM_DAYS = 1500;
const DEATH_TOLERANCE = 1000000; // Aim to keep deaths under 1 Million

let csv = 'r0,incubation,infectious,cfr,optimal_stringency\n';

console.log("Generating dataset for AI Strategy Optimizer...");

for (let i = 0; i < NUM_SAMPLES; i++) {
    // Generate random disease
    const r0 = 1.2 + Math.random() * 6.8; // 1.2 to 8.0
    const incubation = 2 + Math.random() * 12; // 2 to 14 days
    const infectious = 5 + Math.random() * 15; // 5 to 20 days
    const cfr = 0.005 + Math.random() * 0.095; // 0.5% to 10%

    let optimal_stringency = 1.0; // Default to max lockdown

    // Grid search to find the lowest possible stringency that keeps deaths under tolerance
    // We check from 0.0 (no lockdown) up to 1.0 (max lockdown)
    for (let stringency = 0.0; stringency <= 1.0; stringency += 0.02) {
        
        const params = {
            r0,
            incubationPeriod: incubation,
            infectiousPeriod: infectious,
            caseFatalityRate: cfr,
            interventionStringency: stringency,
            livestockAffection: 0
        };

        let state = { S: WORLD_POP - 10, E: 5, I: 5, R: 0, D: 0 };
        
        for (let day = 1; day <= SIM_DAYS; day++) {
            state = stepSEIR(state, params, 1);
            if (state.D > DEATH_TOLERANCE) {
                break; // Failed, stringency too low
            }
        }
        
        if (state.D <= DEATH_TOLERANCE) {
            optimal_stringency = stringency;
            break; // Found the minimum required stringency!
        }
    }
    
    csv += `${r0.toFixed(3)},${incubation.toFixed(3)},${infectious.toFixed(3)},${cfr.toFixed(4)},${optimal_stringency.toFixed(3)}\n`;
}

fs.writeFileSync('optimizer_dataset.csv', csv);
console.log(`Generated optimizer dataset with ${NUM_SAMPLES} samples.`);
