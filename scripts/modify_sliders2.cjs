const fs = require('fs');
let code = fs.readFileSync('src/components/ParameterSliders.jsx', 'utf8');

const regex2 = /setParams\(\{ \n\s*\.\.\.params,\n\s*interventionStringency:.*?\n\s*borderStrictness:.*?\n\s*hygieneCompliance:.*?\n\s*quarantineEfficiency:.*?\n\s*vaccineFunding:.*?\n\s*\}\);/;
const replacement2 = `
                     const severity = Math.max(0, Math.min(1, 
                         ((params.r0 - 1) / 12) * 0.55 + 
                         params.caseFatalityRate * 0.20 + 
                         params.airImmunity * 0.125 + 
                         params.waterImmunity * 0.125
                     ));

                     const minIntervention = 0.60 + severity * 0.35;
                     const minBorder = 0.55 + severity * 0.40;
                     const minHygiene = 0.55 + severity * 0.35;
                     const minQuarantine = 0.60 + severity * 0.35;
                     const minVaccine = 0.65 + severity * 0.30;
                     
                     setParams({ 
                         ...params,
                         interventionStringency: parseFloat(Math.max(minIntervention, Math.min(1, res[0])).toFixed(2)),
                         borderStrictness: parseFloat(Math.max(minBorder, Math.min(1, res[1])).toFixed(2)),
                         hygieneCompliance: parseFloat(Math.max(minHygiene, Math.min(1, res[2])).toFixed(2)),
                         quarantineEfficiency: parseFloat(Math.max(minQuarantine, Math.min(1, res[3])).toFixed(2)),
                         vaccineFunding: parseFloat(Math.max(minVaccine, Math.min(1, res[4])).toFixed(2))
                     });
`;
code = code.replace(regex2, replacement2);
fs.writeFileSync('src/components/ParameterSliders.jsx', code);
