export function checkMutation(day, totalGlobalInfected, params, existingVariants) {
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
    
    return {
      id: 'variant_' + (index + 1),
      name: name,
      r0Modifier: 0.8 + Math.random() * 0.6,
      immuneEscape: Math.random() * 0.3,
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
