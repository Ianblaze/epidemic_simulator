const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// For ships
const shipLogicOld = /let infected = false;\s*let vaccine = false;\s*if \(state && state\.I > 0\) \{[\s\S]*?if \(vaccineRef\.current >= 100 && Math\.random\(\) < 0\.2\) vaccine = true;\s*\}/;
const shipLogicNew = `let infected = false;
             let vaccine = false;
             if (vaccineRef.current >= 100 && Math.random() < 0.2) vaccine = true;
             
             if (state && state.I > 0) {
               const N = state.S + state.E + state.I + state.R + state.D;
               const waterMult = paramsRef.current ? 1 + (paramsRef.current.waterImmunity || 0) * 10 : 1;
               if (Math.random() < (1 - Math.exp(-state.I / 50000)) * waterMult) infected = true;
             }`;
code = code.replace(shipLogicOld, shipLogicNew);

// For flights
const flightLogicOld = /let infected = false;\s*let vaccine = false;\s*if \(state && state\.I > 0\) \{[\s\S]*?if \(vaccineRef\.current >= 100 && Math\.random\(\) < 0\.2\) vaccine = true;\s*\}/;
const flightLogicNew = `let infected = false;
             let vaccine = false;
             if (vaccineRef.current >= 100 && Math.random() < 0.2) vaccine = true;
             
             if (state && state.I > 0) {
               const N = state.S + state.E + state.I + state.R + state.D;
               const airMult = paramsRef.current ? 1 + (paramsRef.current.airImmunity || 0) * 10 : 1;
               if (Math.random() < (1 - Math.exp(-state.I / 50000)) * airMult) infected = true;
             }`;
code = code.replace(flightLogicOld, flightLogicNew);

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Fixed blue planes spawning logic');
