const fs = require('fs');
let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

const regex = /setPredictionReport\(\{ type: 'AEGIS', day: pred\.predictedDay \}\);\n\s*\}\}\n\s*disabled=\{!seedCountry/g;
code = code.replace(regex, `setPredictionReport({ type: 'AEGIS', day: pred.predictedDay });\n                                }\n                             }}}\n                             disabled={!seedCountry`);
fs.writeFileSync('src/components/Controls.jsx', code);
