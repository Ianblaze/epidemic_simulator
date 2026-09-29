const fs = require('fs');
let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

if (!code.includes("import { airports, seaports }")) {
   code = code.replace(/import diseaseProfiles from '\.\.\/data\/diseaseProfiles\.js';/, "import diseaseProfiles from '../data/diseaseProfiles.js';\nimport { airports, seaports } from '../data/transit.js';");
}

const oldMathRandom = /const flights = Math\.random\(\);[\s\S]*?const ships = Math\.random\(\);/;
const newTransitMath = `
     const cId = randomCountry.id;
     const myAirports = airports.filter(a => a.country === cId || a.country === cId.replace(/\\s+/g, '')).length;
     const mySeaports = seaports.filter(s => s.country === cId || s.country === cId.replace(/\\s+/g, '')).length;
     
     // Normalize to 0.0 - 1.0 based on typical maximums in the dataset
     const flights = Math.min(1.0, myAirports / 15.0);
     const ships = Math.min(1.0, mySeaports / 5.0);
`;
code = code.replace(oldMathRandom, newTransitMath);

if (!code.includes("const [tooltips, setTooltips] = useState")) {
    code = code.replace(/const \[baseDisease, setBaseDisease\] = useState\(''\);/, "const [baseDisease, setBaseDisease] = useState('');\n  const [tooltips, setTooltips] = useState({});");
}

// Wait, the setTooltips needs to use the generated values which are in `res` array.
// But we calculate tooltips after `setParams`. 
// Let's find the `setParams({ ... })` block and put the tooltip logic right after it.

const tooltipLogic = `
     setTooltips({
         r0: Math.max(0.1, res[0]) > 5 ? \`Extreme infectivity engineered to punch through \${randomCountry.name}'s baseline hygiene and quarantine protocols.\` : \`Lower infectivity chosen because \${randomCountry.name}'s population density allows efficient spread without excessive mutation costs.\`,
         lethality: Math.max(0, Math.min(1, res[2])) > 0.05 ? \`High lethality (\${(Math.max(0, Math.min(1, res[2])) * 100).toFixed(1)}%) engineered to overwhelm \${randomCountry.name}'s medical infrastructure.\` : \`Lethality suppressed to keep hosts alive longer, maximizing stealth spread across \${randomCountry.name}'s borders.\`,
         incubation: Math.max(1, res[1]) >= 10 ? \`Extended incubation (\${Math.max(1, res[1]).toFixed(1)} days) to allow infected hosts to bypass \${randomCountry.name}'s border screenings completely asymptomatically.\` : \`Short incubation designed for rapid localized bursts before \${randomCountry.name} authorities can react.\`,
         air: flights > 0.1 ? \`Maximized air transmission to exploit \${randomCountry.name}'s international aviation network (\${myAirports} active airports).\` : \`Air transmission deprioritized due to \${randomCountry.name}'s limited global flight connectivity (\${myAirports} active airports).\`,
         water: ships > 0.1 ? \`Maximized water transmission to utilize \${randomCountry.name}'s maritime ports and coastal dependency (\${mySeaports} active seaports).\` : \`Water transmission minimized as \${randomCountry.name} lacks significant maritime export infrastructure or is landlocked (\${mySeaports} active seaports).\`
     });
`;

code = code.replace(/setDoomsdayGenerated\(true\);/, tooltipLogic + '\n     setDoomsdayGenerated(true);');


const oldJSX = /<div style=\{\{ cursor: 'help'[\s\S]*?Water Transmission: \{params\?\.waterImmunity\}<\/div>/;
const newJSX = `<div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title="The baseline biological chassis selected by the AI to mutate.">Vector Signature: {baseDisease}</div><br/>
                      <div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title={tooltips.r0 || "R0 optimized for target."}>R0: {params?.r0}</div><br/>
                      <div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title={tooltips.lethality || "Lethality optimized for target."}>Lethality: {(params?.caseFatalityRate * 100).toFixed(2)}%</div><br/>
                      <div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title={tooltips.incubation || "Incubation optimized for target."}>Incubation: {params?.incubationPeriod} days</div><br/>
                      <div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title={tooltips.air || "Air transmission optimized for target."}>Air Transmission: {params?.airImmunity}</div><br/>
                      <div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title={tooltips.water || "Water transmission optimized for target."}>Water Transmission: {params?.waterImmunity}</div>`;

code = code.replace(oldJSX, newJSX);

fs.writeFileSync('src/components/Controls.jsx', code);
console.log('Updated tooltips in Controls.jsx');
