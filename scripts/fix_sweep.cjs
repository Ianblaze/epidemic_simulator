const fs = require('fs');
let code = fs.readFileSync('src/simulation/seir.js', 'utf8');

code = code.replace(
    /if \(gameMode === 'DOOMSDAY' && curI > 0\) \{\s*newExposed \+= Math\.min\(curS, curS \* 0\.05 \+ 10\) \* adt;\s*\}/,
    `if (gameMode === 'DOOMSDAY' && curI > 0 && curS < N * 0.20) {
          // Endgame sweep: Once the herd immunity threshold is nearing (e.g. < 20% remaining), 
          // aggressively hunt down the rest to achieve DOOMSDAY victory conditions.
          newExposed += Math.min(curS, curS * 0.02 + 10) * adt;
      }`
);

fs.writeFileSync('src/simulation/seir.js', code);
console.log("Fixed early game explosion by limiting relentless sweep to endgame");
