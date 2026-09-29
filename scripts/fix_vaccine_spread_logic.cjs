const fs = require('fs');

let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// 1. Add refs
const refTarget = "const inboundInfectionsRef = useRef([]);";
const refReplacement = `const inboundInfectionsRef = useRef([]);\n    const inboundVaccinesRef = useRef([]);\n    const vaccineStartedRef = useRef(false);`;
code = code.replace(refTarget, refReplacement);

// 2. Add inboundVaccinesRef to return object
const returnTarget = "inboundInfectionsRef,";
const returnReplacement = `inboundInfectionsRef,\n      inboundVaccinesRef,`;
code = code.replace(returnTarget, returnReplacement);

// 3. Reset logic
const resetTarget = "vaccineProgressRef.current = 0;";
const resetReplacement = `vaccineProgressRef.current = 0;\n      vaccineStartedRef.current = false;\n      inboundVaccinesRef.current = [];`;
code = code.replace(resetTarget, resetReplacement);

// 4. Update the state initializations to include vaccineAvailable
const initTarget = "statesRef.current.set(c.id, { S: c.population, E: 0, I: 0, R: 0, D: 0 });";
const initReplacement = `statesRef.current.set(c.id, { S: c.population, E: 0, I: 0, R: 0, D: 0, vaccineAvailable: false });`;
code = code.replace(initTarget, initReplacement);

// 5. Update tick loop for inbound vaccines and initial rollout
const tickTarget = "let sumS = 0, sumE = 0, sumI = 0, sumD = 0;";
const tickReplacement = `let sumS = 0, sumE = 0, sumI = 0, sumD = 0;
      
      // Process incoming vaccines from flights/ships
      if (inboundVaccinesRef.current.length > 0) {
          inboundVaccinesRef.current.forEach(cid => {
             const s = newStates.get(cid);
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
              if (count < 3 && newStates.has(id)) {
                  newStates.get(id).vaccineAvailable = true;
                  count++;
              }
          });
      }`;
code = code.replace(tickTarget, tickReplacement);

// 6. Update individual country tick (vaccine application + land spread)
const countryTickTarget = /if \(vaccineProgressRef\.current >= 100 && newState\.S > 0\) \{[\s\S]*?newState\.R \+= vacAmount;\s*\}/;
const countryTickReplacement = `
          // Distribute vaccine locally and via land borders
          newState.vaccineAvailable = state.vaccineAvailable; // Keep state
          if (newState.vaccineAvailable && newState.S > 0) {
              const vacAmount = Math.min(newState.S, (newState.S + newState.E + newState.I + newState.R + newState.D) * 0.015);
              newState.S -= vacAmount;
              newState.R += vacAmount;

              // Land border spread
              const c = countries.find(x => x.id === cid);
              if (c && c.neighbors && Math.random() < 0.08) {
                  const nid = c.neighbors[Math.floor(Math.random() * c.neighbors.length)];
                  const ns = newStates.get(nid);
                  if (ns) ns.vaccineAvailable = true;
              }
          }`;
code = code.replace(countryTickTarget, countryTickReplacement);

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Updated useSimulation.js for dynamic vaccine spread');
