const fs = require('fs');

let content = fs.readFileSync('src/components/Controls.jsx', 'utf8');

if (!content.includes('generateDoomsdayDisease')) {
    content = content.replace(
        "import { setGlobalSeed } from '../simulation/rng.js';",
        "import { setGlobalSeed } from '../simulation/rng.js';\nimport { generateDoomsdayDisease } from '../simulation/diseaseGenerator.js';\nimport { initAegisDefenses } from '../simulation/aegisController.js';"
    );
}

const doomsdayStart = content.indexOf('  const generateDoomsday = async () => {');
const doomsdayEnd = content.indexOf('    setDoomsdayGenerated(true);\n  };') + '    setDoomsdayGenerated(true);\n  };\n'.length;

const doomsdayCode = `  const generateDoomsday = async () => {
    const sortedCountries = [...countriesData].sort((a, b) => {
        const aAir = airports.filter(ap => ap.country === a.id || ap.country === a.id.replace(/\\s+/g, '')).length;
        const aSea = seaports.filter(sp => sp.country === a.id || sp.country === a.id.replace(/\\s+/g, '')).length;
        const bAir = airports.filter(ap => ap.country === b.id || ap.country === b.id.replace(/\\s+/g, '')).length;
        const bSea = seaports.filter(sp => sp.country === b.id || sp.country === b.id.replace(/\\s+/g, '')).length;
        return (b.population * 0.2 + bAir * 100000 + bSea * 50000) - (a.population * 0.2 + aAir * 100000 + aSea * 50000);
    });
    const top30 = Math.max(1, Math.floor(sortedCountries.length * 0.3));
    const randomCountry = sortedCountries[Math.floor(Math.random() * top30)];
    setSeedCountry(randomCountry.id);
    
    const defs = randomCountry.defenses || { interventionStringency: 0.0, borderStrictness: 0.05, hygieneCompliance: 0.15, quarantineEfficiency: 0.1, vaccineFunding: 0.05 };
    const cId = randomCountry.id;
    const myAirports = airports.filter(a => a.country === cId || a.country === cId.replace(/\\s+/g, '')).length;
    const mySeaports = seaports.filter(s => s.country === cId || s.country === cId.replace(/\\s+/g, '')).length;

    const profile = generateDoomsdayDisease(randomCountry);
    setBaseDisease(profile.diseaseName);

    setTooltips({
        vector: \`Fictional pathogen (\${profile.climateAffinity} affinity) engineered to exploit \${randomCountry.name}'s specific environment.\`,
        r0: \`Infectivity \${profile.r0.toFixed(1)} calculated to establish stable origin.\`,
        lethality: \`Lethality \${(profile.caseFatalityRate * 100).toFixed(1)}% to maintain transmission duration.\`,
        incubation: \`Incubation \${profile.incubationPeriod.toFixed(1)} days.\`,
        air: \`Air transmission \${(profile.airTransmission * 100).toFixed(0)}% tuned for \${myAirports} active airports.\`,
        water: \`Water transmission \${(profile.waterTransmission * 100).toFixed(0)}% tuned for \${mySeaports} active seaports.\`
    });

    const seed = Math.floor(Math.random() * 1000000);
    
    let newParams = { 
        ...params, ...defs,
        r0: profile.r0, incubationPeriod: profile.incubationPeriod, infectiousPeriod: profile.infectiousPeriod,
        caseFatalityRate: profile.caseFatalityRate, airImmunity: profile.airTransmission, waterImmunity: profile.waterTransmission,
        mutationRate: profile.mutationRate, seed: seed
    };

    const pred = runPrediction(newParams, cId, 'DOOMSDAY', seed);
    newParams.predictedDay = pred.predictedDay;
    setParams(newParams);
    setPredictionReport({ type: 'DOOMSDAY', day: pred.predictedDay });
    setDoomsdayGenerated(true);
  };
`;
content = content.substring(0, doomsdayStart) + doomsdayCode + content.substring(doomsdayEnd);

const aegisStart = content.indexOf('                             onClick={async () => {');
const aegisEnd = content.indexOf('                                 }\n                              }}}') + '                                 }\n                              }}}\n'.length;

const aegisCode = `                             onClick={async () => {
                                if (setParams) {
                                   let newParams = { ...params };
                                   const aegisDefs = initAegisDefenses(newParams);
                                   newParams = { ...newParams, ...aegisDefs };
                                   const seed = Math.floor(Math.random() * 1000000);
                                   newParams.seed = seed;
                                   const pred = runPrediction(newParams, seedCountry, 'AEGIS', seed);
                                   newParams.predictedDay = pred.predictedDay;
                                   setParams(newParams);
                                   setPredictionReport({ type: 'AEGIS', day: pred.predictedDay });
                                }
                             }}
`;
content = content.substring(0, aegisStart) + aegisCode + content.substring(aegisEnd);

fs.writeFileSync('src/components/Controls.jsx', content);
console.log("Updated Controls.jsx for deterministic generators");
