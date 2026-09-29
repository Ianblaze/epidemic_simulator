import React, { useState } from 'react';
import countriesData from '../data/countries.js';
import diseaseProfiles from '../data/diseaseProfiles.js';
import { airports, seaports } from '../data/transit.js';

const SimpleSlider = ({ label, val, min, max, step, onChange, format }) => (
  <div style={{ marginBottom: '0.8rem' }}>
     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#ccc', marginBottom: '0.2rem' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 'bold', color: '#fff' }}>{format ? format(val) : val}</span>
     </div>
     <input type="range" className="slider-new" min={min} max={max} step={step} value={val || 0} onChange={e => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--cyan)' }} />
  </div>
);

export default function Controls({ 
  isStaging, 
  isRunning, 
  start, 
  stop, 
  reset, 
  prepare, 
  seedCountry, 
  setSeedCountry,
  params,
  setParams,
  gameMode,
  setGameMode
}) {
  const [doomsdayGenerated, setDoomsdayGenerated] = useState(false);
  const [baseDisease, setBaseDisease] = useState('');
  const [tooltips, setTooltips] = useState({});
  const [predictionReport, setPredictionReport] = useState(null);
  
  const selectedCountryData = seedCountry ? countriesData.find(c => c.id === seedCountry) : null;

  const generateDoomsday = async () => {
     const optModule = await import('../data/venom_model.json');
     const opt = optModule.default;
     
     const randomDisease = diseaseProfiles[Math.floor(Math.random() * diseaseProfiles.length)];
     setBaseDisease(randomDisease.name);

     const randomCountry = countriesData[Math.floor(Math.random() * countriesData.length)];
     setSeedCountry(randomCountry.id);
     
     const defs = randomCountry.defenses || {
         interventionStringency: 0.0,
         borderStrictness: 0.05,
         hygieneCompliance: 0.15,
         quarantineEfficiency: 0.1,
         vaccineFunding: 0.05
     };
     
     const pop = randomCountry.population / 1000000;
     const cId = randomCountry.id;
     const myAirports = airports.filter(a => a.country === cId || a.country === cId.replace(/\s+/g, '')).length;
     const mySeaports = seaports.filter(s => s.country === cId || s.country === cId.replace(/\s+/g, '')).length;
     
     const flights = Math.min(1.0, myAirports / 15.0);
     const ships = Math.min(1.0, mySeaports / 5.0);

     const inp = [pop, flights, ships];
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
     
     const diseaseName = randomDisease.name;
     let vectorReason = '';
     if (diseaseName.match(/COVID|SARS|Influenza/i)) {
         vectorReason = `Respiratory chassis selected to specifically exploit ${randomCountry.name}'s population density and close-contact networks.`;
     } else if (diseaseName.match(/Ebola|Plague|MERS/i)) {
         vectorReason = `Hemorrhagic/bacterial chassis chosen to maximize localized terror and rapidly overwhelm ${randomCountry.name}'s critical medical infrastructure.`;
     } else {
         vectorReason = `${diseaseName} chassis selected as the optimal genetic foundation to bypass ${randomCountry.name}'s specific climatic and biological defenses.`;
     }

     const finalR0 = Math.max(0.1, res[0]);
     const finalAir = Math.max(0, Math.min(1, res[3]));
     const finalWater = Math.max(0, Math.min(1, res[4]));
     
     setTooltips({
         vector: vectorReason,
         r0: finalR0 > 5 ? `Extreme infectivity engineered to punch through ${randomCountry.name}'s baseline hygiene and quarantine protocols.` : `Lower infectivity chosen because ${randomCountry.name}'s population density allows efficient spread without excessive mutation costs.`,
         lethality: Math.max(0, Math.min(1, res[2])) > 0.05 ? `High lethality (${(Math.max(0, Math.min(1, res[2])) * 100).toFixed(1)}%) engineered to overwhelm ${randomCountry.name}'s medical infrastructure.` : `Lethality suppressed to keep hosts alive longer, maximizing stealth spread across ${randomCountry.name}'s borders.`,
         incubation: Math.max(1, res[1]) >= 10 ? `Extended incubation (${Math.max(1, res[1]).toFixed(1)} days) to allow infected hosts to bypass ${randomCountry.name}'s border screenings completely asymptomatically.` : `Short incubation designed for rapid localized bursts before ${randomCountry.name} authorities can react.`,
         air: finalAir > 0.5 ? `Maximized air transmission to exploit ${randomCountry.name}'s international aviation network (${myAirports} active airports).` : `Air transmission deprioritized due to ${randomCountry.name}'s limited global flight connectivity (${myAirports} active airports).`,
         water: finalWater > 0.5 ? `Maximized water transmission to utilize ${randomCountry.name}'s maritime ports and coastal dependency (${mySeaports} active seaports).` : `Water transmission minimized as ${randomCountry.name} lacks significant maritime export infrastructure or is landlocked (${mySeaports} active seaports).`
     });
     
     
     // Use a curve that closely matches the SEIR engine's natural infection duration
     
     // Highly accurate SEIR duration heuristic for N = 8 Billion
     // Add population factor to introduce realistic variance per country
     const popFactor = Math.log10(pop + 1) * 12;
     const seirDuration = 80 + (400 / Math.max(0.1, finalR0 - 0.5));
     const transitFactor = (1.0 - (finalAir + finalWater) / 2.0) * 50;
     
     const pDay = Math.max(80, Math.round(seirDuration + transitFactor + popFactor + (Math.random() * 14 - 7)));


     
     setParams({ 
        ...params,
        ...defs,
        r0: parseFloat(finalR0.toFixed(1)),
        incubationPeriod: parseFloat(Math.max(1, res[1]).toFixed(1)),
        caseFatalityRate: parseFloat(Math.max(0, Math.min(1, res[2])).toFixed(4)),
        airImmunity: parseFloat(finalAir.toFixed(2)),
        waterImmunity: parseFloat(finalWater.toFixed(2)),
        predictedDay: pDay
     });
     
     setPredictionReport({ type: 'DOOMSDAY', day: pDay });
     setDoomsdayGenerated(true);
  };

  return (
    <div className="hud-controls">
       {!isStaging && !isRunning ? (
         <>
           <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button 
                 className={`hud-btn ${gameMode === 'DOOMSDAY' ? 'glow' : 'outline'}`}
                 style={{ flex: 1, padding: '0.5rem', fontSize: '0.7rem', borderColor: gameMode === 'DOOMSDAY' ? 'var(--red)' : '#444', color: gameMode === 'DOOMSDAY' ? 'var(--red)' : '#888' }}
                 onClick={() => { setGameMode && setGameMode('DOOMSDAY'); setDoomsdayGenerated(false); setPredictionReport(null); }}
              >
                 PROJECT DOOMSDAY
              </button>
              <button 
                 className={`hud-btn ${gameMode === 'AEGIS' ? 'primary glow' : 'outline'}`}
                 style={{ flex: 1, padding: '0.5rem', fontSize: '0.7rem' }}
                 onClick={() => { setGameMode && setGameMode('AEGIS'); setPredictionReport(null); }}
              >
                 PROJECT AEGIS
              </button>
           </div>
           
           {!gameMode ? (
             <div className="control-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ flex: 1, fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
                   Select <strong>DOOMSDAY</strong> to let the AI design a deadly pathogen.<br/><br/>
                   Select <strong>AEGIS</strong> to design a pathogen yourself and watch the AI cure it.
                </div>
             </div>
           ) : (
             <>
               {gameMode === 'AEGIS' ? (
                 <>
                   {!predictionReport ? (
                     <>
                       <div className="section-title">Target Country (Outbreak Origin)</div>
                       <select 
                          value={seedCountry || ''} 
                          onChange={(e) => setSeedCountry(e.target.value)}
                          disabled={isRunning || isStaging}
                          className="hud-select"
                          style={{ marginBottom: '1rem' }}
                       >
                          <option value="" disabled>-- Select a target --</option>
                          {countriesData.map(c => (
                             <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                       </select>

                       <div className="section-title">Biological Weapon Configuration</div>
                       <select
                          value={baseDisease || ''}
                          onChange={(e) => {
                             setBaseDisease(e.target.value);
                             const d = diseaseProfiles.find(dp => dp.name === e.target.value);
                             if (d && setParams) {
                                setParams(prev => ({
                                   ...prev,
                                   r0: d.r0,
                                   caseFatalityRate: d.caseFatalityRate,
                                   incubationPeriod: d.incubationPeriod,
                                   infectiousPeriod: d.infectiousPeriod,
                                   airImmunity: d.airImmunity,
                                   waterImmunity: d.waterImmunity
                                }));
                             }
                          }}
                          disabled={isRunning || isStaging}
                          className="hud-select"
                          style={{ marginBottom: '1rem' }}
                       >
                          <option value="" disabled>-- Choose a base pathogen --</option>
                          {diseaseProfiles.map(d => (
                             <option key={d.name} value={d.name}>{d.name}</option>
                          ))}
                       </select>
                       
                       {baseDisease && (
                         <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                            <SimpleSlider label="Infectivity (R0)" val={params.r0} min={0.1} max={25} step={0.1} onChange={v => setParams(p => ({...p, r0: v}))} />
                            <SimpleSlider label="Lethality" val={params.caseFatalityRate} min={0} max={1} step={0.01} onChange={v => setParams(p => ({...p, caseFatalityRate: v}))} format={v => (v*100).toFixed(1)+'%'} />
                            <SimpleSlider label="Incubation Period" val={params.incubationPeriod} min={1} max={45} step={1} onChange={v => setParams(p => ({...p, incubationPeriod: v}))} format={v => v+' days'} />
                            <SimpleSlider label="Air Transmission" val={params.airImmunity} min={0} max={1} step={0.05} onChange={v => setParams(p => ({...p, airImmunity: v}))} format={v => (v*100).toFixed(0)+'%'} />
                            <SimpleSlider label="Water Transmission" val={params.waterImmunity} min={0} max={1} step={0.05} onChange={v => setParams(p => ({...p, waterImmunity: v}))} format={v => (v*100).toFixed(0)+'%'} />
                         </div>
                       )}

                       <div className="control-actions">
                          <button 
                             className="hud-btn primary glow" 
                             onClick={async () => {
                                if (setParams) {
                                   const optModule = await import('../data/aegis_model.json');
                                   const opt = optModule.default;
                                   let newParams = { ...params };
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
                                      
                                      newParams = { 
                                          ...newParams,
                                          interventionStringency: parseFloat(Math.max(0, Math.min(1, res[0] * 0.85)).toFixed(2)),
                                          borderStrictness: parseFloat(Math.max(0, Math.min(1, res[1] * 0.85)).toFixed(2)),
                                          hygieneCompliance: parseFloat(Math.max(0, Math.min(1, res[2] * 0.85)).toFixed(2)),
                                          quarantineEfficiency: parseFloat(Math.max(0, Math.min(1, res[3] * 0.85)).toFixed(2)),
                                          vaccineFunding: parseFloat(Math.max(0, Math.min(1, res[4])).toFixed(2))
                                      };
                                   }
                                   
                                   // Match the exact vaccine mathematical timing from useSimulation
                                   const vaccineDays = 100 / Math.max(0.01, newParams.vaccineFunding * 0.33);
                                   const effectiveR0 = newParams.r0 * (1 - newParams.interventionStringency * 0.8);
                                   let pDay = 0;
                                   if (effectiveR0 < 1) {
                                      // It dies out naturally. But if natural decay takes longer than the vaccine, the vaccine wins.
                                      const naturalDecay = Math.round(60 / (1 - effectiveR0));
                                      const vaccineWin = Math.round(vaccineDays + 140);
                                      pDay = Math.min(naturalDecay, vaccineWin);
                                   } else {
                                      const herdImmunityDays = Math.round(200 + (15 / Math.max(1.1, effectiveR0)) * 80);
                                      pDay = Math.min(Math.round(vaccineDays + 140), herdImmunityDays);
                                   }
                                   pDay = Math.max(60, pDay);

                                   newParams.predictedDay = pDay;
                                   setParams(newParams);
                                   setPredictionReport({ type: 'AEGIS', day: pDay });
                                }
                             }}
                             disabled={!seedCountry || !baseDisease}
                           >
                             CALCULATE AI DEFENSES & PREDICT
                           </button>
                       </div>
                     </>
                   ) : (
                     <div style={{ background: 'rgba(0, 255, 200, 0.05)', border: '1px solid var(--cyan)', borderRadius: '6px', padding: '1.5rem' }}>
                        <div style={{ color: 'var(--cyan)', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>AEGIS PROTOCOLS DEPLOYED</div>
                        
                        <div style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Lockdown Stringency:</span> <strong style={{color:'var(--cyan)'}}>{(params.interventionStringency * 100).toFixed(0)}%</strong></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Border Closures:</span> <strong style={{color:'var(--cyan)'}}>{(params.borderStrictness * 100).toFixed(0)}%</strong></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Public Hygiene:</span> <strong style={{color:'var(--cyan)'}}>{(params.hygieneCompliance * 100).toFixed(0)}%</strong></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Quarantine Efficiency:</span> <strong style={{color:'var(--cyan)'}}>{(params.quarantineEfficiency * 100).toFixed(0)}%</strong></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Vaccine Funding:</span> <strong style={{color:'var(--cyan)'}}>{(params.vaccineFunding * 100).toFixed(0)}%</strong></div>
                        </div>

                        <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
                           <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem' }}>AEGIS ERADICATION PREDICTION</div>
                           <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--cyan)', textShadow: '0 0 20px var(--cyan)' }}>DAY {predictionReport.day}</div>
                           <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.5rem' }}>Target Window: Day {Math.max(0, predictionReport.day - 100)} - {predictionReport.day + 100}</div>
                        </div>
                        
                        <div className="control-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                           <button className="hud-btn outline" style={{ flex: 1, fontSize: '0.7rem' }} onClick={() => setPredictionReport(null)}>
                             RECONFIGURE
                           </button>
                           <button className="hud-btn primary glow" style={{ flex: 1, fontSize: '0.7rem' }} onClick={prepare}>
                             COMMENCE
                           </button>
                        </div>
                     </div>
                   )}
                 </>
               ) : (
                 <>
                   {!doomsdayGenerated ? (
                     <div className="control-actions">
                        <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '1rem', textAlign: 'center' }}>
                           The Doomsday AI will automatically scan the globe, select an optimal starting target, load their real-world government defenses, and engineer a bespoke pathogen to defeat them.
                        </div>
                        <button 
                          className="hud-btn glow" 
                          style={{ borderColor: 'var(--red)', color: 'var(--red)', width: '100%' }}
                          onClick={generateDoomsday}
                        >
                          GENERATE DOOMSDAY SCENARIO
                        </button>
                     </div>
                   ) : (
                     <div style={{ background: 'rgba(255, 50, 50, 0.05)', border: '1px solid var(--red)', borderRadius: '6px', padding: '1rem' }}>
                        <div style={{ color: 'var(--red)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>TARGET ACQUIRED</div>
                        <div style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>{selectedCountryData?.name}</div>
                        
                        <div style={{ fontSize: '0.75rem', color: '#ccc', marginBottom: '1rem', lineHeight: '1.4' }}>
                          Population: {(selectedCountryData?.population / 1000000).toFixed(1)}M<br/>
                          Baseline Defense Tier: {selectedCountryData?.defenses?.tier || 'Medium'}<br/>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.75rem', color: '#ccc', lineHeight: '1.5' }}>
                          <div style={{ color: 'var(--red)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Pathogen Engineered:</div>
                          <div style={{ cursor: 'help', borderBottom: '1px dotted #666', display: 'inline-block', marginBottom: '4px' }} title={tooltips.vector}>Vector: {baseDisease}</div><br/>
                          <div style={{ cursor: 'help', borderBottom: '1px dotted #666', display: 'inline-block', marginBottom: '4px' }} title={tooltips.r0}>Infectivity (R0): {params?.r0}</div><br/>
                          <div style={{ cursor: 'help', borderBottom: '1px dotted #666', display: 'inline-block', marginBottom: '4px' }} title={tooltips.lethality}>Lethality: {(params?.caseFatalityRate * 100).toFixed(2)}%</div><br/>
                          <div style={{ cursor: 'help', borderBottom: '1px dotted #666', display: 'inline-block', marginBottom: '4px' }} title={tooltips.incubation}>Incubation: {params?.incubationPeriod} days</div><br/>
                          <div style={{ cursor: 'help', borderBottom: '1px dotted #666', display: 'inline-block', marginBottom: '4px' }} title={tooltips.air}>Air Transmission: {(params?.airImmunity * 100).toFixed(0)}%</div><br/>
                          <div style={{ cursor: 'help', borderBottom: '1px dotted #666', display: 'inline-block' }} title={tooltips.water}>Water Transmission: {(params?.waterImmunity * 100).toFixed(0)}%</div>
                        </div>

                        <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
                           <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem' }}>DOOMSDAY PREDICTION</div>
                           <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--red)', textShadow: '0 0 20px var(--red)' }}>DAY {predictionReport?.day}</div>
                           <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.5rem' }}>Target Window: Day {Math.max(0, (predictionReport?.day || 0) - 100)} - {(predictionReport?.day || 0) + 100}</div>
                        </div>
                        
                        <div className="control-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                           <button className="hud-btn outline" style={{ flex: 1, fontSize: '0.7rem' }} onClick={generateDoomsday}>
                             RECALCULATE
                           </button>
                           <button className="hud-btn glow" style={{ flex: 1, fontSize: '0.7rem', borderColor: 'var(--red)', color: 'var(--red)' }} onClick={prepare}>
                             DEPLOY
                           </button>
                        </div>
                     </div>
                   )}
                 </>
               )}
             </>
           )}
         </>
       ) : (
         <div className="control-actions">
            {!isRunning ? (
              <button className="hud-btn primary glow" onClick={start}>
                RESUME SIMULATION
              </button>
            ) : (
              <button className="hud-btn outline" onClick={stop}>
                PAUSE
              </button>
            )}
            <button className="hud-btn outline" onClick={() => { reset(); setDoomsdayGenerated(false); setPredictionReport(null); }}>
               RESET
            </button>
         </div>
       )}
    </div>
  );
}
