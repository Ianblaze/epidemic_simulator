const fs = require('fs');
let code = fs.readFileSync('src/components/ParameterSliders.jsx', 'utf8');

// Remove the Mode Selector buttons
code = code.replace(/\{\/\* MODE SELECTOR \*\/\}.*?<\/div>/s, '');

// Change 'VENOM' to 'DOOMSDAY'
code = code.replace(/'VENOM'/g, "'DOOMSDAY'");
code = code.replace(/VENOM/g, "DOOMSDAY");

// Remove the "GENERATE OPTIMAL PATHOGEN" block since it's now in Controls.jsx
code = code.replace(/\{gameMode === 'DOOMSDAY' && \([\s\S]*?\}\)/, '');

fs.writeFileSync('src/components/ParameterSliders.jsx', code);
