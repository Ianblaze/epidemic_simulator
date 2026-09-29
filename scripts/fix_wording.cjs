const fs = require('fs');

let code = fs.readFileSync('src/components/SimulationTab.jsx', 'utf8');

// Update the result titles and descriptions
const titleRegex = /\{gameResult === 'WIN' \? \(props\.nukeFired \? 'PYRRHIC VICTORY' : 'MISSION ACCOMPLISHED'\) : \(gameResult === 'LOSS_TIMING' \? 'TIMING PREDICTION FAILED' : 'MISSION FAILED'\)\}/;
const newTitle = `{gameResult === 'WIN' ? (props.nukeFired ? 'PYRRHIC VICTORY' : 'MISSION ACCOMPLISHED') : (gameResult === 'LOSS_TIMING' ? 'PREDICTION DRIFT DETECTED' : 'MISSION FAILED')}`;
code = code.replace(titleRegex, newTitle);

const descRegex = /\{gameResult === 'LOSS_TIMING' \?[\s\S]*?\}\)\}/;
const newDesc = `{gameResult === 'LOSS_TIMING' ? 
                                 (props.gameMode === 'DOOMSDAY' ? "Project Doomsday successfully achieved global infection, but the AI's predictive timeline was wildly inaccurate (missed by >100 days). A true tactical victory requires exact precision." : "Project Aegis successfully synthesized a cure and eradicated the pathogen, but the AI's predictive timeline was wildly inaccurate (missed by >100 days). A true tactical victory requires exact precision.")
                              : (props.gameMode === 'DOOMSDAY' ? (
                                  gameResult === 'WIN' ? "Global infection achieved. Humanity has fallen exactly as the AI predicted. Project Doomsday is a complete success." : "The pathogen was contained and failed to infect the global population. Humanity survives."
                              ) : (
                                  gameResult === 'WIN' ? (props.nukeFired ? "The pathogen was eradicated, but millions of infected civilians were sacrificed in a nuclear sanitization protocol to achieve containment." : "The pathogen has been completely eradicated within the predicted timeframe. Project Aegis has successfully defended humanity.") : "Global defenses were overwhelmed. The pathogen breached containment and caused unacceptable casualties (over 2 Billion dead)."
                              ))}`;
code = code.replace(descRegex, newDesc);

fs.writeFileSync('src/components/SimulationTab.jsx', code);
console.log('Updated simulation end screen text');
