const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// Fix red planes glitch: replace Math.max(0.05, ...) with an exponential curve
code = code.replace(/if \(Math\.random\(\) < Math\.max\(0\.05, \(state\.I \/ N\) \* 20 \* waterMult\)\) infected = true;/g, 'if (Math.random() < (1 - Math.exp(-state.I / 50000)) * waterMult) infected = true;');
code = code.replace(/if \(Math\.random\(\) < Math\.max\(0\.05, \(state\.I \/ N\) \* 20 \* airMult\)\) infected = true;/g, 'if (Math.random() < (1 - Math.exp(-state.I / 50000)) * airMult) infected = true;');

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Fixed red planes glitch in FlatWorldMap');
