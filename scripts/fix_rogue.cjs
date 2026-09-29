const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

const regex = /if \(gameModeRef\.current === 'DOOMSDAY' && globalI > 100000 && random\(\) < 0\.2\) \{[\s\S]*?\/\/ Generate dynamic news/;

const repl = `if (gameModeRef.current === 'DOOMSDAY' && globalI > 100000 && random() < 0.20) {
    const uninfectedKeys = Array.from(newStates.entries()).filter(x => x[1].I === 0 && x[1].S > 0).map(x => x[0]);
    if (uninfectedKeys.length > 0) {
        const randomId = uninfectedKeys[Math.floor(random() * uninfectedKeys.length)];
        const target = newStates.get(randomId);
        const amount = Math.min(target.S, 100);
        target.S -= amount;
        target.E += amount;
    }
}
// Generate dynamic news`;

code = code.replace(regex, repl);
fs.writeFileSync('src/hooks/useSimulation.js', code);
