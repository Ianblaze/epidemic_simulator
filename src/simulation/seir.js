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

export function stepSEIR(state, params, dt, gameMode) {
  const livestockMult = 1 + (params.livestockAffection || 0) * 1.5;
  const interventionEffect = 1 - 0.80 * (params.interventionStringency || 0);
  const hygieneEffect = 1 - 0.40 * (params.hygieneCompliance || 0);
  const quarantineEffect = 1 - 0.50 * (params.quarantineEfficiency || 0);
  const effectiveR0 = Math.max(0, params.r0 * interventionEffect * hygieneEffect * quarantineEffect * livestockMult);
  
  const beta = effectiveR0 / params.infectiousPeriod;
  const sigma = 1 / params.incubationPeriod;
  const gamma = (1 / params.infectiousPeriod) * (1 - params.caseFatalityRate);
  const mu = (1 / params.infectiousPeriod) * params.caseFatalityRate;
  
  const steps = 10;
  const adt = (dt * 1.0) / steps;
  let curS = state.S, curE = state.E, curI = state.I, curR = state.R, curD = state.D;
  
  for(let step = 0; step < steps; step++) {
      const N = curS + curE + curI + curR;
      if (N <= 0) break;
      
      let newExposed = beta * curS * curI / N * adt;
      if (gameMode === 'DOOMSDAY' && curI > 0 && curS < N * 0.20) {
          // Endgame sweep: Once the herd immunity threshold is nearing (e.g. < 20% remaining), 
          // aggressively hunt down the rest to achieve DOOMSDAY victory conditions.
          newExposed += Math.min(curS, curS * 0.02 + 10) * adt;
      }
      
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
