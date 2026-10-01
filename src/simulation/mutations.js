import { random } from './rng.js';

export function checkMutation(day, totalGlobalInfected, params, existingVariants, gameMode = 'AEGIS') {
  // Limit Doomsday's adaptation to a finite sequence. Unbounded immune-escape
  // variants repeatedly returned recovered people to S, replenishing the
  // healthy pool forever and preventing the stated zero-healthy win condition.
  if (gameMode === 'DOOMSDAY' && existingVariants.length >= 8) return null;
  const modeRandom = gameMode === 'DOOMSDAY' ? random : Math.random;
  // DOOMSDAY is engineered for rapid adaptation; the old 0.01 factor made
  // mutations effectively vanish even when the scenario set mutationRate high.
  let p = params.mutationRate * (totalGlobalInfected / 1e8) * (gameMode === 'DOOMSDAY' ? 1 : 0.01);
  p = Math.min(p, 0.3);
  
  if (modeRandom() < p) {
    const greekLetters = [
      'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
      'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
      'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'
    ];
    
    const index = existingVariants.length;
    let name = greekLetters[index];
    if (!name) {
      name = 'Variant-' + (index + 1);
    }
    
    let r0Modifier = 0.8 + modeRandom() * 0.6;
    let immuneEscape = modeRandom() * 0.3;
    if (gameMode === 'DOOMSDAY') {
        r0Modifier = 1.05 + modeRandom() * 0.15; // 1.05 to 1.20
        immuneEscape = 0.05 + modeRandom() * 0.20; // 0.05 to 0.25
    }

    return {
      id: 'variant_' + (index + 1),
      name: name,
      r0Modifier: r0Modifier,
      immuneEscape: immuneEscape,
      emergenceDay: day
    };
  }
  
  return null;
}

export function applyVariantEffects(countryStates, variant) {
  const updatedStates = new Map();
  for (const [countryId, state] of countryStates.entries()) {
    const escaped = state.R * variant.immuneEscape;
    updatedStates.set(countryId, {
      ...state,
      S: state.S + escaped,
      R: state.R - escaped
    });
  }
  return updatedStates;
}
