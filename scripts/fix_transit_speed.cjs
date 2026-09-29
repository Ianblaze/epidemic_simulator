const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// Slow down the transit speeds slightly as requested
code = code.replace(/speed: 0\.001 \+ Math\.random\(\) \* 0\.001/g, 'speed: 0.0005 + Math.random() * 0.0005');
code = code.replace(/speed: 0\.002 \+ Math\.random\(\) \* 0\.001/g, 'speed: 0.001 + Math.random() * 0.001');

// Massively increase infection transmission chance via transit 
// Previously: if (Math.random() < (state.I / N) * 5 * waterMult)
// Change to: Math.random() < Math.max(0.01, (state.I / N) * 20 * waterMult)
code = code.replace(/if \(Math\.random\(\) < \(state\.I \/ N\) \* 5 \* waterMult\)/g, 'if (Math.random() < Math.max(0.05, (state.I / N) * 20 * waterMult))');
code = code.replace(/if \(Math\.random\(\) < \(state\.I \/ N\) \* 5 \* airMult\)/g, 'if (Math.random() < Math.max(0.05, (state.I / N) * 20 * airMult))');

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Fixed transit speed and infection chances in FlatWorldMap');
