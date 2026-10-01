const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

// Build a country- and pathogen-specific opening response. Country defenses
// describe existing capacity; pathogen traits scale how much extra capacity
// Aegis needs to deploy.
export function initAegisDefenses(disease, country = {}) {
    const base = country.defenses || {};
    const r0 = Math.max(0.1, disease.r0 || 2);
    const lethality = clamp(disease.caseFatalityRate || 0);
    const air = clamp(disease.airImmunity ?? disease.airTransmission ?? 0.5);
    const water = clamp(disease.waterImmunity ?? disease.waterTransmission ?? 0.5);
    const incubation = Math.max(1, disease.incubationPeriod || 5);
    const infectious = Math.max(1, disease.infectiousPeriod || 5);
    const transmissibility = clamp((r0 - 1) / 12);
    const urgency = clamp(transmissibility * 0.55 + lethality * 0.2 + air * 0.125 + water * 0.125);
    const populationScale = clamp(Math.log10(Math.max(1, country.population || 1) / 1e6) / 3, 0, 1);
    const responseDelay = clamp((incubation - 2) / 20 + (infectious - 2) / 30);

    return {
        interventionStringency: clamp((base.interventionStringency || 0) + 0.10 + urgency * 0.22 + responseDelay * 0.05),
        borderStrictness: clamp((base.borderStrictness || 0) + 0.18 + air * 0.17 + water * 0.08 + populationScale * 0.06),
        hygieneCompliance: clamp((base.hygieneCompliance || 0) + 0.08 + urgency * 0.18 + (1 - air) * 0.05),
        quarantineEfficiency: clamp((base.quarantineEfficiency || 0) + 0.08 + urgency * 0.20 + responseDelay * 0.08),
        vaccineFunding: clamp(Math.max(base.vaccineFunding || 0, 0.5 + urgency * 0.38 + populationScale * 0.05))
    };
}

export function adaptAegisDefenses(currentParams, globalI, prevGlobalI, globalPop, vaccineProgress) {
    const next = { ...currentParams };
    const ratio = globalPop > 0 ? globalI / globalPop : 0;
    const growth = globalI - (prevGlobalI || 0);
    // Continue targeted escalation while the outbreak is still large, including
    // a shrinking tail. Previously this returned unchanged below 0.1% infected.
    const persistentTail = globalI >= 1000 && ratio < 0.001;
    const activeThreat = ratio >= 0.001 || persistentTail;
    if (!activeThreat) return next;

    const pressure = clamp(ratio / 0.02, 0.15, 1);
    const escalation = growth > 0 ? 1 : (persistentTail ? 0.6 : 0.25);
    const step = (base, scale = 1) => Math.min(1, (next[base] || 0) + scale * escalation * (0.008 + 0.022 * pressure));
    next.interventionStringency = step('interventionStringency');
    next.borderStrictness = step('borderStrictness', 0.75);
    next.hygieneCompliance = step('hygieneCompliance', 0.65);
    next.quarantineEfficiency = step('quarantineEfficiency', 0.9);
    if (vaccineProgress < 100) next.vaccineFunding = step('vaccineFunding', 0.5);
    return next;
}
