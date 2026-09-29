const fs = require('fs');

let code = fs.readFileSync('src/components/SimulationTab.jsx', 'utf8');

code = code.replace(/>50 days/g, '>100 days');

fs.writeFileSync('src/components/SimulationTab.jsx', code);
console.log('Fixed UI text from 50 days to 100 days');
