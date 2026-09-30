const fs = require('fs');
let code = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

// 1. Remove the instant 100% distribution
code = code.replace(
    /if \(newVaccineProgress >= 100\) \{\s*newStates\.forEach\(s => s\.vaccineAvailable = true\);\s*\}/,
    '// Vaccine now spreads strictly via transit events at 100% progress'
);

// 2. Add vaccine export logic to the main loop
const targetCode = `
        if (targetState.I > 50) {
`;

const replacementCode = `
        if (targetState.vaccineAvailable && newVaccineProgress >= 75) {
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

        if (targetState.I > 50) {
`;

code = code.replace(targetCode, replacementCode);
fs.writeFileSync('src/simulation/stepSimulation.js', code);
console.log("Updated stepSimulation for vaccine transit");
