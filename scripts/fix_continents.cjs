const fs = require('fs');
const file = fs.readFileSync('src/data/countries.js', 'utf8');
const countriesStart = file.indexOf('[');
const countriesEnd = file.lastIndexOf(']') + 1;
const jsonStr = file.substring(countriesStart, countriesEnd);
const countries = JSON.parse(jsonStr);

const eurasia = ['RUSSIA', 'CHINA', 'INDIA', 'KAZAKHSTAN', 'MONGOLIA', 'UKRAINE', 'FRANCE', 'GERMANY', 'SPAIN', 'POLAND', 'ITALY', 'SWEDEN'];
const americas = ['UNITEDSTATES', 'CANADA', 'MEXICO', 'BRAZIL', 'ARGENTINA', 'CHILE', 'PERU', 'COLOMBIA'];
const africa = ['SOUTHAFRICA', 'NIGERIA', 'EGYPT', 'KENYA', 'ETHIOPIA', 'ZAIRE', 'ANGOLA'];
// For simplicity, we just hash the first letter to roughly group them 
// if they aren't in a specific list, but a quick hardcode is better.

countries.forEach(c => {
    let n = c.name.toUpperCase().replace(/\s+/g, '');
    if (eurasia.includes(n)) c.continent = 'Eurasia';
    else if (americas.includes(n)) c.continent = 'Americas';
    else if (africa.includes(n)) c.continent = 'Africa';
    else {
        // Fallback: group by first letter (A-E = G1, F-L = G2, M-R = G3, S-Z = G4)
        const first = n.charCodeAt(0);
        if (first < 70) c.continent = 'Region1';
        else if (first < 77) c.continent = 'Region2';
        else if (first < 83) c.continent = 'Region3';
        else c.continent = 'Region4';
    }
});

fs.writeFileSync('src/data/countries.js', 'const countries = ' + JSON.stringify(countries, null, 2) + ';\nexport default countries;\n');
