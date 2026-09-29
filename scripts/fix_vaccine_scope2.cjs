const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// 1. First, declare let vaccine = false next to let infected = false
code = code.replace(/let infected = false;/g, 'let infected = false; let vaccine = false;');

// 2. Then, remove the inner declaration 'let vaccine = false;'
code = code.replace(/let vaccine = false;\s*if \(vaccineProgress >= 100/g, 'if (vaccineProgress >= 100');

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Fixed vaccine scoping error correctly');
