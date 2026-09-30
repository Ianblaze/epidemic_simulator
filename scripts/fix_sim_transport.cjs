const fs = require('fs');
let code = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

code = code.replace(
    /const amount = (.*?);\s*ns\.S -= Math\.min\(ns\.S, amount\);\s*ns\.E \+= Math\.min\(ns\.S, amount\);/g,
    'const amount = $1;\n                        const actualAmount = Math.min(ns.S, amount);\n                        ns.S -= actualAmount;\n                        ns.E += actualAmount;'
);

code = code.replace(
    /const amount = (.*?);\s*rTarget\.S -= Math\.min\(rTarget\.S, amount\);\s*rTarget\.E \+= Math\.min\(rTarget\.S, amount\);/g,
    'const amount = $1;\n                            const actualAmount = Math.min(rTarget.S, amount);\n                            rTarget.S -= actualAmount;\n                            rTarget.E += actualAmount;'
);

fs.writeFileSync('src/simulation/stepSimulation.js', code);
console.log("Fixed S/E subtraction bugs in stepSimulation");
