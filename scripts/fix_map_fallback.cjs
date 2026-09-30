const fs = require('fs');
let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

const oldEffectStr = `  useEffect(() => {
    if (isRunning && transitEvents && transitEvents.length > 0) {
        transitEvents.forEach(evt => {
            if (evt.type === 'ship') {
                const p1 = airports.find(p => p.country === evt.origin);
                const p2 = airports.find(p => p.country === evt.target);
                if (p1 && p2) {
                    vehiclesRef.current.push({
                        type: 'ship', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,
                        endCountry: p2.target, progress: 0,
                        speed: 0.01 + Math.random() * 0.01,
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
                        endCountry: a2.target, cx: a1.x + dx * 0.5 - dy * 0.2, cy: a1.y + dy * 0.5 + dx * 0.2,
                        progress: 0,
                        speed: 0.02 + Math.random() * 0.01,
                        infected: true, vaccine: false
                    });
                }
            }
        });
    }
  }, [transitEvents]);`;

// Since the string match might be tricky, I'll use regex to replace the entire useEffect
const replaceRegex = /useEffect\(\(\) => \{\s*if \(isRunning && transitEvents[\s\S]*?\}, \[transitEvents\]\);/m;

const newEffectStr = `useEffect(() => {
    if (isRunning && transitEvents && transitEvents.length > 0) {
        transitEvents.forEach(evt => {
            // Find coordinates, fallback to centroids if airport/seaport missing
            let p1 = airports.find(p => p.country === evt.origin);
            let p2 = airports.find(p => p.country === evt.target);
            
            if (!p1 && centroidsRef.current[evt.origin]) p1 = { x: centroidsRef.current[evt.origin][0], y: centroidsRef.current[evt.origin][1] };
            if (!p2 && centroidsRef.current[evt.target]) p2 = { x: centroidsRef.current[evt.target][0], y: centroidsRef.current[evt.target][1] };

            if (p1 && p2) {
                if (evt.type === 'ship') {
                    vehiclesRef.current.push({
                        type: 'ship', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,
                        endCountry: evt.target, progress: 0,
                        speed: 0.01 + Math.random() * 0.01,
                        infected: true, vaccine: false
                    });
                } else {
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    // For land borders, draw a fast small arc. For flights, normal arc.
                    vehiclesRef.current.push({
                        type: 'flight', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,
                        endCountry: evt.target, cx: p1.x + dx * 0.5 - dy * 0.2, cy: p1.y + dy * 0.5 + dx * 0.2,
                        progress: 0,
                        speed: evt.type === 'land' ? 0.05 : 0.02 + Math.random() * 0.01,
                        infected: true, vaccine: false
                    });
                }
            }
        });
    }
  }, [transitEvents]);`;

code = code.replace(replaceRegex, newEffectStr);

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log("Updated useEffect to handle fallback coordinates and land borders");
