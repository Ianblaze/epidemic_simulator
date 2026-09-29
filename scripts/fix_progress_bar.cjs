const fs = require('fs');

let code = fs.readFileSync('src/components/SimulationTab.jsx', 'utf8');

// Change progress bar container to have dark background
code = code.replace(/<div className="global-progress">/g, '<div className="global-progress" style={{ background: \'#111\' }}>');

// Remove the Healthy (pS) segment from the progress bar
code = code.replace(/<div className="seg" style={{ width: `\$\{pS\}%`, background: 'var\(--s\)' }}><\/div>/g, '');

fs.writeFileSync('src/components/SimulationTab.jsx', code);
console.log('Fixed SimulationTab progress bar');
