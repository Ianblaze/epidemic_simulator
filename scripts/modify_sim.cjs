const fs = require('fs');

let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// 1. Add imports
code = code.replace(/import \{ checkMutation, applyVariantEffects \} from '\.\.\/simulation\/mutations\.js';/, `import { checkMutation, applyVariantEffects } from '../simulation/mutations.js';\nimport { setGlobalSeed, random } from '../simulation/rng.js';`);

// 2. Vaccine multiplier
code = code.replace(/vaccineProgressRef\.current \+= \(currentParams\.vaccineFunding \|\| 0\) \* 0\.33 \* stabilityMultiplier;/, `vaccineProgressRef.current += (currentParams.vaccineFunding || 0) * 0.50 * stabilityMultiplier;`);

// 3. Math.random() replacements
code = code.replace(/Math\.random\(\)/g, 'random()');

// 4. Land Border Logic
code = code.replace(/if \(newState\.I > 500 && countriesDataCache\)/, 'if (newState.I > 100 && countriesDataCache)');
code = code.replace(/const amount = Math\.floor\(random\(\) \* 20\) \+ 5;/, 'const amount = Math.floor(10 + random() * 40 + (currentParams.r0 * 3));');

// 5. Rogue Migration logic replacement (Lines with globalI > 1000000)
// The original uses if (globalI > 1000000 && random() < 0.1) {
code = code.replace(/if \(globalI > 1000000 && random\(\) < 0\.1\) \{[\s\S]*?\}([\s\S]*?\/\/ Generate dynamic news)/, 
`// DOOMSDAY Rogue Seeding
if (gameModeRef.current === 'DOOMSDAY' && globalI > 100000 && random() < 0.2) {
    const keys = Array.from(newStates.keys());
    const randomId = keys[Math.floor(random() * keys.length)];
    const target = newStates.get(randomId);
    if (target && target.I === 0 && target.S > 10000) {
        target.S -= 100;
        target.E += 100;
    }
}
$1`);

// 6. Fix AEGIS Nuclear Option
code = code.replace(/if \(gameModeRef\.current === 'AEGIS' && globalPop > 0 && !nukeFiredRef\.current\) \{[\s\S]*?sumE = 0;\n\s*\}/, 
`if (gameModeRef.current === 'AEGIS' && globalPop > 0 && !nukeFiredRef.current) {
    const infectedRatio = (sumE + globalI) / globalPop;
    if (infectedRatio >= 0.25 && vaccineProgressRef.current < 100) { // Safety fail-safe
        setNukeFired(true);
        addNews(nextDay, "🚨 AEGIS AI EXECUTED NUCLEAR SANITIZATION PROTOCOL. ALL INFECTED ZONES NEUTRALIZED.", 'warning');
        newStates.forEach(c => {
            c.D += (c.E + c.I);
            c.E = 0;
            c.I = 0;
        });
        globalI = 0;
        sumE = 0;
    }
}`);

// 7. Add Aegis Dynamic Adaptation right before mutation checking
code = code.replace(/const mutation = checkMutation/, 
`// AEGIS DYNAMIC ADAPTATION
if (gameModeRef.current === 'AEGIS') {
    const infectedRatio = (sumE + globalI) / (globalPop + 1);
    // Simple growth check
    if (infectedRatio > 0.01 && globalI > (logRef.current.length > 0 ? logRef.current[logRef.current.length-1]?.globalI || 0 : 0)) {
        setParamsState(prev => ({
            ...prev,
            interventionStringency: Math.min(1.0, prev.interventionStringency + 0.02),
            borderStrictness: Math.min(1.0, prev.borderStrictness + 0.02),
            hygieneCompliance: Math.min(1.0, prev.hygieneCompliance + 0.02),
            quarantineEfficiency: Math.min(1.0, prev.quarantineEfficiency + 0.02)
        }));
    }
}
      const mutation = checkMutation`);

// 8. Vaccine Distribution Logic updates (inside useEffect for distributions)
code = code.replace(/if \(vaccineProgressRef\.current >= 100 && !vaccineStartedRef\.current\)/, `
      if (vaccineProgressRef.current >= 50 && !vaccineStartedRef.current) {
          vaccineStartedRef.current = true;
          const prominentCountries = ['USA', 'CHN', 'GBR', 'FRA', 'DEU', 'JPN'];
          let count = 0;
          prominentCountries.forEach(id => {
              if (count < 3 && newStates.has(id)) {
                  newStates.get(id).vaccineAvailable = true;
                  count++;
              }
          });
      }
      if (vaccineProgressRef.current >= 75) {
          let limit = 10;
          Array.from(newStates.values()).forEach(s => {
              if (limit > 0 && !s.vaccineAvailable) {
                  s.vaccineAvailable = true;
                  limit--;
              }
          });
      }
      if (vaccineProgressRef.current >= 100`);

// 9. Win/Loss Logic
// We need to change Math.abs(day - paramsRef.current.predictedDay) <= 100 to day <= paramsRef.current.predictedDay
code = code.replace(/Math\.abs\(day - paramsRef\.current\.predictedDay\) <= 100/g, 'day <= paramsRef.current.predictedDay');

// Pass gameMode to checkMutation
code = code.replace(/checkMutation\(nextDay, globalI, currentParams, variantsRef\.current\)/, `checkMutation(nextDay, globalI, currentParams, variantsRef.current, gameModeRef.current)`);

// 10. Start simulation should seed RNG
code = code.replace(/const start = \(\) => \{/, `const start = () => {\n    if (params.seed) setGlobalSeed(params.seed);`);


fs.writeFileSync('src/hooks/useSimulation.js', code);
