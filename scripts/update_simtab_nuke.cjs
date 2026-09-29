const fs = require('fs');
let code = fs.readFileSync('src/components/SimulationTab.jsx', 'utf8');

// 1. Ensure nukeFired is destructured from props
if (!code.includes('nukeFired,')) {
    code = code.replace(/gameResult,\n\s*setGameResult/, "gameResult,\n    setGameResult,\n    nukeFired");
}

// 2. Pass nukeFired to ParameterSliders
code = code.replace(/vaccineProgress=\{props\.vaccineProgress\}/, "vaccineProgress={props.vaccineProgress}\n                      nukeFired={props.nukeFired}");

// 3. Update the overlay to handle the Pyrrhic Victory
const oldH1 = /\{gameResult === 'WIN' \? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'\}/;
const newH1 = `{gameResult === 'WIN' ? (props.nukeFired ? 'PYRRHIC VICTORY' : 'MISSION ACCOMPLISHED') : 'MISSION FAILED'}`;
code = code.replace(oldH1, newH1);

const oldColor = /color: gameResult === 'WIN' \? \(props\.gameMode === 'DOOMSDAY' \? 'var\(--red\)' : 'var\(--cyan\)'\) : '#888'/;
const newColor = `color: gameResult === 'WIN' ? (props.nukeFired ? '#ffaa00' : (props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)')) : '#888'`;
code = code.replace(oldColor, newColor);

const oldShadow = /textShadow: gameResult === 'WIN' \? \\\`0 0 20px \\\$\\{props\.gameMode === 'DOOMSDAY' \? 'var\(--red\)' : 'var\(--cyan\)'\\}\\\` : 'none'/;
const newShadow = `textShadow: gameResult === 'WIN' ? (props.nukeFired ? '0 0 20px #ffaa00' : \`0 0 20px \${props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)'}\`) : 'none'`;
code = code.replace(oldShadow, newShadow);

const oldBorder = /border: gameResult === 'WIN' \? \\\`2px solid \\\$\\{props\.gameMode === 'DOOMSDAY' \? 'var\(--red\)' : 'var\(--cyan\)'\\}\\\` : '2px solid #555'/;
const newBorder = `border: gameResult === 'WIN' ? (props.nukeFired ? '2px solid #ffaa00' : \`2px solid \${props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)'}\`) : '2px solid #555'`;
code = code.replace(oldBorder, newBorder);

const oldBoxShadow = /boxShadow: gameResult === 'WIN' \? \\\`0 0 50px \\\$\\{props\.gameMode === 'DOOMSDAY' \? 'rgba\\(255, 50, 50, 0\.4\\)' : 'rgba\\(0, 255, 200, 0\.4\\)'\\}\\\` : 'none'/;
const newBoxShadow = `boxShadow: gameResult === 'WIN' ? (props.nukeFired ? '0 0 50px rgba(255, 170, 0, 0.4)' : \`0 0 50px \${props.gameMode === 'DOOMSDAY' ? 'rgba(255, 50, 50, 0.4)' : 'rgba(0, 255, 200, 0.4)'}\`) : 'none'`;
code = code.replace(oldBoxShadow, newBoxShadow);

const oldP = /gameResult === 'WIN' \? "The pathogen has been completely eradicated within 200 days. Project Aegis has successfully defended humanity." : "Global defenses were overwhelmed. The pathogen has breached containment and caused unacceptable casualties or lasted beyond 200 days."/;
const newP = `gameResult === 'WIN' ? (props.nukeFired ? "The pathogen was eradicated, but millions of infected civilians were sacrificed in a nuclear sanitization protocol to achieve containment." : "The pathogen has been completely eradicated within 200 days. Project Aegis has successfully defended humanity.") : "Global defenses were overwhelmed. The pathogen has breached containment and caused unacceptable casualties or lasted beyond 200 days."`;
code = code.replace(oldP, newP);

fs.writeFileSync('src/components/SimulationTab.jsx', code);
console.log('Updated SimulationTab.jsx for Nuke Victory');
