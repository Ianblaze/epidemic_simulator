const fs = require('fs');

// Fix ParameterSliders.jsx
let pCode = fs.readFileSync('src/components/ParameterSliders.jsx', 'utf8');
pCode = pCode.replace(/color: 'var\(--red\)', width: '100%'/g, "width: '100%'");
fs.writeFileSync('src/components/ParameterSliders.jsx', pCode);

// Fix Controls.jsx
let cCode = fs.readFileSync('src/components/Controls.jsx', 'utf8');
// The error was: 
// 305|                                  }
// 306|                               }}
// 307|                               disabled={!seedCountry || !baseDisease}
// We have an extra } there because I probably inserted something without proper brackets.
cCode = cCode.replace(/\}\}\n\s*disabled=\{!seedCountry/g, '} disabled={!seedCountry');
fs.writeFileSync('src/components/Controls.jsx', cCode);
