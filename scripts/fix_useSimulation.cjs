const fs = require('fs');
const code = \import { useState, useRef, useCallback } from 'react';
import { stepSEIR } from '../simulation/seir.js';
import { checkMutation, applyVariantEffects } from '../simulation/mutations.js';

export default function useSimulation() {
  const [day, setDay] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStaging, setIsStaging] = useState(false);
  const [countryStates, setCountryStates] = useState(null);
  const [seedCountry, setSeedCountryState] = useState('');
  const [eventLog, setEventLog] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [variants, setVariants] = useState([]);
  const [simSpeed, setSimSpeedState] = useState(1);
  
  const [params, setParamsState] = useState({
    r0: 2.5,
    incubationPeriod: 5.2,
    infectiousPeriod: 10,
    caseFatalityRate: 0.023,
    mutationRate: 0.15,
    travelVolume: 0.5,
    interventionStringency: 0.0,
    populationScale: 1.0,
    airImmunity: 0.5,
    waterImmunity: 0.5,
    livestockAffection: 0.5
  });

  const intervalRef = useRef(null);
  const statesRef = useRef(new Map());
  const logRef = useRef([]);
  const paramsRef = useRef(params);
  const variantsRef = useRef([]);
  const speedRef = useRef(simSpeed);
  const inboundInfectionsRef = useRef([]);
  
  paramsRef.current = params;
  variantsRef.current = variants;
  speedRef.current = simSpeed;

  const initSimulation = useCallback(() => {
    statesRef.current.clear();
    setDay(0);
    setCountryStates(new Map());
    setEventLog([]);
    setChartData([]);
    setVariants([]);
    logRef.current = [];
  }, []);

  const setParams = (newParams) => {
    setParamsState(prev => ({ ...prev, ...newParams }));
  };

  const setSeedCountry = (countryId) => {
    setSeedCountryState(countryId);
  };

  const prepare = () => {
    if (!seedCountry) return;
    setIsStaging(true);
  };

  const setSimSpeed = (mult) => {
    setSimSpeedState(mult);
    speedRef.current = mult;
    if (isRunning || intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, 3000 / mult);
    }
  };

  const start = () => {
    const current = statesRef.current;
    if (!seedCountry) {
      setEventLog(prev => [...prev, { day: day, message: 'Error: No seed country selected', type: 'info' }]);
      return;
    }
    
    if (current.size === 0) {
      import('../data/countries.js').then((module) => {
        const countriesData = module.default;
        countriesData.forEach(c => {
          current.set(c.id, { S: c.population, E: 0, I: 0, R: 0, D: 0 });
        });
        const seedState = current.get(seedCountry);
        if (seedState) {
          seedState.S -= 1;
          seedState.I += 1;
          const seedCountryObj = countriesData.find(c => c.id === seedCountry);
          const realName = seedCountryObj ? seedCountryObj.name : seedCountry;
          logRef.current.push({ day: 0, message: \\\Patient Zero identified in \\\\, type: 'alert' });
        }
        setCountryStates(new Map(current));
        setEventLog([...logRef.current]);
      });
    }

    setIsRunning(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 3000 / speedRef.current);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const reset = () => {
    stop();
    setIsStaging(false);
    initSimulation();
  };

  const tick = () => {
    setDay(prev => {
      const nextDay = prev + 1;
      const currentParams = paramsRef.current;
      
      // Process airborne and waterborne inbound infections from FlatWorldMap
      while (inboundInfectionsRef.current.length > 0) {
         const inbound = inboundInfectionsRef.current.pop();
         const targetState = statesRef.current.get(inbound.country);
         if (targetState && targetState.S > 10) {
            const amount = inbound.type === 'ship' ? 10 : 5;
            targetState.S -= amount;
            targetState.E += amount;
            if (!logRef.current.find(l => l.message.includes(\\\spreads to \\\\))) {
               logRef.current.push({ day: nextDay, message: \\\Infection spreads to \ via \\\\, type: 'warning' });
            }
         }
      }
      
      const newStates = new Map();
      
      statesRef.current.forEach((state, countryId) => {
        newStates.set(countryId, stepSEIR(state, currentParams, 1));
      });
      
      let globalI = 0;
      let globalD = 0;
      newStates.forEach((s) => {
        globalI += s.I;
        globalD += s.D;
      });

      if (globalI > 1000 && !logRef.current.find(l => l.message.includes('1,000 cases'))) {
         logRef.current.push({ day: nextDay, message: 'Global infections surpass 1,000 cases. WHO issues early warning.', type: 'warning' });
      } else if (globalI > 1000000 && !logRef.current.find(l => l.message.includes('1 Million'))) {
         logRef.current.push({ day: nextDay, message: 'Over 1 Million infected worldwide. Global travel restrictions urged.', type: 'alert' });
      } else if (globalI > 100000000 && !logRef.current.find(l => l.message.includes('100 Million'))) {
         logRef.current.push({ day: nextDay, message: 'Pandemic reaches 100 Million cases. Healthcare systems collapsing globally.', type: 'alert' });
      }

      if (globalD > 10000 && !logRef.current.find(l => l.message.includes('10,000 deaths'))) {
         logRef.current.push({ day: nextDay, message: 'Death toll crosses 10,000. Mass burials reported in affected regions.', type: 'alert' });
      } else if (globalD > 1000000 && !logRef.current.find(l => l.message.includes('1 Million deaths'))) {
         logRef.current.push({ day: nextDay, message: 'Global deaths exceed 1 Million. International mourning declared.', type: 'alert' });
      }

      if (globalI > 1000) {
         const ids = Array.from(newStates.keys());
         const randomTarget = ids[Math.floor(Math.random() * ids.length)];
         const ts = newStates.get(randomTarget);
         if (ts && ts.S > 100) {
           ts.S -= 5;
           ts.E += 5;
         }
      }

      const mutation = checkMutation(nextDay, globalI, currentParams, variantsRef.current);
      if (mutation) {
        logRef.current.push({ day: nextDay, message: \\\New variant detected: \\\\, type: 'warning' });
        
        variantsRef.current = [...variantsRef.current, mutation];
        setVariants(variantsRef.current);
        
        const updatedStates = applyVariantEffects(newStates, mutation);
        statesRef.current = updatedStates;
        
        setParamsState(prevP => ({
          ...prevP,
          r0: prevP.r0 * mutation.r0Modifier
        }));
      } else {
        statesRef.current = newStates;
      }

      setCountryStates(new Map(statesRef.current));
      setEventLog([...logRef.current]);

      let tE = 0, tI = 0, tR = 0, tD = 0;
      statesRef.current.forEach(s => { tE += s.E; tI += s.I; tR += s.R; tD += s.D; });
      setChartData(chart => [...chart, { day: nextDay, E: tE, I: tI, R: tR, D: tD }]);

      return nextDay;
    });
  };

  return {
    countryStates,
    chartData,
    eventLog,
    variants,
    day,
    isRunning,
    isStaging,
    params,
    setParams,
    simSpeed,
    setSimSpeed,
    seedCountry,
    setSeedCountry,
    inboundInfectionsRef,
    prepare,
    start,
    stop,
    reset
  };
}
\;

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('useSimulation updated');
