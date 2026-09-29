const fs = require('fs');
let code = fs.readFileSync('src/components/Controls.jsx', 'utf8');

const oldBtn = /<button\s*className="hud-btn primary glow"\s*onClick=\{prepare\}\s*disabled=\{!seedCountry\}\s*>\s*PROCEED TO DEPLOYMENT/;
const newBtn = `<button 
                      className="hud-btn primary glow" 
                      onClick={async () => {
                         if (setParams) {
                            const optModule = await import('../data/aegis_model.json');
                            const opt = optModule.default;
                            if(opt) {
                               const inp = [params.r0 || 2.5, params.incubationPeriod || 5.0, params.caseFatalityRate || 0.02, 0.5]; 
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
                               
                               setParams(prev => ({ 
                                   ...prev,
                                   interventionStringency: parseFloat(Math.max(0, Math.min(1, res[0])).toFixed(2)),
                                   borderStrictness: parseFloat(Math.max(0, Math.min(1, res[1])).toFixed(2)),
                                   hygieneCompliance: parseFloat(Math.max(0, Math.min(1, res[2])).toFixed(2)),
                                   quarantineEfficiency: parseFloat(Math.max(0, Math.min(1, res[3])).toFixed(2)),
                                   vaccineFunding: parseFloat(Math.max(0, Math.min(1, res[4])).toFixed(2))
                               }));
                            }
                         }
                         prepare();
                      }}
                      disabled={!seedCountry || !baseDisease}
                    >
                      CALCULATE AI DEFENSES & DEPLOY`;

code = code.replace(oldBtn, newBtn);

fs.writeFileSync('src/components/Controls.jsx', code);
console.log('Updated Controls.jsx with Aegis calculation');
