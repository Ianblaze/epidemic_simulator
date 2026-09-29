import fs from 'fs';

// 1. Parse Airports
const airportsCsv = fs.readFileSync('friend_repo/outputs/airports_processed.csv', 'utf8');
const airportsLines = airportsCsv.split('\n').slice(1);

const airportsMap = new Map();
for (const line of airportsLines) {
    if (!line) continue;
    const cols = [];
    let cur = '';
    let inQuotes = false;
    for(let i=0; i<line.length; i++){
        const char = line[i];
        if(char === '"') { inQuotes = !inQuotes; }
        else if(char === ',' && !inQuotes) { cols.push(cur); cur = ''; }
        else { cur += char; }
    }
    cols.push(cur);
    
    if (cols.length < 8) continue;
    const id = cols[1];
    let country = cols[3].toUpperCase().replace(/[^A-Z]/g, '');
    if (country === 'UNITEDSTATES') country = 'UNITEDSTATESOFAMERICA';
    const name = cols[4];
    const lat = parseFloat(cols[6]);
    const lon = parseFloat(cols[7]);
    
    if (!isNaN(lat) && !isNaN(lon)) {
        airportsMap.set(id, { name, country, lat, lon });
    }
}

// 2. Parse Routes
const routesCsv = fs.readFileSync('friend_repo/outputs/routes_processed.csv', 'utf8');
const routesLines = routesCsv.split('\n').slice(1);

const routeCounts = new Map();
const activeAirports = new Set();

for (const line of routesLines) {
    if (!line) continue;
    const cols = line.split(',');
    if (cols.length < 7) continue;
    
    const srcId = cols[4];
    const dstId = cols[6];
    
    if (airportsMap.has(srcId) && airportsMap.has(dstId)) {
        const srcCountry = airportsMap.get(srcId).country;
        const dstCountry = airportsMap.get(dstId).country;
        if (srcCountry !== dstCountry) {
            const key = `${srcId}-${dstId}`;
            routeCounts.set(key, (routeCounts.get(key) || 0) + 1);
        }
    }
}

const sortedRoutes = Array.from(routeCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 2000);

const finalFlights = [];
sortedRoutes.forEach(([key]) => {
    const [src, dst] = key.split('-');
    activeAirports.add(src);
    activeAirports.add(dst);
    finalFlights.push([`A_${src}`, `A_${dst}`]);
});

const finalAirports = [];
activeAirports.forEach(id => {
    const a = airportsMap.get(id);
    if(a) {
        finalAirports.push({
            id: `A_${id}`,
            name: a.name,
            lat: a.lat,
            lon: a.lon,
            country: a.country
        });
    }
});

const currentTransit = fs.readFileSync('src/data/transit.js', 'utf8');
const seaportsMatch = currentTransit.match(/export const seaports = (\[[\s\S]*?\]);/);

const seaportsText = seaportsMatch ? seaportsMatch[1] : '[]';
let shipsText = '[]';
if (currentTransit.includes('"ships": [')) {
    const startIdx = currentTransit.indexOf('"ships": [') + 9;
    const endIdx = currentTransit.lastIndexOf(']');
    shipsText = currentTransit.substring(startIdx, endIdx + 1);
}

const newTransitContent = `// Automatically generated from devansh-singh-7/SEIRD-Model OpenFlights data

export const airports = ${JSON.stringify(finalAirports, null, 2)};

export const seaports = ${seaportsText};

export const routes = {
  "flights": ${JSON.stringify(finalFlights, null, 4)},
  "ships": ${shipsText}
};
`;

fs.writeFileSync('src/data/transit.js', newTransitContent);
