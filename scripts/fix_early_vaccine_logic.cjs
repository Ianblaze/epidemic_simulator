const fs = require('fs');
let code = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

code = code.replace(
    'if (newVaccineProgress >= 100 && !vaccineProgress >= 100) {',
    'if (newVaccineProgress >= 100 && vaccineProgress < 100) {'
);

fs.writeFileSync('src/simulation/stepSimulation.js', code);
console.log("Fixed boolean precedence");
