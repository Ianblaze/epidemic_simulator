const fs = require('fs');
let code = fs.readFileSync('src/components/ParameterSliders.jsx', 'utf8');

// We need to destructure nukeFired in ParameterSliders
code = code.replace(/vaccineProgress \}\) \{/, "vaccineProgress, nukeFired }) {");

const nukeUI = `
             {vaccineProgress > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                   <div style={{ fontSize: '0.7rem', color: 'var(--cyan)' }}>Vaccine Research Progress</div>
                   <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: \`\${Math.min(100, vaccineProgress)}%\`, height: '100%', background: 'var(--cyan)' }}></div>
                   </div>
                </div>
             )}

             <div style={{ marginBottom: '1.5rem', background: nukeFired ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 0, 0.05)', border: nukeFired ? '2px solid var(--red)' : '1px solid var(--red)', borderRadius: '6px', padding: '1rem', textAlign: 'center', transition: 'all 0.5s ease' }}>
                <div style={{ color: 'var(--red)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem' }}>NUCLEAR SANITIZATION PROTOCOL</div>
                <div style={{ fontSize: '0.7rem', color: '#ccc', marginBottom: '1rem' }}>AI Authorization Only. Evaluates global despair thresholds. Eradicates pathogen by neutralizing all infected civilians.</div>
                <button className={\`hud-btn \${nukeFired ? '' : 'glow'}\`} style={{ borderColor: 'var(--red)', color: 'var(--red)', width: '100%', opacity: nukeFired ? 1 : 0.5, cursor: 'not-allowed', background: nukeFired ? 'var(--red)' : 'transparent', color: nukeFired ? '#000' : 'var(--red)', fontWeight: 'bold' }} disabled>
                    {nukeFired ? "⚠️ PROTOCOL EXECUTED" : "AWAITING AI AUTHORIZATION"}
                </button>
             </div>
`;

// Find where vaccineProgress is rendered and replace it with the new block
code = code.replace(/\{vaccineProgress > 0 && \([\s\S]*?\}\)/, nukeUI);

fs.writeFileSync('src/components/ParameterSliders.jsx', code);
console.log('Updated ParameterSliders.jsx for Red Button');
