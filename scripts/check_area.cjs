const fs = require('fs');
const d3 = require('d3-geo');
const topojson = require('topojson-client');
const data = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json'));
const geoData = topojson.feature(data, data.objects.countries);
const russia = geoData.features.find(f => f.properties.name === 'Russia');
console.log('Russia area:', d3.geoArea(russia));
