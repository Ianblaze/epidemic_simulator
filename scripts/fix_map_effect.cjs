const fs = require('fs');
let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

const spawnStart = code.indexOf('// 3. SPAWN TRANSIT VEHICLES (driven by mathematical core)');
const spawnEnd = code.indexOf('// 4. DRAW AND UPDATE VEHICLES');

if (spawnStart !== -1 && spawnEnd !== -1) {
    code = code.substring(0, spawnStart) + '\n      ' + code.substring(spawnEnd);
}

// Now insert a useEffect to handle transitEvents
const effectInsertionPoint = code.indexOf('useEffect(() => {', code.indexOf('const drawMap = () => {'));
if (effectInsertionPoint !== -1) {
    const useEffectCode = `  useEffect(() => {
    if (isRunning && transitEvents && transitEvents.length > 0) {
        transitEvents.forEach(evt => {
            if (evt.type === 'ship') {
                const p1 = airports.find(p => p.country === evt.origin); // Using airports as fallback if seaport missing
                const p2 = airports.find(p => p.country === evt.target);
                if (p1 && p2) {
                    vehiclesRef.current.push({
                        type: 'ship', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,
                        endCountry: p2.country, progress: 0,
                        speed: 0.005 + Math.random() * 0.005,
                        infected: true, vaccine: false
                    });
                }
            } else {
                const a1 = airports.find(p => p.country === evt.origin);
                const a2 = airports.find(p => p.country === evt.target);
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
  }, [transitEvents]);
  
  `;
    code = code.substring(0, effectInsertionPoint) + useEffectCode + code.substring(effectInsertionPoint);
}

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log("Moved transit spawn to useEffect");
