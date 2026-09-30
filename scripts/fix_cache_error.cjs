const fs = require('fs');
let code = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

// Ensure countryKeysCache is defined outside the loop
if (!code.includes('const countryKeysCache = Array.from(newStates.keys());')) {
    code = code.replace(
        'states.forEach((state, countryId) => {',
        'const countryKeysCache = Array.from(newStates.keys());\n    states.forEach((state, countryId) => {'
    );
}

// Replace the inefficient inner `const keys = Array.from(newStates.keys());`
code = code.replace(
    /const keys = Array\.from\(newStates\.keys\(\)\);\s*for \(let i = 0; i < 4; i\+\+\) \{\s*const rTargetId = keys\[Math\.floor\(random\(\) \* keys\.length\)\];/g,
    `for (let i = 0; i < 4; i++) {
                const rTargetId = countryKeysCache[Math.floor(random() * countryKeysCache.length)];`
);

fs.writeFileSync('src/simulation/stepSimulation.js', code);
console.log("Fixed countryKeysCache ReferenceError");
