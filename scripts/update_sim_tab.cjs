const fs = require('fs');
let code = fs.readFileSync('src/components/SimulationTab.jsx', 'utf8');

code = code.replace(/<Controls[\s\S]*?seedCountry=\{seedCountry\}[\s\S]*?setIsHistorical=\{setIsHistorical\}\s*\/>/g, (match) => {
    return match.replace(/\/>$/, '  gameMode={props.gameMode}\n                        setGameMode={props.setGameMode}\n                        params={props.params}\n                        setParams={props.setParams}\n                      />');
});

fs.writeFileSync('src/components/SimulationTab.jsx', code);
