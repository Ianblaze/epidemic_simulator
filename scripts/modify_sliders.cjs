const fs = require('fs');
let code = fs.readFileSync('src/components/ParameterSliders.jsx', 'utf8');

const regex = /const inp = \[params\.r0, params\.incubationPeriod, params\.caseFatalityRate, params\.travelVolume\];/;
const replacement = `const inp = [params.r0, params.incubationPeriod, params.caseFatalityRate, params.airImmunity, params.waterImmunity];`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/ParameterSliders.jsx', code);
