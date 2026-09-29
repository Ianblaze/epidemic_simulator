const fs = require('fs');
let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

const oldHtml = \Vector Signature: {baseDisease}<br/>
                      R0: {params?.r0}<br/>
                      Lethality: {(params?.caseFatalityRate * 100).toFixed(2)}%<br/>
                      Incubation: {params?.incubationPeriod} days<br/>
                      Air Transmission: {params?.airImmunity}<br/>
                      Water Transmission: {params?.waterImmunity}\;

const newHtml = \<div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title="The baseline biological chassis selected by the AI to mutate.">Vector Signature: {baseDisease}</div><br/>
                      <div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title="High R0 overcomes local masks and hygiene mandates. Selected based on the target's intervention tier.">R0: {params?.r0}</div><br/>
                      <div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title="Optimized to maximize casualties without killing hosts faster than they can spread the disease.">Lethality: {(params?.caseFatalityRate * 100).toFixed(2)}%</div><br/>
                      <div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title="Carefully calibrated to allow infected travelers to slip past border checkpoints completely asymptomatic.">Incubation: {params?.incubationPeriod} days</div><br/>
                      <div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title="Exploits the target country's specific international flight density and aviation network.">Air Transmission: {params?.airImmunity}</div><br/>
                      <div style={{ cursor: 'help', borderBottom: '1px dotted #ccc', display: 'inline-block' }} title="Exploits the target country's coastal seaports and maritime cargo network.">Water Transmission: {params?.waterImmunity}</div>\;

code = code.replace(oldHtml, newHtml);
fs.writeFileSync('src/components/Controls.jsx', code);
