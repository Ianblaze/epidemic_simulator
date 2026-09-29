const fs = require('fs');

let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// 1. Dynamic News Update: World Healing
const oldNewsGenerator = /if \(globalI > 1000000\) \{/;
const newNewsGenerator = `
      // World Healing News
      if (globalR > globalI * 2 && globalI > 100000 && Math.random() < 0.05) {
          addNews(nextDay, 'Global recovery accelerates as healthcare systems stabilize and cases drop.', 'info');
      }
      if (globalR > globalI * 5 && globalI > 10000 && Math.random() < 0.05) {
          addNews(nextDay, 'World health officials cautiously optimistic as the pandemic recedes.', 'info');
      }
      
      if (globalI > 1000000) {`;

code = code.replace(oldNewsGenerator, newNewsGenerator);

// 2. Win / Loss Logic: Re-add the timing prediction check
const oldWinLogic = /if \(gameMode === 'DOOMSDAY'\) \{[\s\S]*?\} else if \(gameMode === 'AEGIS'\) \{[\s\S]*?\} else if \(sumS <= 1000\) \{[\s\S]*?\}/;
const newWinLogic = `if (gameMode === 'DOOMSDAY') {
          if (sumS <= 1000) {
              if (paramsRef.current.predictedDay && Math.abs(day - paramsRef.current.predictedDay) <= 50) {
                  setGameResult('WIN');
              } else {
                  setGameResult('LOSS_TIMING');
              }
              setIsRunning(false);
          } else if (sumE < 1 && sumI < 1) {
              setGameResult('LOSS');
              setIsRunning(false);
          }
      } else if (gameMode === 'AEGIS') {
          if (sumE < 1 && sumI < 1) {
              if (paramsRef.current.predictedDay && Math.abs(day - paramsRef.current.predictedDay) <= 50) {
                  setGameResult('WIN');
              } else {
                  setGameResult('LOSS_TIMING');
              }
              setIsRunning(false);
          } else if (sumS <= 1000) {
              setGameResult('LOSS');
              setIsRunning(false);
          }
      }`;

code = code.replace(oldWinLogic, newWinLogic);

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Fixed useSimulation timing logic and news');
