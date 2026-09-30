import { random } from './rng.js';
import { airports, seaports } from '../data/transit.js';

const fictionalNames = ["Chimera Virus", "Necroa Pathogen", "Solarium Phage", "Verdant Spore", "Noctis Fever", "Umbra Prion", "Borealis Flu", "Kinetica Syndrome"];

function determineClimate(country) {
    const lat = Math.abs(country.latitude || 0);
    if (lat < 23.5) return 'tropical';
    if (lat < 35) return 'subtropical';
    if (lat < 50) return 'temperate';
    if (lat < 65) return 'cold';
    return 'arid';
}

export function generateDoomsdayDisease(originCountry) {
    const climate = determineClimate(originCountry);
    const cId = originCountry.id;
    const myAirports = airports.filter(a => a.country === cId || a.country === cId.replace(/\s+/g, '')).length;
    const mySeaports = seaports.filter(s => s.country === cId || s.country === cId.replace(/\s+/g, '')).length;
    
    const profile = {
        diseaseName: fictionalNames[Math.floor(random() * fictionalNames.length)] + " - " + String.fromCharCode(65 + Math.floor(random() * 26)) + Math.floor(random() * 99),
        climateAffinity: climate,
        r0: 8 + random() * 10,
        incubationPeriod: 3 + random() * 9,
        infectiousPeriod: 8 + random() * 13,
        caseFatalityRate: 0.005 + random() * 0.035,
        airTransmission: 0.70 + random() * 0.30,
        waterTransmission: 0.40 + random() * 0.60,
        mutationRate: 0.10 + random() * 0.20
    };

    if (climate === 'tropical') profile.waterTransmission = Math.max(0.8, profile.waterTransmission);
    else if (climate === 'cold') profile.r0 = Math.max(12, profile.r0); 

    if (myAirports > 5) profile.airTransmission = Math.max(0.9, profile.airTransmission);
    if (mySeaports > 3) profile.waterTransmission = Math.max(0.8, profile.waterTransmission);

    if ((originCountry.population / (originCountry.area || 100000)) > 100) profile.r0 = Math.max(14, profile.r0);
    
    let established = false;
    let attempts = 0;
    while (!established && attempts < 10) {
        const cDefs = originCountry.defenses || { interventionStringency: 0.0, hygieneCompliance: 0.15, quarantineEfficiency: 0.1 };
        const effectiveR0 = profile.r0 * (1 - 0.8 * cDefs.interventionStringency) * (1 - 0.4 * cDefs.hygieneCompliance) * (1 - 0.5 * cDefs.quarantineEfficiency);
        if (effectiveR0 > 2.0) established = true;
        else {
            profile.r0 += 2.0;
            profile.incubationPeriod = Math.max(3, profile.incubationPeriod - 1);
            attempts++;
        }
    }
    return profile;
}
