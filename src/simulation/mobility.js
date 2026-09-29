export function buildAdjacencyMap(routes) {
  const adjacencyMap = new Map();
  for (const route of routes) {
    if (!adjacencyMap.has(route.from)) {
      adjacencyMap.set(route.from, []);
    }
    adjacencyMap.get(route.from).push({ neighbor: route.to, volume: route.volume });
    
    if (!adjacencyMap.has(route.to)) {
      adjacencyMap.set(route.to, []);
    }
    adjacencyMap.get(route.to).push({ neighbor: route.from, volume: route.volume });
  }
  return adjacencyMap;
}

export function computeTravelInfections(countryStates, adjacencyMap, params) {
  const spillover = new Map();
  
  for (const [countryId, stateA] of countryStates.entries()) {
    const neighbors = adjacencyMap.get(countryId) || [];
    const N = stateA.S + stateA.E + stateA.I + stateA.R;
    const infectedFraction = N > 0 ? stateA.I / N : 0;
    
    for (const neighbor of neighbors) {
      const travelRate = neighbor.volume * params.travelVolume * 0.001;
      const travelInfections = travelRate * stateA.I * infectedFraction;
      
      if (travelInfections > 0) {
        const currentSpill = spillover.get(neighbor.neighbor) || 0;
        spillover.set(neighbor.neighbor, currentSpill + travelInfections);
      }
    }
  }
  
  return spillover;
}
