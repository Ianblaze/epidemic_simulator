const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// 1. Add inboundVaccinesRef to props
code = code.replace(/inboundInfectionsRef,\s*seedCountry,/, 'inboundInfectionsRef,\n  inboundVaccinesRef,\n  seedCountry,');

// 2. Change blue plane spawn logic for BOTH ships and flights
// Old: if (vaccineRef.current >= 100 && Math.random() < 0.2) vaccine = true;
const spawnOld = /if \(vaccineRef\.current >= 100 && Math\.random\(\) < 0\.2\) vaccine = true;/g;
const spawnNew = `if (state && state.vaccineAvailable && Math.random() < 0.4) vaccine = true;`;
code = code.replace(spawnOld, spawnNew);

// 3. Change blue plane arrival logic
const arrivalOld = /if \(v\.infected && inboundInfectionsRef && inboundInfectionsRef\.current\) \{[\s\S]*?inboundInfectionsRef\.current\.push\(\{ countryId: v\.endCountry, amount: Math\.floor\(Math\.random\(\) \* 10\) \+ 1 \}\);\s*\}/g;

const arrivalNew = `if (v.infected && inboundInfectionsRef && inboundInfectionsRef.current) {
               inboundInfectionsRef.current.push({ countryId: v.endCountry, amount: Math.floor(Math.random() * 10) + 1 });
             }
             if (v.vaccine && inboundVaccinesRef && inboundVaccinesRef.current) {
               inboundVaccinesRef.current.push(v.endCountry);
             }`;
code = code.replace(arrivalOld, arrivalNew);

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Updated FlatWorldMap for dynamic blue planes');
