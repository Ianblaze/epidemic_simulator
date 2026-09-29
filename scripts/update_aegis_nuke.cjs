const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

if (!code.includes('const nukeFiredRef = useRef(false);')) {
    code = code.replace(/const statesRef = useRef\(null\);/, "const statesRef = useRef(null);\n  const nukeFiredRef = useRef(false);\n  const [nukeFired, setNukeFiredState] = useState(false);\n  const setNukeFired = (val) => { nukeFiredRef.current = val; setNukeFiredState(val); };");
    
    code = code.replace(/gameResult,\n\s*setGameResult,/, "gameResult,\n    setGameResult,\n    nukeFired,\n    setNukeFired,");
    
    code = code.replace(/setGameResult\(null\);/, "setGameResult(null);\n    setNukeFired(false);");
}

const intervalRegex = /(const newStates = prev\.map\(c => \{[\s\S]*?return \{ \.\.\.c, S: newS, E: newE, I: newI, R: newR, D: newD, imported: \{\} \};\r?\n\s*\}\);)/;

const nukeLogic = `
          // AEGIS Nuclear Evaluation
          let sumS = 0, sumE = 0, sumI = 0, sumR = 0, sumD = 0;
          newStates.forEach(c => { sumS+=c.S; sumE+=c.E; sumI+=c.I; sumR+=c.R; sumD+=c.D; });
          const globalPop = sumS + sumE + sumI + sumR + sumD;
          
          if (paramsRef.current.gameMode === 'AEGIS' && globalPop > 0 && !nukeFiredRef.current) {
              const infectedRatio = (sumE + sumI) / globalPop;
              if (infectedRatio > 0.40) { // Desperation threshold: >40% infected globally
                  setNukeFired(true);
                  // Apply nuclear eradication to all states
                  newStates.forEach(c => {
                      c.D += (c.E + c.I);
                      c.E = 0;
                      c.I = 0;
                  });
                  // NOTE: setEventLog can't be easily called here if we don't have it in a ref, 
                  // but we can just let the UI handle the nukeFired state to show the message!
              }
          }
`;

code = code.replace(intervalRegex, "$1\n" + nukeLogic);
// Also wait! gameMode is inside paramsRef? No, gameMode is not in paramsRef. 
// I need a ref for gameMode too! Or I can just check if gameMode === 'AEGIS' if it is in the closure?
// If it's a closure, gameMode won't update. I need gameModeRef.
code = code.replace(/const \[gameMode, setGameModeState\]/, "const gameModeRef = useRef('AEGIS');\n  const [gameMode, setGameModeState]");
// Actually I don't have gameModeState. Let's just create gameModeRef.
code = code.replace(/const \[gameMode, setGameMode\] = useState\('AEGIS'\);/, "const gameModeRef = useRef('AEGIS');\n  const [gameMode, setGameModeState] = useState('AEGIS');\n  const setGameMode = (v) => { gameModeRef.current = v; setGameModeState(v); };");

code = code.replace(/paramsRef\.current\.gameMode === 'AEGIS'/, "gameModeRef.current === 'AEGIS'");

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Updated useSimulation.js for AEGIS Nuclear Protocol');
