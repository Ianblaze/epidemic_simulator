const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// We need to move 'let vaccine = false;' outside the if block, next to 'let infected = false;'
code = code.replace(/let infected = false;\s*if \(state && state\.I > 0\) \{[\s\S]*?let vaccine = false;/g, (match) => {
    // match is roughly:
    // let infected = false;
    // if (state && state.I > 0) {
    //    ...
    //    let vaccine = false;
    
    // We want to extract the stuff in between, and move 'let vaccine = false;' to the top.
    return `let infected = false;
             let vaccine = false;
             if (state && state.I > 0) {
               const N = state.S + state.E + state.I + state.R + state.D;`;
});

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Fixed vaccine scoping error');
