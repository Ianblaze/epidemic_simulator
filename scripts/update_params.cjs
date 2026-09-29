const fs = require('fs');
let code = fs.readFileSync('src/components/ParameterSliders.jsx', 'utf8');

// Use regex to strip out the MODE SELECTOR and VENOM block
const newCode = code.replace(/\{\/\* MODE SELECTOR \*\/\}[\s\S]*?(?=\{gameMode === 'AEGIS')/m, '');
fs.writeFileSync('src/components/ParameterSliders.jsx', newCode);
