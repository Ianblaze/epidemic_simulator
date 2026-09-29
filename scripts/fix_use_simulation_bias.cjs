const fs = require('fs');

let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// We will inject the bias right inside the tick loop before stepSEIR is called.
const tickLoopStart = /statesRef\.current\.forEach\(\(state, countryId\) => \{/g;
const tickLoopReplacement = `statesRef.current.forEach((state, countryId) => {
          let biasedParams = { ...currentParams };
          if (gameModeRef.current === 'DOOMSDAY') {
              biasedParams.r0 = biasedParams.r0 * 1.6;
              biasedParams.caseFatalityRate = Math.min(1.0, biasedParams.caseFatalityRate * 1.5);
              biasedParams.interventionStringency = Math.max(0, biasedParams.interventionStringency - 0.2);
          } else if (gameModeRef.current === 'AEGIS') {
              biasedParams.r0 = biasedParams.r0 * 0.4;
              biasedParams.vaccineFunding = Math.min(1.0, biasedParams.vaccineFunding + 0.3);
              biasedParams.interventionStringency = Math.min(1.0, biasedParams.interventionStringency + 0.3);
          }
          currentParams = biasedParams;`;

// But wait, `currentParams` shouldn't be overridden globally in the loop, we should pass `biasedParams` to `stepSEIR`.
code = code.replace(/statesRef\.current\.forEach\(\(state, countryId\) => \{\s*let newState = stepSEIR\(state, currentParams, 1\);/, `statesRef.current.forEach((state, countryId) => {
          let biasedParams = { ...currentParams };
          if (gameModeRef.current === 'DOOMSDAY') {
              biasedParams.r0 = biasedParams.r0 * 1.6;
              biasedParams.caseFatalityRate = Math.min(1.0, biasedParams.caseFatalityRate * 1.5);
              biasedParams.interventionStringency = Math.max(0, biasedParams.interventionStringency - 0.2);
          } else if (gameModeRef.current === 'AEGIS') {
              biasedParams.r0 = biasedParams.r0 * 0.4;
              biasedParams.vaccineFunding = Math.min(1.0, biasedParams.vaccineFunding + 0.3);
              biasedParams.interventionStringency = Math.min(1.0, biasedParams.interventionStringency + 0.3);
          }
          let newState = stepSEIR(state, biasedParams, 1);`);

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Injected backend bias into useSimulation');
