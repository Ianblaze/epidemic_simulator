const fs = require('fs');

let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

const oldVaccine = /vaccineProgressRef\.current \+= \(paramsRef\.current\.vaccineFunding \|\| 0\) \* 1\.8 \* stabilityMultiplier;/;
const newVaccine = `vaccineProgressRef.current += (paramsRef.current.vaccineFunding || 0) * 0.33 * stabilityMultiplier;`;
code = code.replace(oldVaccine, newVaccine);

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Fixed vaccine speed in useSimulation.js');

let codeCtrl = fs.readFileSync('src/components/Controls.jsx', 'utf8');
const oldCtrl = /const vaccineDays = 100 \/ Math\.max\(0\.01, newParams\.vaccineFunding \* 1\.2\);/;
// Look for 1.2, or maybe I replaced it with something else? Let's use a regex to capture it.
const flexCtrl = /const vaccineDays = 100 \/ Math\.max\(0\.01, newParams\.vaccineFunding \* [\d\.]+\);/;
const newCtrl = `const vaccineDays = 100 / Math.max(0.01, newParams.vaccineFunding * 0.33);`;
codeCtrl = codeCtrl.replace(flexCtrl, newCtrl);

fs.writeFileSync('src/components/Controls.jsx', codeCtrl);
console.log('Fixed vaccine speed prediction in Controls.jsx');
