const fs = require('fs');

const raw = fs.readFileSync('src/data/countries.js', 'utf8');
const match = raw.match(/export default (\[.*\]);/s);
if (!match) throw new Error("Could not parse countries.js");

const countries = eval(match[1]);

// High defense regions
const highDefense = ['USA', 'CAN', 'GBR', 'DEU', 'FRA', 'ITA', 'ESP', 'JPN', 'KOR', 'AUS', 'NZL', 'CHE', 'SWE', 'NOR', 'FIN', 'DNK', 'NLD', 'BEL', 'AUT', 'SGP', 'ISR', 'ARE'];
const mediumDefense = ['CHN', 'IND', 'BRA', 'MEX', 'ZAF', 'ARG', 'CHL', 'TUR', 'SAU', 'MYS', 'THA', 'IDN', 'VNM', 'PHL', 'EGY', 'MAR', 'COL', 'PER', 'POL', 'CZE', 'HUN', 'GRC', 'PRT', 'ROU', 'BGR', 'HRV', 'SRB'];

countries.forEach(c => {
    let tier = 1; // Low (Third world / Developing)
    if (highDefense.includes(c.id)) tier = 3;
    else if (mediumDefense.includes(c.id)) tier = 2;

    if (tier === 3) {
        c.defenses = {
            interventionStringency: 0.1,
            borderStrictness: 0.2,
            hygieneCompliance: 0.6,
            quarantineEfficiency: 0.7,
            vaccineFunding: 0.8
        };
    } else if (tier === 2) {
        c.defenses = {
            interventionStringency: 0.05,
            borderStrictness: 0.1,
            hygieneCompliance: 0.4,
            quarantineEfficiency: 0.4,
            vaccineFunding: 0.3
        };
    } else {
        c.defenses = {
            interventionStringency: 0.0,
            borderStrictness: 0.05,
            hygieneCompliance: 0.15,
            quarantineEfficiency: 0.1,
            vaccineFunding: 0.05
        };
    }
});

const newContent = \const countriesData = \;\n\nexport default countriesData;\;
fs.writeFileSync('src/data/countries.js', newContent);
console.log('Added defense stats to countries.');
