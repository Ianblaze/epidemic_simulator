const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

const oldThresholdLogic = /const hash = cid\.split\(''\)\.reduce\(\(a, c\) => a \+ c\.charCodeAt\(0\), 0\);\s*const threshold = 0\.01 \+ \(hash % 7\) \* 0\.01; \/\/ varies between 1% and 8%/;
const newThresholdLogic = `
        const hash = cid.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const variation = (hash % 7) * 0.005;
        const baseThreshold = paramsRef.current && paramsRef.current.borderStrictness > 0 
           ? 0.15 - (paramsRef.current.borderStrictness * 0.14) // if strictness is 1, closes at 1%. If 0, closes at 15%
           : 0.05;
        const threshold = Math.max(0.001, baseThreshold + variation);
`;

code = code.replace(oldThresholdLogic, newThresholdLogic);
fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Fixed FlatWorldMap border threshold logic');
