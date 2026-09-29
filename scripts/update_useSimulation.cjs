const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

const importStatement = \"import historicalPlayback from '../data/historical_playback.json';\";
if (!code.includes(importStatement)) {
    code = code.replace(/import \{ checkMutation, applyVariantEffects \} from '\.\.\/simulation\/mutations\.js';/, 
        \"import { checkMutation, applyVariantEffects } from '../simulation/mutations.js';\n\" + importStatement);
}

// Add state for historical mode
if (!code.includes('isHistorical')) {
    code = code.replace(/const \[isStaging, setIsStaging\] = useState\(false\);/, 
        \"const [isStaging, setIsStaging] = useState(false);\n  const [isHistorical, setIsHistorical] = useState(false);\");
}

// Expose it in the return
if (!code.includes('setIsHistorical')) {
    code = code.replace(/isStaging,/, \"isStaging,\n    isHistorical,\n    setIsHistorical,\");
}

// Modify start function to handle historical mode
const newStart = \const start = () => {
    const current = statesRef.current;
    if (!seedCountry && !isHistorical) {
      setEventLog(prev => [...prev, { day: day, message: 'Error: No seed country selected', type: 'info' }]);
      return;
    }
    
    if (current.size === 0) {
      import('../data/countries.js').then((module) => {
        countriesDataCache = module.default;
        const countriesData = module.default;
        
        if (isHistorical) {
            // Load day 0 of historical
            const day0 = historicalPlayback[0].states;
            countriesData.forEach(c => {
                const hState = day0[c.id];
                if (hState) {
                    current.set(c.id, { S: c.population - hState[0]-hState[1]-hState[2]-hState[3], E: hState[0], I: hState[1], R: hState[2], D: hState[3] });
                } else {
                    current.set(c.id, { S: c.population, E: 0, I: 0, R: 0, D: 0 });
                }
            });
            addNews(0, 'Historical Replay Initiated. Data source: devansh-singh-7/SEIRD-Model', 'alert');
        } else {
            countriesData.forEach(c => {
              current.set(c.id, { S: c.population, E: 0, I: 0, R: 0, D: 0 });
            });
            const seedState = current.get(seedCountry);
            if (seedState) {
              seedState.S -= 10;
              seedState.E += 5;
              seedState.I += 5;
              infectedCountriesRef.current.add(seedCountry);
              const realName = getCountryName(seedCountry);
              addNews(0, \BREAKING: Patient Zero identified in \. Health authorities are investigating.\, 'alert');
            }
        }
        setCountryStates(new Map(current));
        setEventLog([...logRef.current]);
      });
    }

    setIsRunning(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 3000 / speedRef.current);
  };\;

code = code.replace(/const start = \(\) => \{[\s\S]*?clearInterval\(intervalRef\.current\);\s*intervalRef\.current = setInterval\(tick, 3000 \/ speedRef\.current\);\s*\};/, newStart);

// Modify tick function to handle historical mode
const newTick = \const tick = () => {
    setDay(prev => {
      const nextDay = prev + 1;
      
      if (isHistorical) {
          if (nextDay >= historicalPlayback.length) {
              stop();
              return prev; // Replay finished
          }
          const hDay = historicalPlayback[nextDay];
          const newStates = new Map();
          
          countriesDataCache.forEach(c => {
              const hState = hDay.states[c.id];
              if (hState) {
                  newStates.set(c.id, { S: c.population - hState[0]-hState[1]-hState[2]-hState[3], E: hState[0], I: hState[1], R: hState[2], D: hState[3] });
              } else {
                  newStates.set(c.id, { S: c.population, E: 0, I: 0, R: 0, D: 0 });
              }
          });
          
          statesRef.current = newStates;
          
          let globalI = 0; let globalD = 0; let globalR = 0;
          newStates.forEach(s => { globalI += s.I; globalD += s.D; globalR += s.R; });
          
          if (nextDay % 30 === 0) {
              addNews(nextDay, \Historical Data (\): \ active cases, \ deaths globally.\, 'info');
          }
          
          setCountryStates(new Map(statesRef.current));
          setEventLog([...logRef.current]);
          
          let tE = 0, tI = 0, tR = 0, tD = 0;
          statesRef.current.forEach(s => { tE += s.E; tI += s.I; tR += s.R; tD += s.D; });
          setChartData(chart => [...chart, { day: nextDay, E: tE, I: tI, R: tR, D: tD }]);
          
          return nextDay;
      }
      
      // Standard SEIR simulation below...\;

code = code.replace(/const tick = \(\) => \{\s*setDay\(prev => \{\s*const nextDay = prev \+ 1;/, newTick);

fs.writeFileSync('src/hooks/useSimulation.js', code);
