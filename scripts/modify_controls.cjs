const fs = require('fs');
let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

// 1. Import predictor and rng
code = code.replace(/import diseaseProfiles from '\.\.\/data\/diseaseProfiles\.js';/, `import diseaseProfiles from '../data/diseaseProfiles.js';\nimport { runPrediction } from '../simulation/predictor.js';\nimport { setGlobalSeed } from '../simulation/rng.js';`);

// 2. Fix Aegis Input & Output & Prediction
const aegisRegex = /const inp = \[params\.r0 \|\| 2\.5, params\.incubationPeriod \|\| 5\.0, params\.caseFatalityRate \|\| 0\.02, 0\.5\];[\s\S]*?setPredictionReport\(\{ type: 'AEGIS', day: pDay \}\);/m;

const aegisReplacement = `const inp = [
    params.r0 || 2.5, 
    params.incubationPeriod || 5.0, 
    params.caseFatalityRate || 0.02, 
    params.airImmunity || 0.5, 
    params.waterImmunity || 0.5
]; 
const scaledInp = inp.map((v, i) => (v - opt.scaler_X_mean[i]) / opt.scaler_X_scale[i]);

let l1 = [];
for(let j=0; j<opt.weights[0][0].length; j++){
    let s = opt.biases[0][j];
    for(let i=0; i<scaledInp.length; i++) s += scaledInp[i] * opt.weights[0][i][j];
    l1.push(Math.max(0, s));
}
let l2 = [];
for(let j=0; j<opt.weights[1][0].length; j++){
    let s = opt.biases[1][j];
    for(let i=0; i<l1.length; i++) s += l1[i] * opt.weights[1][i][j];
    l2.push(Math.max(0, s));
}
let out = [];
for(let j=0; j<opt.weights[2][0].length; j++){
    let s = opt.biases[2][j];
    for(let i=0; i<l2.length; i++) s += l2[i] * opt.weights[2][i][j];
    out.push(s);
}
const res = out.map((v, i) => (v * opt.scaler_y_scale[i]) + opt.scaler_y_mean[i]);

// AEGIS SAFETY POLICY
const severity = Math.max(0, Math.min(1, 
    ((newParams.r0 - 1) / 12) * 0.55 + 
    newParams.caseFatalityRate * 0.20 + 
    newParams.airImmunity * 0.125 + 
    newParams.waterImmunity * 0.125
));

const minIntervention = 0.60 + severity * 0.35;
const minBorder = 0.55 + severity * 0.40;
const minHygiene = 0.55 + severity * 0.35;
const minQuarantine = 0.60 + severity * 0.35;
const minVaccine = 0.65 + severity * 0.30;

newParams = { 
    ...newParams,
    interventionStringency: parseFloat(Math.max(minIntervention, Math.min(1, res[0])).toFixed(2)),
    borderStrictness: parseFloat(Math.max(minBorder, Math.min(1, res[1])).toFixed(2)),
    hygieneCompliance: parseFloat(Math.max(minHygiene, Math.min(1, res[2])).toFixed(2)),
    quarantineEfficiency: parseFloat(Math.max(minQuarantine, Math.min(1, res[3])).toFixed(2)),
    vaccineFunding: parseFloat(Math.max(minVaccine, Math.min(1, res[4])).toFixed(2))
};

// Seed for reproducibility
const seed = Math.floor(Math.random() * 1000000);
newParams.seed = seed;

// Predictor
const pred = runPrediction(newParams, seedCountry, 'AEGIS', seed);
newParams.predictedDay = pred.predictedDay;
setParams(newParams);
setPredictionReport({ type: 'AEGIS', day: pred.predictedDay });`;

code = code.replace(aegisRegex, aegisReplacement);


// 3. Fix Doomsday Selection, Safety Policy & Prediction
const doomsdayRegex = /const randomCountry = countriesData\[Math\.floor\(Math\.random\(\) \* countriesData\.length\)\];[\s\S]*?setPredictionReport\(\{ type: 'DOOMSDAY', day: pDay \}\);/m;

