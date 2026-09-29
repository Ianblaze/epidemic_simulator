const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// 1. Add vaccineProgress to props
code = code.replace(/export default function FlatWorldMap\(\{ countryStates, params, isRunning, inboundInfectionsRef \}\)/, 'export default function FlatWorldMap({ countryStates, params, isRunning, inboundInfectionsRef, vaccineProgress })');

// 2. Spawn blue planes if vaccineProgress >= 100
// Add vaccine parameter to vehicle object
const spawnLogic = `if (Math.random() < (1 - Math.exp(-state.I / 50000)) * waterMult) infected = true;`;
const spawnLogicNew = `if (Math.random() < (1 - Math.exp(-state.I / 50000)) * waterMult) infected = true;
               let vaccine = false;
               if (vaccineProgress >= 100 && Math.random() < 0.2) vaccine = true;`;
code = code.replace(spawnLogic, spawnLogicNew);

const spawnLogicAir = `if (Math.random() < (1 - Math.exp(-state.I / 50000)) * airMult) infected = true;`;
const spawnLogicAirNew = `if (Math.random() < (1 - Math.exp(-state.I / 50000)) * airMult) infected = true;
               let vaccine = false;
               if (vaccineProgress >= 100 && Math.random() < 0.2) vaccine = true;`;
code = code.replace(spawnLogicAir, spawnLogicAirNew);

code = code.replace(/infected, lastTrailProg/g, 'infected, vaccine, lastTrailProg');

// 3. Draw blue planes
const shipColor = /ctx\.fillStyle = v\.infected \? 'rgba\(255, 50, 50, 0\.9\)' : 'rgba\(100, 200, 255, 0\.7\)';/;
const newShipColor = `ctx.fillStyle = v.vaccine ? 'rgba(0, 255, 255, 0.9)' : (v.infected ? 'rgba(255, 50, 50, 0.9)' : 'rgba(100, 200, 255, 0.7)');`;
code = code.replace(shipColor, newShipColor);

const planeColor = /ctx\.fillStyle = v\.infected \? 'rgba\(255, 50, 50, 0\.9\)' : 'rgba\(255, 255, 255, 0\.9\)';/;
const newPlaneColor = `ctx.fillStyle = v.vaccine ? 'rgba(0, 255, 255, 0.9)' : (v.infected ? 'rgba(255, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)');`;
code = code.replace(planeColor, newPlaneColor);

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Added blue vaccine planes');
