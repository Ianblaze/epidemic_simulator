const fs = require('fs');
let code = fs.readFileSync('src/components/ParameterSliders.jsx', 'utf8');

const brokenPart = /<\/div>\r?\n;\r?\n\s*alert\("AEGIS System updated global defenses based on current threat\."\);\r?\n\s*\}\}\r?\n\s*>\r?\n\s*RUN AI DEFENSE PROTOCOL\r?\n\s*<\/button>/;

const fix = `</div>
             <button 
                 className="hud-btn primary glow" 
                 style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                 onClick={async () => {
                     const optModule = await import('../data/aegis_model.json');
                     const opt = optModule.default;
                     if(!opt) return;
                     const inp = [params.r0, params.incubationPeriod, params.caseFatalityRate, params.travelVolume];
                     const scaledInp = inp.map((v, i) => (v - opt.scaler_X_mean[i]) / opt.scaler_X_scale[i]);
                     
                     let l1 = [];
                     for(let j=0; j<opt.weights[0][0].length; j++){
                         let s = opt.biases[0][j];
                         for(let i=0; i<scaledInp.length; i++) s += scaledInp[i] * opt.weights[0][i][j];
                         l1.push(Math.max(0, s));
                     }
                     let l2 = [];
                     for(let j=0; j<opt.weights[1][0].length; j++){
                         let s = opt.biases[1][j];
                         for(let i=0; i<l1.length; i++) s += l1[i] * opt.weights[1][i][j];
                         l2.push(Math.max(0, s));
                     }
                     let out = [];
                     for(let j=0; j<opt.weights[2][0].length; j++){
                         let s = opt.biases[2][j];
                         for(let i=0; i<l2.length; i++) s += l2[i] * opt.weights[2][i][j];
                         out.push(s);
                     }
                     const res = out.map((v, i) => (v * opt.scaler_y_scale[i]) + opt.scaler_y_mean[i]);
                     
                     setParams({ 
                         ...params,
                         interventionStringency: parseFloat(Math.max(0, Math.min(1, res[0])).toFixed(2)),
                         borderStrictness: parseFloat(Math.max(0, Math.min(1, res[1])).toFixed(2)),
                         hygieneCompliance: parseFloat(Math.max(0, Math.min(1, res[2])).toFixed(2)),
                         quarantineEfficiency: parseFloat(Math.max(0, Math.min(1, res[3])).toFixed(2)),
                         vaccineFunding: parseFloat(Math.max(0, Math.min(1, res[4])).toFixed(2))
                     });
                     alert("AEGIS System updated global defenses based on current threat.");
                 }}
             >
                RUN AI DEFENSE PROTOCOL
             </button>`;

code = code.replace(brokenPart, fix);
code = code.replace(/dY>[^A]*AEGIS/, 'AEGIS');
code = code.replace(/\{nukeFired \? "[^"]*PROTOCOL EXECUTED"/, '{nukeFired ? "⚠️ PROTOCOL EXECUTED"');

fs.writeFileSync('src/components/ParameterSliders.jsx', code);
console.log('Fixed ParameterSliders');
