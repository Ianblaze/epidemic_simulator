const fs = require('fs');
let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

// 1. Fix Baseline Defense Tier
code = code.replace(/Baseline Defense Tier: \{params\?\.vaccineFunding > 0\.5 \? 'High' : params\?\.vaccineFunding > 0\.1 \? 'Medium' : 'Low'\}/g, "Baseline Defense Tier: {selectedCountryData?.defenses?.tier || 'Medium'}");

// 2. Add Disease dropdown to AEGIS mode
const aegisLogicOld = /<div className="section-title">Origin country<\/div>\s*<select[\s\S]*?<\/select>\s*<div className="control-actions"/;
const aegisLogicNew = `<div className="section-title">Target Country (Outbreak Origin)</div>
               <select 
                  value={seedCountry || ''} 
                  onChange={(e) => setSeedCountry(e.target.value)}
                  disabled={isRunning || isStaging}
                  className="hud-select"
               >
                  <option value="" disabled>-- Select a target --</option>
                  {countriesData.map(c => (
                     <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
               </select>

               <div className="section-title" style={{ marginTop: '1rem' }}>Select Biological Weapon</div>
               <select
                  value={baseDisease || ''}
                  onChange={(e) => {
                     setBaseDisease(e.target.value);
                     const d = diseaseProfiles.find(dp => dp.name === e.target.value);
                     if (d && setParams) {
                        setParams(prev => ({
                           ...prev,
                           r0: d.r0,
                           caseFatalityRate: d.caseFatalityRate,
                           incubationPeriod: d.incubationPeriod,
                           infectiousPeriod: d.infectiousPeriod,
                           airImmunity: d.airImmunity,
                           waterImmunity: d.waterImmunity
                        }));
                     }
                  }}
                  disabled={isRunning || isStaging}
                  className="hud-select"
               >
                  <option value="" disabled>-- Choose a base pathogen --</option>
                  {diseaseProfiles.map(d => (
                     <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
               </select>
               <div style={{ fontSize: '0.7rem', color: '#ccc', marginTop: '0.5rem' }}>Select the virus. The AEGIS AI will analyze its traits and deploy global countermeasures to stop you.</div>

               <div className="control-actions"`;
code = code.replace(aegisLogicOld, aegisLogicNew);

// Add diseaseProfiles import if not present
if (!code.includes('import diseaseProfiles from')) {
    code = `import diseaseProfiles from '../data/diseaseProfiles.js';\n` + code;
}

fs.writeFileSync('src/components/Controls.jsx', code);
console.log('Updated Controls.jsx');
