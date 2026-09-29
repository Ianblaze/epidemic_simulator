const fs = require('fs');

let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

// For Doomsday
const oldDoomsdayPrediction = /const pDay = Math\.max\(40, Math\.round\(350 - \(finalR0 \* 12\) - \(finalAir \* 40\) - \(finalWater \* 40\)\)\);/;
const newDoomsdayPrediction = `
     // Use a curve that closely matches the SEIR engine's natural infection duration
     const infectionDays = 1200 / Math.pow(Math.max(1.1, finalR0), 0.85);
     const transitFactor = (finalAir + finalWater) > 0.5 ? 0 : 50;
     const pDay = Math.max(80, Math.round(infectionDays + transitFactor));
`;
code = code.replace(oldDoomsdayPrediction, newDoomsdayPrediction);

// For Aegis
const oldAegisPrediction = /const pDay = Math\.max\(30, Math\.round\(350 \+ \(newParams\.r0 \* 20\) - \(newParams\.interventionStringency \* 60\) - \(newParams\.vaccineFunding \* 120\)\)\);/;
const newAegisPrediction = `
                                   // Match the exact vaccine mathematical timing from useSimulation
                                   const vaccineDays = 100 / Math.max(0.01, newParams.vaccineFunding * 0.3);
                                   const effectiveR0 = newParams.r0 * (1 - newParams.interventionStringency * 0.8);
                                   let pDay = 0;
                                   if (effectiveR0 < 1) {
                                      // It dies out naturally before the vaccine finishes
                                      pDay = Math.round(400 / (1 - effectiveR0));
                                   } else {
                                      // Requires vaccine to cure. Vaccine hits 100%, then cures 1% per day (taking ~70 days to wrap up)
                                      pDay = Math.round(vaccineDays + 70);
                                   }
                                   pDay = Math.max(60, pDay);
`;
code = code.replace(oldAegisPrediction, newAegisPrediction);

fs.writeFileSync('src/components/Controls.jsx', code);
console.log('Fixed Controls prediction heuristics');
