const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

code = code.replace(/gameMode,\s*setGameMode,/, "gameMode,\n    setGameMode,\n    gameResult,\n    setGameResult,");

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Fixed useSimulation.js return block');
