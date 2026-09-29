const fs = require('fs');

let code = fs.readFileSync('src/components/SimulationTab.jsx', 'utf8');

const target = '<div className="seg" style={{ width: `${pE}%`, background: \'var(--e)\' }}></div>';
const replacement = '<div className="seg" style={{ width: `${pS}%`, background: \'var(--s)\', opacity: 0.8 }}></div>\n                      <div className="seg" style={{ width: `${pE}%`, background: \'var(--e)\' }}></div>';

code = code.replace(target, replacement);

fs.writeFileSync('src/components/SimulationTab.jsx', code);
console.log('Restored healthy segment in status bar');
