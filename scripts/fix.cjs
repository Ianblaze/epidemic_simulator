const fs = require('fs');
let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

code = code.replace(
  'export default function FlatWorldMap({ countryStates, params }) {',
  'export default function FlatWorldMap({ countryStates, params, isRunning, inboundInfectionsRef }) {'
);

code = code.replace(
  'const paramsRef = useRef(params);',
  'const paramsRef = useRef(params);\n  const runningRef = useRef(isRunning);'
);

code = code.replace(
  'paramsRef.current = params;',
  'paramsRef.current = params;\n    runningRef.current = isRunning;'
);

code = code.replace(
  '}, [countryStates, params]);',
  '}, [countryStates, params, isRunning]);'
);

code = code.replace(
  'while (drawnDotsRef.current[cid] < targetDots && attempts < 25) {',
  'while (runningRef.current && drawnDotsRef.current[cid] < targetDots && attempts < 25) {'
);

code = code.replace(
  '// 3. SPAWN TRANSIT VEHICLES\n      if (Math.random() < 0.1) {',
  '// 3. SPAWN TRANSIT VEHICLES\n      if (runningRef.current && Math.random() < 0.1) {'
);

code = code.replace(
  /type: 'ship', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,/g,
  "type: 'ship', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y, endCountry: p2.country,"
);

code = code.replace(
  /type: 'flight', startX: a1.x, startY: a1.y, endX: a2.x, endY: a2.y,/g,
  "type: 'flight', startX: a1.x, startY: a1.y, endX: a2.x, endY: a2.y, endCountry: a2.country,"
);

code = code.replace(
  'v.progress += v.speed;',
  'if (runningRef.current) v.progress += v.speed;'
);

code = code.replace(
  'if (v.progress >= 1) {\n          vehiclesRef.current.splice(i, 1);\n          continue;\n        }',
  'if (v.progress >= 1) {\n          if (v.infected && inboundInfectionsRef && inboundInfectionsRef.current) {\n             inboundInfectionsRef.current.push({ country: v.endCountry, type: v.type });\n          }\n          vehiclesRef.current.splice(i, 1);\n          continue;\n        }'
);

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('done');
