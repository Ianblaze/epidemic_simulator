const fs = require('fs');

let codeSim = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');
codeSim = codeSim.replace(/vaccineProgressRef\.current \+= \(paramsRef\.current\.vaccineFunding \|\| 0\) \* 0\.3;/, 'vaccineProgressRef.current += (paramsRef.current.vaccineFunding || 0) * 1.2;');
// Smooth the recovery logic slightly
// Change ±50 to ±100 tolerance for winning
codeSim = codeSim.replace(/Math\.abs\(day - paramsRef\.current\.predictedDay\) <= 50/g, 'Math.abs(day - paramsRef.current.predictedDay) <= 100');
fs.writeFileSync('src/hooks/useSimulation.js', codeSim);
console.log('Fixed useSimulation.js');

let codeCtrl = fs.readFileSync('src/components/Controls.jsx', 'utf8');
codeCtrl = codeCtrl.replace(/const vaccineDays = 100 \/ Math\.max\(0\.01, newParams\.vaccineFunding \* 0\.3\);/, 'const vaccineDays = 100 / Math.max(0.01, newParams.vaccineFunding * 1.2);');
fs.writeFileSync('src/components/Controls.jsx', codeCtrl);
console.log('Fixed Controls.jsx');
