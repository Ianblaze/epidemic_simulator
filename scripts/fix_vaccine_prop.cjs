const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

code = code.replace(/vaccineProgress \}\)/, 'vaccineProgress = 0 })');

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Added default prop for vaccineProgress');
