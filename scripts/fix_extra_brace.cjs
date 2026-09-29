const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');
code = code.replace(/\\s*\\}\\n\\s*\\}\\n\\s*\\}, \\[day/g, '\n      }\n  }, [day');
fs.writeFileSync('src/hooks/useSimulation.js', code);
