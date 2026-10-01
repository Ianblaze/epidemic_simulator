import { runPrediction } from '../src/simulation/predictor.js';

const params = {
  r0: 12,
  incubationPeriod: 8,
  infectiousPeriod: 8,
  caseFatalityRate: 0.02,
  mutationRate: 0.3,
  travelVolume: 0.5,
  interventionStringency: 0,
  airImmunity: 0.9,
  waterImmunity: 0.85,
  livestockAffection: 0.5,
  borderStrictness: 0.05,
  hygieneCompliance: 0.15,
  quarantineEfficiency: 0.1,
  vaccineFunding: 0.05,
};

const result = runPrediction(params, 'CHINA', 'DOOMSDAY', 42);
console.log(JSON.stringify(result, null, 2));
