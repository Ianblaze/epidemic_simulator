const fs = require('fs');
let code = fs.readFileSync('src/components/CinematicEarth.jsx', 'utf8');

// 1. Add gameMode to Earth props
code = code.replace(/function Earth\(\{\s*isTransitioning/, 'function Earth({ gameMode, isTransitioning');

// 2. Pass gameMode to Earth
code = code.replace(/<Earth isTransitioning=\{isTransitioning\}/, '<Earth gameMode={gameMode} isTransitioning={isTransitioning}');

fs.writeFileSync('src/components/CinematicEarth.jsx', code);
