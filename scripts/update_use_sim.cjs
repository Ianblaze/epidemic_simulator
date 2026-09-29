const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

const regex = /statesRef\.current\.forEach\(\(state, countryId\) => \{\s*let targetState = newStates\.get\(countryId\);[\s\S]*?newState = targetState;/;
const replacement = `statesRef.current.forEach((state, countryId) => {
          let targetState = newStates.get(countryId);
          let newState = stepSEIR(targetState, currentParams, 1);
          
          targetState.S = newState.S;
          targetState.E = newState.E;
          targetState.I = newState.I;
          targetState.R = newState.R;
          targetState.D = newState.D;`;

code = code.replace(regex, replacement);

const regex2 = /if \(newState\.vaccineAvailable/g;
code = code.replace(regex2, 'if (targetState.vaccineAvailable');

const regex3 = /newState\.S/g;
code = code.replace(regex3, 'targetState.S');
const regex4 = /newState\.E/g;
code = code.replace(regex4, 'targetState.E');
const regex5 = /newState\.I/g;
code = code.replace(regex5, 'targetState.I');
const regex6 = /newState\.R/g;
code = code.replace(regex6, 'targetState.R');
const regex7 = /newState\.D/g;
code = code.replace(regex7, 'targetState.D');

fs.writeFileSync('src/hooks/useSimulation.js', code);
