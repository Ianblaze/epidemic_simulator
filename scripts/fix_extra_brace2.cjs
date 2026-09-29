const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');
code = code.replace(/setIsRunning\(false\);\s*\n\s*\}\n\s*\}\n\s*\}, \[day, countryStates, isRunning, gameMode\]\);/g, "setIsRunning(false);\n          }\n      }\n  }, [day, countryStates, isRunning, gameMode]);");
fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Fixed extra brace');
