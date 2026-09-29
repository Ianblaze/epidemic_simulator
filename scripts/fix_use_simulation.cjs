const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// 1. Remove the broken block from useEffect
const useEffectBrokenRegex = /\/\/ Process incoming vaccines from flights\/ships[\s\S]*?prominentCountries\.forEach.*?\}\);.*?\}\n/g;
code = code.replace(useEffectBrokenRegex, '');

// 2. Fix the countryId bug and reduce vaccine speed in the country loop
const oldCountryLoop = /\/\/ Distribute vaccine locally and via land borders[\s\S]*?if \(ns\) ns\.vaccineAvailable = true;\n                \}/g;

const newCountryLoop = `// Distribute vaccine locally and via land borders
          newState.vaccineAvailable = state.vaccineAvailable; // Keep state
          if (newState.vaccineAvailable && newState.S > 0) {
              const vacAmount = Math.min(newState.S, (newState.S + newState.E + newState.I + newState.R + newState.D) * 0.008); // Reduced to 0.8% per day (~120 days)
              newState.S -= vacAmount;
              newState.R += vacAmount;

              // Land border spread
              const c = countriesDataCache ? countriesDataCache.find(x => x.id === countryId) : null;
              if (c && c.neighbors && Math.random() < 0.1) {
                  const nid = c.neighbors[Math.floor(Math.random() * c.neighbors.length)];
                  // We add it to a temporary array or modify statesRef directly so it gets picked up
                  const neighborState = statesRef.current.get(nid);
                  if (neighborState) neighborState.vaccineAvailable = true;
              }
          }`;
code = code.replace(oldCountryLoop, newCountryLoop);

// 3. Add the initial rollout and flight landings BEFORE the loop
const beforeLoopTarget = "const newStates = new Map();";
const beforeLoopReplacement = `
        // Process incoming vaccines from flights/ships
        if (inboundVaccinesRef.current.length > 0) {
            inboundVaccinesRef.current.forEach(id => {
               const s = statesRef.current.get(id);
               if (s) s.vaccineAvailable = true;
            });
            inboundVaccinesRef.current = [];
        }

        // Initial Global Vaccine Deployment (starts in 3 prominent countries)
        if (vaccineProgressRef.current >= 100 && !vaccineStartedRef.current) {
            vaccineStartedRef.current = true;
            const prominentCountries = ['USA', 'CHN', 'GBR', 'FRA', 'DEU', 'JPN'];
            let count = 0;
            prominentCountries.forEach(id => {
                if (count < 3 && statesRef.current.has(id)) {
                    statesRef.current.get(id).vaccineAvailable = true;
                    count++;
                }
            });
        }
        
        const newStates = new Map();`;

code = code.replace(beforeLoopTarget, beforeLoopReplacement);

// 4. Update AEGIS prediction formula to reflect 0.8% vaccine rate instead of 1.5%.
// 100 / 0.8 = 125 days. Let's make it 120 days in Controls.jsx.

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Fixed useSimulation.js crashes and rebalanced vaccine speed');
