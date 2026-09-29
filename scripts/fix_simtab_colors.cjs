const fs = require('fs');

let code = fs.readFileSync('src/components/SimulationTab.jsx', 'utf8');

// Change var(--r) and var(--purple) to #00cc44 for the Recovered text and segment
code = code.replace(/color: 'var\(--r\)'/g, "color: '#00cc44'");
code = code.replace(/background: 'var\(--r\)'/g, "background: '#00cc44'");

fs.writeFileSync('src/components/SimulationTab.jsx', code);
console.log('Fixed SimulationTab colors');
