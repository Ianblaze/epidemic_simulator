const fs = require('fs');
let code = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

const regex = /if \(gameMode === 'DOOMSDAY'\) \{\s*const cumulativeInfectedRatio = \(globalPop - globalS\) \/ globalPop;\s*\}\s*\}\s*\}/;
code = code.replace(regex, '');

fs.writeFileSync('src/simulation/stepSimulation.js', code);
console.log("Fixed syntax error");
