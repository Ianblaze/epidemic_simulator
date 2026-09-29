const fs = require('fs');
let code = fs.readFileSync('src/components/SimulationTab.jsx', 'utf8');

code = code.replace(/before day 200/g, "before year 2 (day 730)");
code = code.replace(/within 200 days/g, "within 2 years (730 days)");
code = code.replace(/beyond 200 days/g, "beyond 2 years (730 days)");

fs.writeFileSync('src/components/SimulationTab.jsx', code);
console.log('Updated SimulationTab.jsx texts');
