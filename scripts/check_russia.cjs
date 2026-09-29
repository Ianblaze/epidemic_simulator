const fs = require('fs');
const data = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json'));
const geoms = data.objects.countries.geometries;
const russia = geoms.find(g => g.properties && g.properties.name && g.properties.name.includes('Russia'));
console.log(russia ? russia.properties : 'Not found');
