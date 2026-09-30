const fs = require('fs');
let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// Fix 1: Enable infection on plane arrival
code = code.replace(
    '// inboundInfectionsRef.current.push({ countryId: v.endCountry, amount: 10 }); // Disabled so math core drives spread',
    'inboundInfectionsRef.current.push({ countryId: v.endCountry, amount: v.payload || 10 });'
);

// Fix 2: When spawning transit event planes, pass the payload amount
// Find where transit event planes are created and add payload
code = code.replace(
    "speed: evt.type === 'land' ? 0.05 : 0.02 + Math.random() * 0.01,\n                          infected: evt.isVaccine ? false : true, vaccine: evt.isVaccine ? true : false",
    "speed: evt.type === 'land' ? 0.05 : 0.02 + Math.random() * 0.01,\n                          infected: evt.isVaccine ? false : true, vaccine: evt.isVaccine ? true : false, payload: evt.amount || 10"
);

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log("Fixed: infection now deferred until plane arrives visually");
