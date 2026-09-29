const fs = require('fs');

let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

code = code.replace(/setGameResult\('LOSS'\);\s*setIsRunning\(false\);\s*\n\s*\} else if \(gameMode === 'AEGIS'\) \{/g, "setGameResult('LOSS');\n            setIsRunning(false);\n        }\n    } else if (gameMode === 'AEGIS') {");

code = code.replace(/setGameResult\('LOSS'\);\s*setIsRunning\(false\);\s*\n\s*\}\n  \}, \[day/g, "setGameResult('LOSS');\n            setIsRunning(false);\n        }\n    }\n  }, [day");

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Fixed missing braces');
