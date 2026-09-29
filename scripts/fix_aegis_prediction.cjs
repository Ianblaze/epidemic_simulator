const fs = require('fs');

let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

const target = /if \(effectiveR0 < 1\) \{[\s\S]*?\} else \{[\s\S]*?\}/;
const replacement = `if (effectiveR0 < 1) {
                                      // It dies out naturally. But if natural decay takes longer than the vaccine, the vaccine wins.
                                      const naturalDecay = Math.round(150 / (1 - effectiveR0));
                                      const vaccineWin = Math.round(vaccineDays + 140);
                                      pDay = Math.min(naturalDecay, vaccineWin);
                                   } else {
                                      pDay = Math.round(vaccineDays + 140);
                                   }`;
code = code.replace(target, replacement);

fs.writeFileSync('src/components/Controls.jsx', code);
console.log('Fixed Aegis prediction for early extinction');