const doomsdayReplacement = `// Calculate connectivity to select top 30%
const sortedCountries = [...countriesData].sort((a, b) => {
    const aAir = airports.filter(ap => ap.country === a.id || ap.country === a.id.replace(/\\s+/g, '')).length;
    const aSea = seaports.filter(sp => sp.country === a.id || sp.country === a.id.replace(/\\s+/g, '')).length;
    const bAir = airports.filter(ap => ap.country === b.id || ap.country === b.id.replace(/\\s+/g, '')).length;
    const bSea = seaports.filter(sp => sp.country === b.id || sp.country === b.id.replace(/\\s+/g, '')).length;
    const aScore = a.population * 0.2 + aAir * 100000 + aSea * 50000;
    const bScore = b.population * 0.2 + bAir * 100000 + bSea * 50000;
    return bScore - aScore;
});
const top30PercentCount = Math.max(1, Math.floor(sortedCountries.length * 0.3));
const randomCountry = sortedCountries[Math.floor(Math.random() * top30PercentCount)];
setSeedCountry(randomCountry.id);

const defs = randomCountry.defenses || {
    interventionStringency: 0.0,
    borderStrictness: 0.05,
    hygieneCompliance: 0.15,
    quarantineEfficiency: 0.1,
    vaccineFunding: 0.05
};

const pop = randomCountry.population / 1000000;
const cId = randomCountry.id;
const myAirports = airports.filter(a => a.country === cId || a.country === cId.replace(/\\s+/g, '')).length;
const mySeaports = seaports.filter(s => s.country === cId || s.country === cId.replace(/\\s+/g, '')).length;

const flights = Math.min(1.0, myAirports / 15.0);
const ships = Math.min(1.0, mySeaports / 5.0);

const inp = [pop, flights, ships];
const scaledInp = inp.map((v, i) => (v - opt.scaler_X_mean[i]) / opt.scaler_X_scale[i]);

let l1 = [];
for(let j=0; j<opt.weights[0][0].length; j++){
    let s = opt.biases[0][j];
    for(let i=0; i<scaledInp.length; i++) s += scaledInp[i] * opt.weights[0][i][j];
    l1.push(Math.max(0, s));
}
let l2 = [];
for(let j=0; j<opt.weights[1][0].length; j++){
    let s = opt.biases[1][j];
    for(let i=0; i<l1.length; i++) s += l1[i] * opt.weights[1][i][j];
    l2.push(Math.max(0, s));
}
let out = [];
for(let j=0; j<opt.weights[2][0].length; j++){
    let s = opt.biases[2][j];
    for(let i=0; i<l2.length; i++) s += l2[i] * opt.weights[2][i][j];
    out.push(s);
}
const res = out.map((v, i) => (v * opt.scaler_y_scale[i]) + opt.scaler_y_mean[i]);

const diseaseName = randomDisease.name;
let vectorReason = '';
if (diseaseName.match(/COVID|SARS|Influenza/i)) {
    vectorReason = \`Respiratory chassis selected to specifically exploit \${randomCountry.name}'s population density and close-contact networks.\`;
} else if (diseaseName.match(/Ebola|Plague|MERS/i)) {
    vectorReason = \`Hemorrhagic/bacterial chassis chosen to maximize localized terror and rapidly overwhelm \${randomCountry.name}'s critical medical infrastructure.\`;
} else {
    vectorReason = \`\${diseaseName} chassis selected as the optimal genetic foundation to bypass \${randomCountry.name}'s specific climatic and biological defenses.\`;
}

// DOOMSDAY SAFETY POLICY CLAMPING
const finalR0 = Math.max(10, Math.min(18, res[0]));
const finalIncubation = Math.max(6, Math.min(12, res[1]));
const finalCFR = Math.max(0.01, Math.min(0.04, res[2]));
const finalAir = Math.max(0.85, Math.min(1.0, res[3]));
const finalWater = Math.max(0.85, Math.min(1.0, res[4]));

setTooltips({
    vector: vectorReason,
    r0: finalR0 > 5 ? \`Extreme infectivity engineered to punch through \${randomCountry.name}'s baseline hygiene and quarantine protocols.\` : \`Lower infectivity chosen because \${randomCountry.name}'s population density allows efficient spread without excessive mutation costs.\`,
    lethality: finalCFR > 0.05 ? \`High lethality (\${(finalCFR * 100).toFixed(1)}%) engineered to overwhelm \${randomCountry.name}'s medical infrastructure.\` : \`Lethality suppressed to keep hosts alive longer, maximizing stealth spread across \${randomCountry.name}'s borders.\`,
    incubation: finalIncubation >= 10 ? \`Extended incubation (\${finalIncubation.toFixed(1)} days) to allow infected hosts to bypass \${randomCountry.name}'s border screenings completely asymptomatically.\` : \`Short incubation designed for rapid localized bursts before \${randomCountry.name} authorities can react.\`,
    air: finalAir > 0.5 ? \`Maximized air transmission to exploit \${randomCountry.name}'s international aviation network (\${myAirports} active airports).\` : \`Air transmission deprioritized due to \${randomCountry.name}'s limited global flight connectivity (\${myAirports} active airports).\`,
    water: finalWater > 0.5 ? \`Maximized water transmission to utilize \${randomCountry.name}'s maritime ports and coastal dependency (\${mySeaports} active seaports).\` : \`Water transmission minimized as \${randomCountry.name} lacks significant maritime export infrastructure or is landlocked (\${mySeaports} active seaports).\`
});

// Seed for reproducibility
const seed = Math.floor(Math.random() * 1000000);

let newParams = { 
    ...params,
    ...defs,
    r0: parseFloat(finalR0.toFixed(1)),
    incubationPeriod: parseFloat(finalIncubation.toFixed(1)),
    caseFatalityRate: parseFloat(finalCFR.toFixed(4)),
    airImmunity: parseFloat(finalAir.toFixed(2)),
    waterImmunity: parseFloat(finalWater.toFixed(2)),
    mutationRate: 0.3, // Give Doomsday a high mutation chance
    seed: seed
};

const pred = runPrediction(newParams, cId, 'DOOMSDAY', seed);
newParams.predictedDay = pred.predictedDay;

setParams(newParams);
setPredictionReport({ type: 'DOOMSDAY', day: pred.predictedDay });`;

code = code.replace(doomsdayRegex, doomsdayReplacement);

fs.writeFileSync('src/components/Controls.jsx', code);
