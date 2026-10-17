const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// Add gameMode and vaccineProgress to returned object
code = code.replace(/setSimSpeed,/g, "setSimSpeed,\n    gameMode,\n    setGameMode,\n    vaccineProgress,");

// Add vaccineProgressRef
code = code.replace(/const lastNewsRef = useRef\(0\);/, "const lastNewsRef = useRef(0);\n  const vaccineProgressRef = useRef(0);");

// Reset vaccineProgressRef on reset/start
code = code.replace(/setDay\(0\);/, "setDay(0);\n    setVaccineProgress(0);\n    vaccineProgressRef.current = 0;");

// Update tick logic
const tickLogic = \  const tick = () => {
    vaccineProgressRef.current += (paramsRef.current.vaccineFunding || 0) * 0.3; // 0.3% per day at max funding
    if (vaccineProgressRef.current > 100) vaccineProgressRef.current = 100;
    setVaccineProgress(vaccineProgressRef.current);

    setDay(prev => {
      const nextDay = prev + 1;
      const currentParams = paramsRef.current;
      
      // Process airborne and waterborne inbound infections from FlatWorldMap
      while (inboundInfectionsRef.current.length > 0) {
         const inbound = inboundInfectionsRef.current.pop();
         
         // BORDER STRICTNESS LOGIC
         if (Math.random() < (currentParams.borderStrictness || 0)) continue; // Infection blocked at border!

         const targetState = statesRef.current.get(inbound.country);
         if (targetState && targetState.S > 10) {
            const amount = inbound.type === 'ship' ? 3 : 2;
            targetState.S -= amount;
            targetState.E += amount;
         }
      }
      
      const newStates = new Map();
      
      statesRef.current.forEach((state, countryId) => {
        let newState = stepSEIR(state, currentParams, 1);
        
        // VACCINE LOGIC
        if (vaccineProgressRef.current >= 100 && newState.S > 0) {
           // Vaccinate 1% of the remaining susceptible population per day
           const vacAmount = newState.S * 0.01;
           newState.S -= vacAmount;
           newState.R += vacAmount;
        }
        
        newStates.set(countryId, newState);
      });\;

code = code.replace(/const tick = \(\) => \{\s*setDay\(prev => \{\s*const nextDay = prev \+ 1;\s*const currentParams = paramsRef\.current;\s*\/\/ Process airborne and waterborne inbound infections from FlatWorldMap\s*while \(inboundInfectionsRef\.current\.length > 0\) \{\s*const inbound = inboundInfectionsRef\.current\.pop\(\);\s*const targetState = statesRef\.current\.get\(inbound\.country\);\s*if \(targetState && targetState\.S > 10\) \{\s*\/\/ Small seed \?\" disease should grow organically, not instantly\s*const amount = inbound\.type === 'ship' \? 3 : 2;\s*targetState\.S -= amount;\s*targetState\.E \+= amount;\s*\}\s*\}\s*const newStates = new Map\(\);\s*statesRef\.current\.forEach\(\(state, countryId\) => \{\s*newStates\.set\(countryId, stepSEIR\(state, currentParams, 1\)\);\s*\}\);/, tickLogic);

fs.writeFileSync('src/hooks/useSimulation.js', code);
