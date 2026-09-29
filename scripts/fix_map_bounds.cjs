const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

const oldLonLat = /const lon = bounds\[0\]\[0\] \+ Math\.random\(\) \* \(bounds\[1\]\[0\] - bounds\[0\]\[0\]\);\s*const lat = bounds\[0\]\[1\] \+ Math\.random\(\) \* \(bounds\[1\]\[1\] - bounds\[0\]\[1\]\);/;

const newLonLat = `
              let lon, lat;
              if (bounds[0][0] > bounds[1][0]) {
                 const w1 = 180 - bounds[0][0];
                 const w2 = bounds[1][0] + 180;
                 lon = Math.random() * (w1 + w2) < w1 ? bounds[0][0] + Math.random() * w1 : -180 + Math.random() * w2;
              } else {
                 lon = bounds[0][0] + Math.random() * (bounds[1][0] - bounds[0][0]);
              }
              lat = bounds[0][1] + Math.random() * (bounds[1][1] - bounds[0][1]);
`;

code = code.replace(oldLonLat, newLonLat);

// Increase attempts from 15 to 50 for big countries like Russia
code = code.replace(/attempts < 15/g, 'attempts < 50');

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Fixed FlatWorldMap antimeridian bounds');
