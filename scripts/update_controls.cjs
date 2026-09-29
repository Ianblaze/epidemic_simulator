const fs = require('fs');
let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

const importReplacement = `import React, { useState } from 'react';
import countriesData from '../data/countries.js';
import diseaseProfiles from '../data/diseaseProfiles.js';`;
code = code.replace(/import React, \{ useState \} from 'react';\r?\nimport countriesData from '\.\.\/data\/countries\.js';/, importReplacement);

// Add baseDisease state
code = code.replace(/const \[doomsdayGenerated, setDoomsdayGenerated\] = useState\(false\);/, "const [doomsdayGenerated, setDoomsdayGenerated] = useState(false);\n  const [baseDisease, setBaseDisease] = useState('');");

// In generateDoomsday, set random base disease
const diseaseLogic = `
     // Pick base disease
     const randomDisease = diseaseProfiles[Math.floor(Math.random() * diseaseProfiles.length)];
     setBaseDisease(randomDisease.name);
`;
code = code.replace(/\/\/ 1\. Pick random country/, diseaseLogic + '\n     // 1. Pick random country');

// Update UI to show all params and base disease
const uiLogic = `<div style={{ fontSize: '0.75rem', color: '#ccc', marginBottom: '1rem', lineHeight: '1.4' }}>
                      Population: {(selectedCountryData?.population / 1000000).toFixed(1)}M<br/>
                      Baseline Defense Tier: {params?.vaccineFunding > 0.5 ? 'High' : params?.vaccineFunding > 0.1 ? 'Medium' : 'Low'}<br/>
                      <br/>
                      <div style={{ color: 'var(--red)', fontWeight: 'bold' }}>Pathogen Engineered:</div>
                      Vector Signature: {baseDisease}<br/>
                      R0: {params?.r0}<br/>
                      Lethality: {(params?.caseFatalityRate * 100).toFixed(2)}%<br/>
                      Incubation: {params?.incubationPeriod} days<br/>
                      Air Transmission: {params?.airImmunity}<br/>
                      Water Transmission: {params?.waterImmunity}
                    </div>`;
code = code.replace(/<div style=\{\{ fontSize: '0\.75rem', color: '#ccc', marginBottom: '1rem' \}\}>[\s\S]*?<\/div>/, uiLogic);

fs.writeFileSync('src/components/Controls.jsx', code);
console.log("Updated Controls.jsx");
