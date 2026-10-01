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
  const interventionWeight = gameMode === 'AEGIS' ? 0.92 : 0.80;
  const hygieneWeight = gameMode === 'AEGIS' ? 0.55 : 0.40;
  const quarantineWeight = gameMode === 'AEGIS' ? 0.70 : 0.50;
  const interventionEffect = 1 - interventionWeight * (params.interventionStringency || 0);
  const hygieneEffect = 1 - hygieneWeight * (params.hygieneCompliance || 0);
  const quarantineEffect = 1 - quarantineWeight * (params.quarantineEfficiency || 0);
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
      // Only force the last local tail. Extra mid-wave drain collapsed the
      // whole map in ~17 days; the 9–10M stall happens after I fades.
      if (gameMode === 'DOOMSDAY' && curS > 0 && (curI + curE) > 0) {
        if (curS <= Math.max(1, N * 0.02) || curS < 100000) {
          newExposed = Math.max(newExposed, Math.min(curS, Math.max(newExposed, curS * 0.15)));
        }
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

  if (gameMode === 'DOOMSDAY' && curS > 0 && (curE + curI + curR + curD) > 10 && (curE + curI) < 1) {
    const mop = Math.min(curS, Math.max(1, curS * 0.35));
    curS -= mop;
    curE += mop;
  }
  
  return { S: curS, E: curE, I: curI, R: curR, D: curD };
}
