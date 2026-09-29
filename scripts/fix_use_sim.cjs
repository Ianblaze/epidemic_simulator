const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// Fix the bad replacement
code = code.replace(/const \[gameMode,\n    gameResult,\n    setGameResult, setGameMode\] = useState\('AEGIS'\);/, "const [gameMode, setGameMode] = useState('AEGIS');");

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Fixed useSimulation.js');
