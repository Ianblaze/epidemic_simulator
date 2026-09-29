const fs = require('fs');

let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// Replace the static vaccineProgressRef increment
const oldVaccine = /vaccineProgressRef\.current \+= \(paramsRef\.current\.vaccineFunding \|\| 0\) \* 1\.2;/;
const newVaccine = `
      // Dynamic Vaccine Research: Depends on global stability
      let globalAlive = 0;
      let globalHealthy = 0;
      statesRef.current.forEach(s => {
          globalAlive += s.S + s.E + s.I + s.R;
          globalHealthy += s.S + s.R;
      });
      const stabilityMultiplier = globalAlive > 0 ? (globalHealthy / globalAlive) : 0;
      // Boost the base speed to 1.8 so it's fast when stable, but slows down if the world is collapsing
      vaccineProgressRef.current += (paramsRef.current.vaccineFunding || 0) * 1.8 * stabilityMultiplier;
`;

code = code.replace(oldVaccine, newVaccine);

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Added dynamic vaccine research speed');
