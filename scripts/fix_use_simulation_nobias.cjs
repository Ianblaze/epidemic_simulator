const fs = require('fs');

let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

const biasedBlock = /let biasedParams = \{ \.\.\.currentParams \};[\s\S]*?let newState = stepSEIR\(state, biasedParams, 1\);/;
const normalBlock = `let newState = stepSEIR(state, currentParams, 1);`;

code = code.replace(biasedBlock, normalBlock);

// Smooth the vaccine administration rate from 1% to 0.5% per day to avoid the massive spike
code = code.replace(/const vacAmount = newState\.S \* 0\.01;/g, 'const vacAmount = Math.min(newState.S, (newState.S + newState.E + newState.I + newState.R + newState.D) * 0.005);');

fs.writeFileSync('src/hooks/useSimulation.js', code);
console.log('Removed heavy bias and smoothed vaccine curve');
