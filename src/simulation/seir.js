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
  const effectiveR0 = params.r0 * (1 - params.interventionStringency * 0.8) * livestockMult;
  
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
  
  const N = state.S + state.E + state.I + state.R;
  if (N <= 0) return { ...state };

  // Scale dt to simulate realistic daily progression
  const timeScale = 1.0;
  const adt = dt * timeScale;

  let newExposed = beta * state.S * state.I / N * adt;
  let newInfectious = sigma * state.E * adt;
  let newRecovered = gamma * state.I * adt;
  let newDeaths = mu * state.I * adt;

  // Clamp to prevent negative compartments
  newExposed = Math.min(newExposed, state.S);
  newInfectious = Math.min(newInfectious, state.E);
  const leavingI = newRecovered + newDeaths;
  
  if (leavingI > state.I) {
    const ratio = state.I / leavingI;
    newRecovered *= ratio;
    newDeaths *= ratio;
  }

  return {
    S: Math.max(0, state.S - newExposed),
    E: Math.max(0, state.E + newExposed - newInfectious),
    I: Math.max(0, state.I + newInfectious - newRecovered - newDeaths),
    R: Math.max(0, state.R + newRecovered),
    D: Math.max(0, state.D + newDeaths)
  };
}
