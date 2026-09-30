const fs = require('fs');
let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// Stop UI planes from injecting infections!
code = code.replace(
    /inboundInfectionsRef\.current\.push\(\{[\s\S]*?\}\);/,
    '// inboundInfectionsRef.current.push({ countryId: v.endCountry, amount: 10 }); // Disabled so math core drives spread'
);

// Add transitEvents to props
if (!code.includes('transitEvents = []')) {
    code = code.replace(
        'export default function FlatWorldMap({ countryStates, params, isRunning, inboundInfectionsRef, vaccineProgress = 0 }) {',
        'export default function FlatWorldMap({ countryStates, params, isRunning, inboundInfectionsRef, vaccineProgress = 0, transitEvents = [] }) {'
    );
}

// Ensure normal planes stop if a country is heavily infected (closed borders)
// Look for where normal planes spawn:
code = code.replace(
    'if (p1 && p2 && !p1.closed && !p2.closed) {',
    `const s1 = statesRef.current ? statesRef.current.get(p1.country) : null;
            const s2 = statesRef.current ? statesRef.current.get(p2.country) : null;
            const closed1 = s1 && s1.I > (s1.S + s1.E + s1.I + s1.R) * 0.2; // Close borders if >20% infected
            const closed2 = s2 && s2.I > (s2.S + s2.E + s2.I + s2.R) * 0.2;
            if (p1 && p2 && !p1.closed && !p2.closed && !closed1 && !closed2) {`
);

code = code.replace(
    'if (a1 && a2 && !a1.closed && !a2.closed) {',
    `const s1 = statesRef.current ? statesRef.current.get(a1.country) : null;
            const s2 = statesRef.current ? statesRef.current.get(a2.country) : null;
            const closed1 = s1 && s1.I > (s1.S + s1.E + s1.I + s1.R) * 0.2;
            const closed2 = s2 && s2.I > (s2.S + s2.E + s2.I + s2.R) * 0.2;
            if (a1 && a2 && !a1.closed && !a2.closed && !closed1 && !closed2) {`
);

// Insert useEffect for transitEvents (force-spawning red planes that strictly match math core)
const effectInsertionPoint = code.indexOf('useEffect(() => {', code.indexOf('const drawMap = () => {'));
if (effectInsertionPoint !== -1 && !code.includes('transitEvents.forEach')) {
    const useEffectCode = `  useEffect(() => {
    if (isRunning && transitEvents && transitEvents.length > 0) {
        transitEvents.forEach(evt => {
            if (evt.type === 'ship') {
                const p1 = airports.find(p => p.country === evt.origin);
                const p2 = airports.find(p => p.country === evt.target);
                if (p1 && p2) {
                    vehiclesRef.current.push({
                        type: 'ship', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,
                        endCountry: p2.country, progress: 0,
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
                        endCountry: a2.country, cx: a1.x + dx * 0.5 - dy * 0.2, cy: a1.y + dy * 0.5 + dx * 0.2,
                        progress: 0,
                        speed: 0.02 + Math.random() * 0.01,
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
console.log("Updated FlatWorldMap completely!");
