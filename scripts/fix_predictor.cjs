const fs = require('fs');

let code = fs.readFileSync('src/simulation/predictor.js', 'utf8');
code = code.replace(/const keys = Array\.from\(newStates\.keys\(\)\);/g, 'const keys = Array.from(states.keys());');
code = code.replace(/const rTarget = newStates\.get\(rTargetId\);/g, 'const rTarget = newStates.get(rTargetId) || states.get(rTargetId);');
// Wait, if we use states.get, we're mutating the OLD state if it hasn't been added to newStates yet.
// Instead, just use states.keys() but mutate newStates if present, else wait? No, in a synchronous loop, we should just mutate states?
// Better: pre-populate newStates with all states, THEN do stepSEIR.
