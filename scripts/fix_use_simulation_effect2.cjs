const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

const effectStart = code.indexOf('  useEffect(() => {\n    if (!isRunning');
if (effectStart !== -1) {
    const codeBefore = code.substring(0, effectStart);
    const newEffect = `  useEffect(() => {
    if (!isRunning || day < 2 || !countryStates) return;
    
    let sumS = 0, sumE = 0, sumI = 0;
    countryStates.forEach(c => {
       sumS += c.S;
       sumE += c.E;
       sumI += c.I;
    });
    
    if (gameMode === 'DOOMSDAY') {
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
    }
  }, [day, countryStates, isRunning, gameMode]);

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
    gameMode,
    setGameMode,
    gameResult,
    setGameResult,
    nukeFired,
    setNukeFired,
    vaccineProgress,
    seedCountry,
    setSeedCountry,
    inboundInfectionsRef,
    prepare,
    start,
    stop,
    reset
  };
}
`;
    fs.writeFileSync('src/hooks/useSimulation.js', codeBefore + newEffect);
    console.log('Replaced useEffect block completely');
} else {
    console.log('Could not find useEffect block');
}
