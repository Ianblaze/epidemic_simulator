const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

code = code.replace(/inboundInfectionsRef=\{simulation\.inboundInfectionsRef\}/, 'inboundInfectionsRef={simulation.inboundInfectionsRef}\n              inboundVaccinesRef={simulation.inboundVaccinesRef}');

fs.writeFileSync('src/App.jsx', code);
console.log('Updated App.jsx with inboundVaccinesRef');
