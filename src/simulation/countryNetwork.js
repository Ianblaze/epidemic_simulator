import countriesData from '../data/countries.js';
import { airports, seaports, routes } from '../data/transit.js';
import { countryCentroids, landBorderPairs } from '../data/countryGeography.js';

export { countryCentroids };

const countryIds = new Set(countriesData.map(country => country.id));

export const landNeighbors = new Map();
for (const [countryId, neighborId] of landBorderPairs) {
    if (!landNeighbors.has(countryId)) landNeighbors.set(countryId, new Set());
    if (!landNeighbors.has(neighborId)) landNeighbors.set(neighborId, new Set());
    landNeighbors.get(countryId).add(neighborId);
    landNeighbors.get(neighborId).add(countryId);
}

export const flightNeighbors = new Map();
export const shipNeighbors = new Map();
export const fallbackFlightNeighbors = new Map();
const locationCountry = new Map([
    ...airports.map(location => [location.id, location.country]),
    ...seaports.map(location => [location.id, location.country]),
]);

const connectCountries = (graph, from, to) => {
    if (!countryIds.has(from) || !countryIds.has(to) || from === to) return;
    if (!graph.has(from)) graph.set(from, new Set());
    if (!graph.has(to)) graph.set(to, new Set());
    graph.get(from).add(to);
    graph.get(to).add(from);
};
const connectFallbackFlight = (from, to) => {
    connectCountries(flightNeighbors, from, to);
    if (!fallbackFlightNeighbors.has(from)) fallbackFlightNeighbors.set(from, new Set());
    if (!fallbackFlightNeighbors.has(to)) fallbackFlightNeighbors.set(to, new Set());
    fallbackFlightNeighbors.get(from).add(to);
    fallbackFlightNeighbors.get(to).add(from);
};

for (const [fromLocation, toLocation] of routes.flights) {
    connectCountries(flightNeighbors, locationCountry.get(fromLocation), locationCountry.get(toLocation));
}
for (const route of routes.ships) {
    let previousCountry = null;
    for (const locationId of route.path) {
        const currentCountry = locationCountry.get(locationId);
        if (currentCountry && previousCountry && currentCountry !== previousCountry) {
            connectCountries(shipNeighbors, previousCountry, currentCountry);
        }
        if (currentCountry) previousCountry = currentCountry;
    }
}

// The supplied timetable omits routes for a number of countries. Add
// deterministic nearest-hub air links for those countries, then bridge any
// remaining route-network components. Infection still requires a red transit.
const allNeighbors = (countryId) => new Set([
    ...(landNeighbors.get(countryId) || []),
    ...(flightNeighbors.get(countryId) || []),
    ...(shipNeighbors.get(countryId) || []),
]);
const distanceSquared = (a, b) => {
    const [lonA, latA] = countryCentroids[a] || [];
    const [lonB, latB] = countryCentroids[b] || [];
    if (![lonA, latA, lonB, latB].every(Number.isFinite)) return Infinity;
    const meanLat = (latA + latB) * Math.PI / 360;
    const adjustedLon = (lonA - lonB) * Math.cos(meanLat);
    return adjustedLon * adjustedLon + (latA - latB) * (latA - latB);
};

const routedCountries = new Set([...flightNeighbors.keys(), ...shipNeighbors.keys()]);
const routeHubs = [...routedCountries];
for (const countryId of countryIds) {
    if (routedCountries.has(countryId)) continue;
    let nearestHub = null;
    for (const hub of routeHubs) {
        const distance = distanceSquared(countryId, hub);
        if (!nearestHub || distance < nearestHub.distance) nearestHub = { hub, distance };
    }
    if (nearestHub && Number.isFinite(nearestHub.distance)) {
        connectFallbackFlight(countryId, nearestHub.hub);
    }
}

const findComponents = () => {
    const seen = new Set();
    const components = [];
    for (const countryId of countryIds) {
        if (seen.has(countryId)) continue;
        const component = [];
        const pending = [countryId];
        seen.add(countryId);
        while (pending.length) {
            const current = pending.pop();
            component.push(current);
            for (const neighbor of allNeighbors(current)) {
                if (!seen.has(neighbor)) {
                    seen.add(neighbor);
                    pending.push(neighbor);
                }
            }
        }
        components.push(component);
    }
    return components;
};

let components = findComponents();
while (components.length > 1) {
    components.sort((a, b) => b.length - a.length);
    const hubComponent = components[0];
    let nearest = null;
    for (let componentIndex = 1; componentIndex < components.length; componentIndex++) {
        for (const from of components[componentIndex]) {
            for (const to of hubComponent) {
                const distance = distanceSquared(from, to);
                if (!nearest || distance < nearest.distance) nearest = { from, to, distance, componentIndex };
            }
        }
    }
    if (!nearest || !Number.isFinite(nearest.distance)) break;
    connectFallbackFlight(nearest.from, nearest.to);
    components = findComponents();
}
