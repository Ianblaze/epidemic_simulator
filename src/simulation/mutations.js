export function checkMutation(day, totalGlobalInfected, params, existingVariants, gameMode = 'AEGIS') {
  let p = params.mutationRate * (totalGlobalInfected / 1e8) * 0.01;
  p = Math.min(p, 0.3);
  
  if (Math.random() < p) {
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
    
    let r0Modifier = 0.8 + Math.random() * 0.6;
    let immuneEscape = Math.random() * 0.3;
    if (gameMode === 'DOOMSDAY') {
        r0Modifier = 1.05 + Math.random() * 0.15; // 1.05 to 1.20
        immuneEscape = 0.05 + Math.random() * 0.20; // 0.05 to 0.25
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
