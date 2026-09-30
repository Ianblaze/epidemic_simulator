const fs = require('fs');
let code = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

// 1. Change transit threshold to 100
code = code.replace(
    'if (targetState.vaccineAvailable && newVaccineProgress >= 75) {',
    'if (targetState.vaccineAvailable && newVaccineProgress >= 100) {'
);

// 2. Remove the 25%, 50%, 75% early distributions
const earlyDist = code.substring(
    code.indexOf('let newVaccineStarted = vaccineStarted;'),
    code.indexOf('// Vaccine now spreads strictly via transit events at 100% progress')
);

const newDist = `let newVaccineStarted = vaccineStarted;
    if (newVaccineProgress > 0 && !vaccineStarted) {
        newVaccineStarted = true;
    }
    
    // AT EXACTLY 100%, GIVE VACCINE TO MAJOR HUBS SO THEY CAN START EXPORTING IT VIA BLUE PLANES
    if (newVaccineProgress >= 100 && !vaccineProgress >= 100) { // wait, vaccineProgress is the previous tick's progress
        const prominentCountries = ['USA', 'CHN', 'GBR', 'FRA', 'DEU', 'JPN'];
        prominentCountries.forEach(id => {
            if (newStates.has(id)) {
                newStates.get(id).vaccineAvailable = true;
            }
        });
    }
    `;

code = code.replace(earlyDist, newDist);

fs.writeFileSync('src/simulation/stepSimulation.js', code);
console.log("Fixed vaccine early deployment logic");
