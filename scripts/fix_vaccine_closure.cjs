const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// 1. Add vaccineRef definition
code = code.replace(/const runningRef = useRef\(isRunning\);/, 'const runningRef = useRef(isRunning);\n    const vaccineRef = useRef(vaccineProgress || 0);');

// 2. Update it in the useEffect
code = code.replace(/runningRef\.current = isRunning;/, 'runningRef.current = isRunning;\n      vaccineRef.current = vaccineProgress || 0;');

// 3. Add vaccineProgress to the dependency array
code = code.replace(/\[countryStates, params, isRunning\]\);/, '[countryStates, params, isRunning, vaccineProgress]);');

// 4. Change all inside references from vaccineProgress to vaccineRef.current
code = code.replace(/if \(vaccineProgress >= 100/g, 'if (vaccineRef.current >= 100');

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Fixed vaccineProgress closure trap with useRef');
