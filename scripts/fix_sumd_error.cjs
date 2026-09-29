const fs = require('fs');

let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// Fix sumD definition
code = code.replace(/let sumS = 0, sumE = 0, sumI = 0;/g, 'let sumS = 0, sumE = 0, sumI = 0, sumD = 0;');
code = code.replace(/sumI \+= c\.I;\s*\}\);/g, 'sumI += c.I;\n         sumD += c.D;\n      });');

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Fixed sumD reference error');
