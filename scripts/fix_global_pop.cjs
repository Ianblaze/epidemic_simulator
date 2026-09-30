const fs = require('fs');
let code = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

code = code.replace(
    'let globalS = 0, globalE = 0, globalD = 0;',
    'let globalS = 0, globalE = 0, globalD = 0, globalR = 0;'
);

code = code.replace(
    'totalGlobalI += targetState.I;\n        globalD += targetState.D;',
    'totalGlobalI += targetState.I;\n        globalR += targetState.R;\n        globalD += targetState.D;'
);

code = code.replace(
    'const globalPop = globalS + globalE + totalGlobalI + globalD;',
    'const globalPop = globalS + globalE + totalGlobalI + globalR + globalD;'
);

fs.writeFileSync('src/simulation/stepSimulation.js', code);
console.log("Fixed globalPop");
