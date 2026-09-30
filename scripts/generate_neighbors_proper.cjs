const fs = require('fs');
const topojson = require('topojson-client');

const topology = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'));
const geojson = topojson.feature(topology, topology.objects.countries);

const d3 = require('d3-geo');

const centroids = {};
geojson.features.forEach(f => {
    if (f.properties && f.properties.name) {
        const id = f.properties.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        centroids[id] = d3.geoCentroid(f);
    }
});

let countriesStr = fs.readFileSync('src/data/countries.js', 'utf8');
const countriesStart = countriesStr.indexOf('[');
const countriesEnd = countriesStr.lastIndexOf(']');
let countriesArray = eval(countriesStr.substring(countriesStart, countriesEnd + 1));

// Calculate distances to find closest neighbors
countriesArray.forEach(c => {
    c.neighbors = [];
    const c1 = centroids[c.id];
    if (c1) {
        countriesArray.forEach(other => {
            if (other.id !== c.id) {
                const c2 = centroids[other.id];
                if (c2) {
                    const dx = c1[0] - c2[0];
                    const dy = c1[1] - c2[1];
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    // 12 degrees is roughly 1300 km
                    if (dist < 12) {
                        c.neighbors.push(other.id);
                    }
                }
            }
        });
    }
});

// REMOVED the random neighbor fallback! Islands will now strictly rely on Air/Sea mathematical spread!

const newCode = `const countries = ${JSON.stringify(countriesArray, null, 2)};\n\nexport default countries;\n`;
fs.writeFileSync('src/data/countries.js', newCode);
console.log("Regenerated neighbors without random assignments");
