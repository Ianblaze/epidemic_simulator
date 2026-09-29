const fs = require('fs');

function fixFile(file) {
    let code = fs.readFileSync(file, 'utf8');

    // Replace the problematic absolute assignment loop
    const regex = /states\.forEach\(\(state, countryId\) => \{\s*let newState = stepSEIR\(state, currentParams, 1\);\s*let targetState = newStates\.get\(countryId\);\s*targetState\.S = newState\.S;\s*targetState\.E = newState\.E;\s*targetState\.I = newState\.I;\s*targetState\.R = newState\.R;\s*targetState\.D = newState\.D;\s*newState = targetState;/g;

    const replacement = `states.forEach((state, countryId) => {
            let targetState = newStates.get(countryId);
            let newState = stepSEIR(targetState, currentParams, 1);
            targetState.S = newState.S;
            targetState.E = newState.E;
            targetState.I = newState.I;
            targetState.R = newState.R;
            targetState.D = newState.D;
            newState = targetState;`;

    code = code.replace(regex, replacement);
    
    // Also fix statesRef.current.forEach
    const regex2 = /statesRef\.current\.forEach\(\(state, countryId\) => \{\s*let newState = stepSEIR\(state, currentParams, 1\);\s*let targetState = newStates\.get\(countryId\);\s*targetState\.S = newState\.S;\s*targetState\.E = newState\.E;\s*targetState\.I = newState\.I;\s*targetState\.R = newState\.R;\s*targetState\.D = newState\.D;\s*newState = targetState;/g;
    
    const replacement2 = `statesRef.current.forEach((state, countryId) => {
          let targetState = newStates.get(countryId);
          let newState = stepSEIR(targetState, currentParams, 1);
          targetState.S = newState.S;
          targetState.E = newState.E;
          targetState.I = newState.I;
          targetState.R = newState.R;
          targetState.D = newState.D;
          newState = targetState;`;

    code = code.replace(regex2, replacement2);
    fs.writeFileSync(file, code);
}

fixFile('src/simulation/predictor.js');
fixFile('src/hooks/useSimulation.js');
