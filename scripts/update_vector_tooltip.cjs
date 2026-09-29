const fs = require('fs');
let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

// I previously put setTooltips inside generateDoomsday logic, right after setParams.
// Let's find the tooltipLogic replacement and update it.
const tooltipRegex = /setTooltips\(\{([\s\S]*?)r0: Math\.max/m;
const vectorLogic = `
     const diseaseName = randomDisease.name;
     let vectorReason = '';
     if (diseaseName.match(/COVID|SARS|Influenza/i)) {
         vectorReason = \`Respiratory chassis selected to specifically exploit \${randomCountry.name}'s population density and close-contact networks.\`;
     } else if (diseaseName.match(/Ebola|Plague|MERS/i)) {
         vectorReason = \`Hemorrhagic/bacterial chassis chosen to maximize localized terror and rapidly overwhelm \${randomCountry.name}'s critical medical infrastructure.\`;
     } else {
         vectorReason = \`\${diseaseName} chassis selected as the optimal genetic foundation to bypass \${randomCountry.name}'s specific climatic and biological defenses.\`;
     }

     setTooltips({
         vector: vectorReason,
         r0: Math.max`;

code = code.replace(tooltipRegex, vectorLogic);

const oldJSX = /<div style=\{\{ cursor: 'help'[^>]*title="The baseline biological chassis selected by the AI to mutate."[^>]*>Vector Signature: \{baseDisease\}<\/div>/;
const newJSX = `<div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title={tooltips.vector || "Base pathogen chassis."}>Vector Signature: {baseDisease}</div>`;

code = code.replace(oldJSX, newJSX);

fs.writeFileSync('src/components/Controls.jsx', code);
console.log('Updated Controls.jsx for vector tooltip');
