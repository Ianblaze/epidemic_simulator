export function initAegisDefenses(disease) {
    const r0Factor = Math.min(1.0, (disease.r0 || 2) / 20);
    const lethalFactor = Math.min(1.0, (disease.caseFatalityRate || 0.02) / 0.1);
    const airFactor = disease.airImmunity !== undefined ? disease.airImmunity : (disease.airTransmission || 0.5);
    const waterFactor = disease.waterImmunity !== undefined ? disease.waterImmunity : (disease.waterTransmission || 0.5);

    let intervention = r0Factor * 0.2 + lethalFactor * 0.1;
    let border = airFactor * 0.2 + waterFactor * 0.1;
    let hygiene = lethalFactor * 0.3 + r0Factor * 0.1;
    let quarantine = r0Factor * 0.2;
    let vaccine = lethalFactor * 0.5 + 0.1;

    return {
        interventionStringency: Math.max(0, Math.min(1.0, intervention)),
        borderStrictness: Math.max(0, Math.min(1.0, border)),
        hygieneCompliance: Math.max(0, Math.min(1.0, hygiene)),
        quarantineEfficiency: Math.max(0, Math.min(1.0, quarantine)),
        vaccineFunding: Math.max(0, Math.min(1.0, vaccine))
    };
}

export function adaptAegisDefenses(currentParams, globalI, prevGlobalI, globalPop, vaccineProgress) {
    let newParams = { ...currentParams };
    const infectedRatio = globalPop > 0 ? (globalI / globalPop) : 0;
    const growth = globalI - (prevGlobalI || 0);
    
    if (infectedRatio > 0.01) {
        if (growth > 0) {
            newParams.interventionStringency = Math.min(1.0, newParams.interventionStringency + 0.015);
            newParams.borderStrictness = Math.min(1.0, newParams.borderStrictness + 0.015);
            newParams.hygieneCompliance = Math.min(1.0, newParams.hygieneCompliance + 0.01);
            newParams.quarantineEfficiency = Math.min(1.0, newParams.quarantineEfficiency + 0.015);
            if (vaccineProgress < 100) newParams.vaccineFunding = Math.min(1.0, (newParams.vaccineFunding || 0) + 0.01);
        }
    } else if (infectedRatio > 0.001) {
        if (growth > 0) {
            newParams.interventionStringency = Math.min(1.0, newParams.interventionStringency + 0.005);
            newParams.borderStrictness = Math.min(1.0, newParams.borderStrictness + 0.005);
        }
    }
    return newParams;
}
