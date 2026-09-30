const fs = require('fs');
let code = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

const safetyNetRegex = /if \(cumulativeInfectedRatio > 0\.5\) \{[\s\S]*?\}\n\s*\}/;
code = code.replace(safetyNetRegex, '');

fs.writeFileSync('src/simulation/stepSimulation.js', code);
console.log("Removed safety net");
