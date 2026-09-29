const fs = require('fs');

const fileContent = fs.readFileSync('./src/data/transit.js', 'utf8');

// very basic regex to grab all countries in transit.js
const transitCountries = [...new Set([...fileContent.matchAll(/\"country\":\s*\"([^\"]+)\"/g)].map(m => m[1]))];

const countriesModule = fs.readFileSync('./src/data/countries.js', 'utf8');
const countryIds = [...countriesModule.matchAll(/\"id\":\s*\"([^\"]+)\"/g)].map(m => m[1]);

for (let c of transitCountries) {
  if (!countryIds.includes(c)) {
    console.log('MISSING OR MISMATCHED:', c);
  }
}
