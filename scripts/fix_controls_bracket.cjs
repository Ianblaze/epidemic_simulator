const fs = require('fs');
let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

const regex = /setPredictionReport\(\{ type: 'AEGIS', day: pred\.predictedDay \}\);\n\s*\}\n\s*\}\n\s*disabled=\{!seedCountry/;
const repl = `setPredictionReport({ type: 'AEGIS', day: pred.predictedDay });
                                }
                             }}
                               disabled={!seedCountry`;

code = code.replace(regex, repl);
fs.writeFileSync('src/components/Controls.jsx', code);
