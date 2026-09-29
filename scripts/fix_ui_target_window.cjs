const fs = require('fs');

let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

code = code.replace(/predictionReport\.day - 50\)} - \{predictionReport\.day \+ 50/g, 'predictionReport.day - 100)} - {predictionReport.day + 100');
code = code.replace(/\(predictionReport\?\.day \|\| 0\) - 50\)} - \{\(predictionReport\?\.day \|\| 0\) \+ 50/g, '(predictionReport?.day || 0) - 100)} - {(predictionReport?.day || 0) + 100');

fs.writeFileSync('src/components/Controls.jsx', code);
console.log('Fixed target window in Controls.jsx');
