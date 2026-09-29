const fs = require('fs');

let code = fs.readFileSync('src/components/LiveChart.jsx', 'utf8');

// Change Recovered color to green
code = code.replace(/\{ label: 'Recovered', color: 'var\(--purple\)' \}/g, "{ label: 'Recovered', color: '#00cc44' }");
code = code.replace(/stroke="var\(--purple\)"/g, 'stroke="#00cc44"');

fs.writeFileSync('src/components/LiveChart.jsx', code);
console.log('Fixed chart recovered color');
