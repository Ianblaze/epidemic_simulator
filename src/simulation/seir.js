export function initCountryState(population) {
  return { S: population, E: 0, I: 0, R: 0, D: 0 };
}

export function seedInfection(state, count) {
  const amountToSeed = Math.min(state.S, count);
  return {
    S: state.S - amountToSeed,
    E: state.E + amountToSeed,
    I: state.I,
    R: state.R,
    D: state.D
  };
}

export function stepSEIR(state, params, dt) {
  const livestockMult = 1 + (params.livestockAffection || 0) * 1.5;
  const interventionFactor = 1 - 0.85 * (params.interventionStringency || 0);
  const hygieneFactor = 1 - 0.45 * (params.hygieneCompliance || 0);
  const quarantineFactor = 1 - 0.55 * (params.quarantineEfficiency || 0);
  
  const effectiveR0 = Math.max(0, params.r0 * interventionFactor * hygieneFactor * quarantineFactor * livestockMult);
  
  // Realistic SEIR rates:
  // beta = transmission rate (how fast susceptible become exposed)
  // sigma = incubation rate (avg 5 days to become infectious)
  // gamma = recovery rate (people recover over the infectious period)
  // mu = death rate (fraction who die instead of recovering)
  const beta = effectiveR0 / params.infectiousPeriod;
  const sigma = 1 / params.incubationPeriod;
  
  // Recovery and death happen over the full infectious period (realistic timing)
  // With CFR of 2.3%, most people recover, a small fraction die
  const gamma = (1 / params.infectiousPeriod) * (1 - params.caseFatalityRate);
  const mu = (1 / params.infectiousPeriod) * params.caseFatalityRate;
  
    const steps = 10;
  const adt = (dt * 1.0) / steps;
  let curS = state.S, curE = state.E, curI = state.I, curR = state.R, curD = state.D;
  
  for(let step = 0; step < steps; step++) {
      const N = curS + curE + curI + curR;
      if (N <= 0) break;
      
      let newExposed = beta * curS * curI / N * adt;
      if (curS < 500000 && curI > curS) newExposed += Math.min(curS, 200 * adt); // cleanup
      if (curI > 100) newExposed += Math.min(curS, Math.max(500, curS * 0.02) * adt); // Relentless sweep
      
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
  
  return { S: curS, E: curE, I: curI, R: curR, D: curD };
}
