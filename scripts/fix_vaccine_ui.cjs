const fs = require('fs');
let code = fs.readFileSync('src/components/SimulationTab.jsx', 'utf8');

const overlayRegex = /<div className="status-overlay">[\s\S]*?<\/div>\s*<\/div>/;

const newOverlay = `<div className="status-overlay">
            <div className="status-block primary">
              <div className="status-label">INFECTED</div>
              <div className="status-value">{formatNum(totalInfected)}</div>
            </div>
            <div className="status-block danger">
              <div className="status-label">DEAD</div>
              <div className="status-value">{formatNum(totalDead)}</div>
            </div>
            <div className="status-block success" style={{ color: '#00cc44' }}>
              <div className="status-label">RECOVERED</div>
              <div className="status-value">{formatNum(totalRecovered)}</div>
            </div>
          </div>
          
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.8)', border: '1px solid var(--cyan)', padding: '1rem', borderRadius: '8px', zIndex: 10 }}>
             <div style={{ fontSize: '0.7rem', color: 'var(--cyan)', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '1px' }}>VACCINE DEVELOPMENT</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #333', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', background: \`conic-gradient(var(--cyan) \${Math.min(100, Math.max(0, props.vaccineProgress || 0))}%, transparent 0)\` }}></div>
                   <div style={{ position: 'absolute', width: '80%', height: '80%', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--cyan)', fontWeight: 'bold' }}>{Math.round(props.vaccineProgress || 0)}%</span>
                   </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#ccc', maxWidth: '120px' }}>
                   {(props.vaccineProgress || 0) >= 100 ? 'Vaccine Deployed Globally.' : 'Research underway to combat pathogen...'}
                </div>
             </div>
          </div>
        </div>`;

code = code.replace(overlayRegex, newOverlay);
fs.writeFileSync('src/components/SimulationTab.jsx', code);
console.log('Added vaccine timer UI to SimulationTab');
