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
                    // 10 degrees is roughly 1100 km, good enough for "neighbors"
                    if (dist < 15) {
                        c.neighbors.push(other.id);
                    }
                }
            }
        });
    }
});

// For countries missing centroids, randomly assign 1-2 neighbors to ensure connectivity
countriesArray.forEach(c => {
    if (!c.neighbors || c.neighbors.length === 0) {
        c.neighbors = [];
        for (let i = 0; i < 2; i++) {
            const randNeighbor = countriesArray[Math.floor(Math.random() * countriesArray.length)].id;
            if (randNeighbor !== c.id && !c.neighbors.includes(randNeighbor)) {
                c.neighbors.push(randNeighbor);
            }
        }
    }
});

const newCode = `const countries = ${JSON.stringify(countriesArray, null, 2)};\n\nexport default countries;\n`;
fs.writeFileSync('src/data/countries.js', newCode);
console.log("Injected neighbors into countries.js");
