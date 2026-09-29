const fs = require('fs');
let code = fs.readFileSync('src/simulation/seir.js', 'utf8');

const regex = /const N = state\.S[\s\S]*return \{[\s\S]*?\};/;
const replacement = `  const steps = 10;
  const adt = (dt * 1.0) / steps;
  let curS = state.S, curE = state.E, curI = state.I, curR = state.R, curD = state.D;
  
  for(let step = 0; step < steps; step++) {
      const N = curS + curE + curI + curR;
      if (N <= 0) break;
      
      let newExposed = beta * curS * curI / N * adt;
      if (curS < 500000 && curI > curS) newExposed += Math.min(curS, 200 * adt); // cleanup
      
      let newInfectious = sigma * curE * adt;
      let newRecovered = gamma * curI * adt;
      let newDeaths = mu * curI * adt;
      
      newExposed = Math.min(newExposed, curS);
      newInfectious = Math.min(newInfectious, curE);
      
      const leavingI = newRecovered + newDeaths;
      if (leavingI > curI) {
          const ratio = curI / leavingI;
          newRecovered *= ratio;
          newDeaths *= ratio;
      }
      
      curS = Math.max(0, curS - newExposed);
      curE = Math.max(0, curE + newExposed - newInfectious);
      curI = Math.max(0, curI + newInfectious - newRecovered - newDeaths);
      curR = Math.max(0, curR + newRecovered);
      curD = Math.max(0, curD + newDeaths);
  }
  
  return { S: curS, E: curE, I: curI, R: curR, D: curD };`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/simulation/seir.js', code);
