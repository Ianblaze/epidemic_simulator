const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// The original line is: if (runningRef.current && Math.random() < 0.1) {
const oldSpawnLogic = /if\s*\(runningRef\.current\s*&&\s*Math\.random\(\)\s*<\s*0\.1\)\s*\{/;

// We will increase the spawn rate dramatically AND loop twice per frame.
const newSpawnLogic = `
        if (runningRef.current) {
          const spawnCount = Math.floor(Math.random() * 3) + 1;
          for (let spawnIndex = 0; spawnIndex < spawnCount; spawnIndex++) {
`;

code = code.replace(oldSpawnLogic, newSpawnLogic);

// We need to add the closing bracket for the new `for` loop.
// The block ends right before "// 4. DRAW AND UPDATE VEHICLES"
const updateVehiclesComment = /\/\/ 4\. DRAW AND UPDATE VEHICLES/;
code = code.replace(updateVehiclesComment, `  }\n        // 4. DRAW AND UPDATE VEHICLES`);

// Increase transit speed so the vehicles don't linger forever and cause lag
code = code.replace(/speed: 0\.0001 \+ Math\.random\(\) \* 0\.0001/g, 'speed: 0.001 + Math.random() * 0.001');
code = code.replace(/speed: 0\.0005 \+ Math\.random\(\) \* 0\.0003/g, 'speed: 0.002 + Math.random() * 0.001');

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Fixed transit spawn rate and speed in FlatWorldMap');
