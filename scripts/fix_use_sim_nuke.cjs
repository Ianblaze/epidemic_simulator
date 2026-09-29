const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// 1. Add nukeFiredRef and setNukeFired properly
const newNukeDefs = `const [gameResult, setGameResult] = useState(null);
  const nukeFiredRef = useRef(false);
  const [nukeFired, setNukeFiredState] = useState(false);
  const setNukeFired = (val) => { nukeFiredRef.current = val; setNukeFiredState(val); };`;
code = code.replace(/const \[gameResult, setGameResult\] = useState\(null\);/, newNukeDefs);

code = code.replace(/setGameResult\(null\);/, "setGameResult(null);\n    setNukeFired(false);");

// Ensure it's not already in the return block, then add it.
if (!code.includes('nukeFired,')) {
    code = code.replace(/gameResult,\n\s*setGameResult,/, "gameResult,\n    setGameResult,\n    nukeFired,\n    setNukeFired,");
}

// 2. Add nuclear logic inside tick()
const nukeLogic = `
        // AEGIS Nuclear Evaluation
        let sumS = 0, sumE = 0;
        newStates.forEach(s => { sumS += s.S; sumE += s.E; });
        const globalPop = sumS + sumE + globalI + globalR + globalD;
        
        if (gameModeRef.current === 'AEGIS' && globalPop > 0 && !nukeFiredRef.current) {
            const infectedRatio = (sumE + globalI) / globalPop;
            if (infectedRatio > 0.40) {
                setNukeFired(true);
                addNews(nextDay, "⚠️ AEGIS AI EXECUTED NUCLEAR SANITIZATION PROTOCOL. ALL INFECTED ZONES NEUTRALIZED.", 'warning');
                newStates.forEach(c => {
                    c.D += (c.E + c.I);
                    c.E = 0;
                    c.I = 0;
                });
                globalI = 0;
                sumE = 0;
            }
        }
`;

code = code.replace(/generateDynamicNews\(nextDay, newStates, globalI, globalD, globalR\);/, nukeLogic + "\n        generateDynamicNews(nextDay, newStates, globalI, globalD, globalR);");

// We need gameModeRef to be available in tick().
if (!code.includes('gameModeRef')) {
    code = code.replace(/const \[gameMode, setGameModeState\] = useState\('AEGIS'\);/, "const gameModeRef = useRef('AEGIS');\n  const [gameMode, setGameModeState] = useState('AEGIS');\n  const setGameMode = (v) => { gameModeRef.current = v; setGameModeState(v); };");
    // Wait, earlier I checked useSimulation.js and it already has:
    // const gameModeRef = useRef('AEGIS');
    // const [gameMode, setGameModeState] = useState('AEGIS');
    // const setGameMode = (v) => { gameModeRef.current = v; setGameModeState(v); };
    // Let's not double replace it.
}

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Fixed nuke definitions in useSimulation.js');
