const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// Change 200 to 730
code = code.replace(/day >= 200/g, "day >= 730");

// Speed up tick
// Change setInterval(tick, 3000 / speedRef.current) -> setInterval(tick, 1000 / speedRef.current)
code = code.replace(/setInterval\(tick, 3000 \/ speedRef\.current\)/g, "setInterval(tick, 1000 / speedRef.current)");
code = code.replace(/setInterval\(tick, 3000 \/ mult\)/g, "setInterval(tick, 1000 / mult)");

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Updated useSimulation.js');
