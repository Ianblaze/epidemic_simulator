const fs = require('fs');

function fixFile(file) {
    let code = fs.readFileSync(file, 'utf8');

    // Instead of letting newStates build up, we will just clone the Map first.
    code = code.replace(/let newStates = new Map\(\);\s+let totalGlobalI = 0;\s+states\.forEach\(\(state, countryId\) => \{/, 
`let newStates = new Map();
        let totalGlobalI = 0;
        // Pre-populate
        states.forEach((state, countryId) => {
            newStates.set(countryId, { ...state });
        });

        states.forEach((state, countryId) => {
            let newState = stepSEIR(state, currentParams, 1);
            // manually merge SEIR results back into the pre-populated newState
            let targetState = newStates.get(countryId);
            targetState.S = newState.S;
            targetState.E = newState.E;
            targetState.I = newState.I;
            targetState.R = newState.R;
            targetState.D = newState.D;
            newState = targetState;
`);

    // In useSimulation, it uses statesRef.current.forEach
    code = code.replace(/const newStates = new Map\(\);\s+statesRef\.current\.forEach\(\(state, countryId\) => \{/, 
`const newStates = new Map();
      statesRef.current.forEach((state, countryId) => {
          newStates.set(countryId, { ...state });
      });

      statesRef.current.forEach((state, countryId) => {
          let newState = stepSEIR(state, currentParams, 1);
          let targetState = newStates.get(countryId);
          targetState.S = newState.S;
          targetState.E = newState.E;
          targetState.I = newState.I;
          targetState.R = newState.R;
          targetState.D = newState.D;
          newState = targetState;
`);

    // Remove the trailing `newStates.set(countryId, newState);` from the loop because we already modified the reference
    code = code.replace(/newStates\.set\(countryId, newState\);\s+totalGlobalI \+= newState\.I;/g, `totalGlobalI += newState.I;`);
    
    // Also remove in useSimulation
    code = code.replace(/newStates\.set\(countryId, newState\);/g, ``);

    fs.writeFileSync(file, code);
}

fixFile('src/simulation/predictor.js');
fixFile('src/hooks/useSimulation.js');
