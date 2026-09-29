const fs = require('fs');

let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// Remove day >= 730 condition completely
code = code.replace(/\} else if \(day >= 730\) \{\s*setGameResult\('LOSS'\);\s*setIsRunning\(false\);\s*\}/g, '');

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Removed 730 day limit properly');
