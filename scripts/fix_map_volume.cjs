const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// Decrease volume
code = code.replace(/const spawnCount = Math\.floor\(Math\.random\(\) \* 3\) \+ 1;/g, 'const spawnCount = Math.random() < 0.4 ? 1 : 0;');

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Decreased flight/ship volume');
