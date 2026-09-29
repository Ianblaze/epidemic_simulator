import fs from 'fs';
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

const newTick = \  const tick = () => {
    setDay(prev => {
      const nextDay = prev + 1;
      
      if (isHistorical) {
          if (nextDay >= historicalPlayback.length) {
              stop();
              return prev;
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
              addNews(nextDay, \\\Historical Data (\\\): \\\ active cases, \\\ deaths globally.\\\, 'info');
          }
          
          setCountryStates(new Map(statesRef.current));
          setEventLog([...logRef.current]);
          
          let tE = 0, tI = 0, tR = 0, tD = 0;
          statesRef.current.forEach(s => { tE += s.E; tI += s.I; tR += s.R; tD += s.D; });
          setChartData(chart => [...chart, { day: nextDay, E: tE, I: tI, R: tR, D: tD }]);
          
          return nextDay;
      }
      
      // Calculate active variants\;

code = code.replace(/  const tick = \(\) => \{\s*setDay\(prev => \{\s*const nextDay = prev \+ 1;\s*\/\/ Calculate active variants/, newTick);
fs.writeFileSync('src/hooks/useSimulation.js', code);
