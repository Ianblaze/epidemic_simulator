const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

code = code.replace(
  '<FlatWorldMap \n              countryStates={simulation.countryStates}\n                params={simulation.params}\n              seedCountry={simulation.seedCountry}\n            />',
  '<FlatWorldMap \n              countryStates={simulation.countryStates}\n              params={simulation.params}\n              seedCountry={simulation.seedCountry}\n              isRunning={simulation.isRunning}\n              inboundInfectionsRef={simulation.inboundInfectionsRef}\n            />'
);

// Fallback if the above doesn't match perfectly
if (!code.includes('inboundInfectionsRef')) {
  code = code.replace(
    /countryStates=\{simulation\.countryStates\}[\s\S]*?seedCountry=\{simulation\.seedCountry\}/,
    'countryStates={simulation.countryStates}\n              params={simulation.params}\n              isRunning={simulation.isRunning}\n              inboundInfectionsRef={simulation.inboundInfectionsRef}\n              seedCountry={simulation.seedCountry}'
  );
}

fs.writeFileSync('src/App.jsx', code);
console.log('App updated');
