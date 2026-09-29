const fs = require('fs');
let code = fs.readFileSync('src/components/SimulationTab.jsx', 'utf8');

// 1. Destructure gameResult and setGameResult
code = code.replace(/day,\r?\n\s*hoveredCountry/, "day,\n    hoveredCountry,\n    gameResult,\n    setGameResult");

// 2. Add the overlay logic at the end of the return statement (inside the main div)
const overlayLogic = `
              {gameResult && (
                  <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      backdropFilter: 'blur(10px)', pointerEvents: 'auto'
                  }}>
                      <div style={{
                          padding: '3rem', borderRadius: '12px', textAlign: 'center',
                          border: gameResult === 'WIN' ? \`2px solid \${props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)'}\` : '2px solid #555',
                          background: 'rgba(20,20,20,0.95)',
                          boxShadow: gameResult === 'WIN' ? \`0 0 50px \${props.gameMode === 'DOOMSDAY' ? 'rgba(255, 50, 50, 0.4)' : 'rgba(0, 255, 200, 0.4)'}\` : 'none',
                          maxWidth: '600px'
                      }}>
                          <h1 style={{
                              fontSize: '2.5rem', marginBottom: '1rem',
                              color: gameResult === 'WIN' ? (props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)') : '#888',
                              textShadow: gameResult === 'WIN' ? \`0 0 20px \${props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)'}\` : 'none',
                              textTransform: 'uppercase', letterSpacing: '2px'
                          }}>
                              {gameResult === 'WIN' ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
                          </h1>
                          <p style={{ color: '#ccc', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                              {props.gameMode === 'DOOMSDAY' ? (
                                  gameResult === 'WIN' ? "Global infection achieved. Humanity has fallen before day 200. Project Doomsday is a complete success." : "The pathogen was contained or failed to spread to the entire global population within 200 days. Humanity survives."
                              ) : (
                                  gameResult === 'WIN' ? "The pathogen has been completely eradicated within 200 days. Project Aegis has successfully defended humanity." : "Global defenses were overwhelmed. The pathogen has breached containment and caused unacceptable casualties or lasted beyond 200 days."
                              )}
                          </p>
                          <button 
                              className={\`hud-btn glow \${props.gameMode === 'DOOMSDAY' ? '' : 'primary'}\`} 
                              style={{ padding: '0.8rem 2rem', fontSize: '1rem', borderColor: props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)', color: props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)' }}
                              onClick={() => { reset(); setGameResult(null); }}
                          >
                              INITIALIZE NEW SIMULATION
                          </button>
                      </div>
                  </div>
              )}
`;

const lastDivIndex = code.lastIndexOf('</div>');
if (lastDivIndex !== -1) {
    code = code.slice(0, lastDivIndex) + overlayLogic + code.slice(lastDivIndex);
}

fs.writeFileSync('src/components/SimulationTab.jsx', code);
console.log('Updated SimulationTab.jsx');
