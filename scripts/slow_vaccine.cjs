const fs = require('fs');
let code = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

code = code.replace(
    'newVaccineProgress += (currentParams.vaccineFunding || 0) * 0.55;',
    'newVaccineProgress += (currentParams.vaccineFunding || 0) * 0.20; // Slower, more realistic development time'
);

fs.writeFileSync('src/simulation/stepSimulation.js', code);
console.log("Slowed down vaccine development");
