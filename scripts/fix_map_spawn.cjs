const fs = require('fs');
let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

code = code.replace(
    'export default function FlatWorldMap({ countryStates, params, isRunning, inboundInfectionsRef, vaccineProgress = 0 }) {',
    'export default function FlatWorldMap({ countryStates, params, isRunning, inboundInfectionsRef, vaccineProgress = 0, transitEvents = [] }) {'
);

const spawnStart = code.indexOf('// 3. SPAWN TRANSIT VEHICLES (respecting border closures)');
const spawnEnd = code.indexOf('// 4. DRAW AND UPDATE VEHICLES');

const newSpawnLogic = `// 3. SPAWN TRANSIT VEHICLES (driven by mathematical core)
      if (runningRef.current && transitEvents && transitEvents.length > 0) {
          transitEvents.forEach(evt => {
              if (evt.type === 'ship') {
                  const p1 = activeSeaports.find(p => p.country === evt.origin);
                  const p2 = activeSeaports.find(p => p.country === evt.target);
                  if (p1 && p2) {
                      vehiclesRef.current.push({
                          type: 'ship', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,
                          endCountry: p2.country, progress: 0,
                          speed: 0.005 + Math.random() * 0.005,
                          infected: true, vaccine: false
                      });
                  }
              } else {
                  const a1 = activeAirports.find(p => p.country === evt.origin);
                  const a2 = activeAirports.find(p => p.country === evt.target);
                  if (a1 && a2) {
                      const dx = a2.x - a1.x;
                      const dy = a2.y - a1.y;
                      vehiclesRef.current.push({
                          type: 'flight', startX: a1.x, startY: a1.y, endX: a2.x, endY: a2.y,
                          endCountry: a2.country, cx: a1.x + dx * 0.5 - dy * 0.2, cy: a1.y + dy * 0.5 + dx * 0.2,
                          progress: 0,
                          speed: 0.01 + Math.random() * 0.01,
                          infected: true, vaccine: false
                      });
                  }
              }
          });
      }
      `;

if (spawnStart !== -1 && spawnEnd !== -1) {
    code = code.substring(0, spawnStart) + newSpawnLogic + code.substring(spawnEnd);
}

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log("Updated FlatWorldMap transit spawn logic");
