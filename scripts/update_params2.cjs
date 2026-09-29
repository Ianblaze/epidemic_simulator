const fs = require('fs');
let code = fs.readFileSync('src/components/ParameterSliders.jsx', 'utf8');

code = code.replace(/gameMode === 'VENOM'/g, "gameMode === 'DOOMSDAY'");
fs.writeFileSync('src/components/ParameterSliders.jsx', code);
