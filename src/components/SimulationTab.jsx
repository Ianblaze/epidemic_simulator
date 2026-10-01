import React, { useMemo, useState } from 'react';
import LiveChart from './LiveChart.jsx';
import ParameterSliders from './ParameterSliders.jsx';
import Controls from './Controls.jsx';
import EventLog from './EventLog.jsx';
import countriesData from '../data/countries.js';
import intelData from '../data/intelligence.js';

export default function SimulationTab(props) {
  const {
    countryStates,
    seedCountry,
    setSeedCountry,
    isRunning,
    isStaging,
    isHistorical,
    setIsHistorical,
    prepare,
    chartData,
    params,
    setParams,
    start,
    stop,
    reset,
    eventLog,
    variants,
    day,
    hoveredCountry,
    gameResult,
    setGameResult,
    nukeFired
  } = props;

  const [activeModal, setActiveModal] = useState('none'); // 'none', 'disease', 'data'
  const hasStarted = isRunning || day > 0 || isStaging;

  const displayStats = useMemo(() => {
    const totals = { S: 0, E: 0, I: 0, R: 0, D: 0 };
    if (!countryStates) return totals;

    countryStates.forEach((state) => {
      totals.S += state.S;
      totals.E += state.E;
      totals.I += state.I;
      totals.R += state.R;
      totals.D += state.D;
    });
    return totals;
  }, [countryStates]);

  const formatNumber = (n) => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return Math.round(n).toLocaleString();
  };

  const N = (displayStats.S + displayStats.E + displayStats.I + displayStats.R + displayStats.D) || 1;
  const pS = (displayStats.S / N) * 100;
  const pE = (displayStats.E / N) * 100;
  const pI = (displayStats.I / N) * 100;
  const pR = (displayStats.R / N) * 100;
  const pD = (displayStats.D / N) * 100;

  const latestEvent = eventLog && eventLog.length > 0 
    ? eventLog[eventLog.length - 1].message 
    : 'Waiting for simulation to begin...';

  // Hover target intelligence using the real-world database
  const targetId = hoveredCountry || seedCountry;
  const targetCountry = targetId ? countriesData.find(c => c.id === targetId) : null;
  const targetIntel = targetId ? intelData[targetId] : null;

  return (
    <div className="plague-layout">
       {hasStarted && (
         <>
           {/* PLAGUE INC STYLE TOP BAR */}
           <div className="plague-top-bar">
              <div className="plague-news-ticker">
                 <span className="ticker-label">News</span>
                 <span className="ticker-text">{latestEvent}</span>
              </div>
              <div className="plague-date-block" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ display: 'flex', gap: '0.2rem' }}>
                   {isRunning ? (
                     <button onClick={stop} title="Pause" style={{background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '3px', cursor: 'pointer', padding: '2px 8px'}}>⏸</button>
                   ) : (
                     <button onClick={start} title="Play" style={{background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '3px', cursor: 'pointer', padding: '2px 8px'}}>▶</button>
                   )}
                   <button onClick={() => props.setSimSpeed(1)} title="Normal Speed" style={{background: props.simSpeed === 1 ? 'var(--cyan)' : 'rgba(255,255,255,0.1)', color: props.simSpeed === 1 ? 'black' : 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px 6px', fontWeight: 'bold'}}>1x</button>
                   <button onClick={() => props.setSimSpeed(3)} title="Fast" style={{background: props.simSpeed === 3 ? 'var(--cyan)' : 'rgba(255,255,255,0.1)', color: props.simSpeed === 3 ? 'black' : 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px 6px', fontWeight: 'bold'}}>3x</button>
                   <button onClick={() => props.setSimSpeed(10)} title="Very Fast" style={{background: props.simSpeed === 10 ? 'var(--cyan)' : 'rgba(255,255,255,0.1)', color: props.simSpeed === 10 ? 'black' : 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px 6px', fontWeight: 'bold'}}>10x</button>
                 </div>
                 <span>Day {day}</span>
              </div>
           </div>

           {/* GIANT RED BUTTON IF ON MAP BUT NOT YET STARTED */}
           {isStaging && !isRunning && day === 0 && (
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'auto' }}>
                <button 
                  onClick={() => {
                     start();
                  }}
                  style={{
                    background: 'rgba(255, 0, 50, 0.9)',
                    border: '2px solid #ff4d6d',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '2rem',
                    fontWeight: '900',
                    padding: '2rem 4rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 40px rgba(255,0,50,0.8)',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => { e.target.style.background = 'rgba(255, 0, 50, 1)'; e.target.style.transform = 'scale(1.05)'; }}
                  onMouseOut={(e) => { e.target.style.background = 'rgba(255, 0, 50, 0.9)'; e.target.style.transform = 'scale(1)'; }}
                >
                  Start Spread
                </button>
             </div>
           )}

           
             {/* VACCINE UI IN CORNER OF MAP */}
             {props.gameMode === 'AEGIS' && (
                 <div style={{ position: 'absolute', bottom: '80px', left: '20px', background: 'rgba(0,0,0,0.85)', border: '1px solid var(--cyan)', padding: '0.8rem', borderRadius: '8px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--cyan)', fontWeight: 'bold', letterSpacing: '1px' }}>VACCINE PROGRESS</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #333', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', background: `conic-gradient(var(--cyan) ${Math.min(100, Math.max(0, props.vaccineProgress || 0))}%, transparent 0)` }}></div>
                          <div style={{ position: 'absolute', width: '80%', height: '80%', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                             <span style={{ fontSize: '0.65rem', color: 'var(--cyan)', fontWeight: 'bold' }}>{Math.round(props.vaccineProgress || 0)}%</span>
                          </div>
                       </div>
                       <div style={{ fontSize: '0.7rem', color: '#ccc', maxWidth: '120px', lineHeight: '1.2' }}>
                          {(props.vaccineProgress || 0) >= 100 ? 'Vaccine Deployed Globally.' : 'Research underway to combat pathogen...'}
                       </div>
                    </div>
                 </div>
             )}

             {/* PLAGUE INC STYLE BOTTOM BAR */}
           <div className="plague-bottom-bar">
              <button 
                className={`plague-nav-btn disease-btn ${activeModal === 'disease' ? 'active' : ''}`}
                onClick={() => setActiveModal(activeModal === 'disease' ? 'none' : 'disease')}
              >
                 Disease
              </button>

              <div className="plague-status-center">
                 <div className="stack compact-stack">
                    
                    <div className="seg" style={{ width: `${pS}%`, background: 'var(--s)', opacity: 0.8 }}></div>
                      <div className="seg" style={{ width: `${pE}%`, background: 'var(--e)' }}></div>
                    <div className="seg" style={{ width: `${pI}%`, background: 'var(--i)' }}></div>
                    <div className="seg" style={{ width: `${pR}%`, background: '#00cc44' }}></div>
                    <div className="seg" style={{ width: `${pD}%`, background: 'var(--d)' }}></div>
                 </div>
                 <div className="compact-legend" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--s)', fontSize: '0.7rem' }}>
                      ● Healthy: {formatNumber(displayStats.S)}
                    </span>
                    <span style={{ color: 'var(--e)', fontSize: '0.7rem' }}>
                      ● Exposed: {formatNumber(displayStats.E)}
                    </span>
                    <span style={{ color: 'var(--i)', fontSize: '0.7rem' }}>
                      ● Infected: {formatNumber(displayStats.I)}
                    </span>
                    <span style={{ color: '#00cc44', fontSize: '0.7rem' }}>
                      ● Recovered: {formatNumber(displayStats.R)}
                    </span>
                    <span style={{ color: 'var(--d)', fontSize: '0.7rem' }}>
                      ● Dead: {formatNumber(displayStats.D)}
                    </span>
                 </div>
              </div>

              <button 
                className={`plague-nav-btn data-btn ${activeModal === 'data' ? 'active' : ''}`}
                onClick={() => setActiveModal(activeModal === 'data' ? 'none' : 'data')}
              >
                 World Data
              </button>
           </div>

           {/* MODALS */}
           {activeModal === 'disease' && (
              <div className="plague-modal modal-left fade-in">
                 <div className="modal-header">
                    <span className="section-title">Disease Parameters</span>
                    <button onClick={() => setActiveModal('none')}>&times;</button>
                 </div>
                 <ParameterSliders 
                    params={props.params} 
                    setParams={props.setParams} 
                    isRunning={props.isRunning} 
                    gameMode={props.gameMode}
                    setGameMode={props.setGameMode}
                    vaccineProgress={props.vaccineProgress}
                      nukeFired={props.nukeFired}
                 />
              </div>
           )}

           {activeModal === 'data' && (
              <div className="plague-modal modal-right fade-in">
                 <div className="modal-header">
                    <span className="section-title">Epidemic Curves</span>
                    <button onClick={() => setActiveModal('none')}>&times;</button>
                 </div>
                 <div className="hud-chart-wrapper" style={{ margin: '0 0 2rem 0' }}>
                    <LiveChart chartData={chartData} />
                 </div>
                 
                 <div className="section-title" style={{ marginBottom: '1rem' }}>Outbreak Log</div>
                 <EventLog eventLog={eventLog} />

                 {variants && variants.length > 0 && (
                   <div style={{ marginTop: '2rem' }}>
                     <div className="section-title" style={{ marginBottom: '1rem' }}>Detected Variants</div>
                     <div className="variant-list">
                       {variants.map((v) => (
                         <span key={v.id} className="hud-variant-tag">
                           <span className="hud-variant-dot"></span>
                           {v.name} (Day {v.emergenceDay})
                         </span>
                       ))}
                     </div>
                   </div>
                 )}

                 <div style={{ marginTop: '2rem', borderTop: '1px solid var(--rule)', paddingTop: '1.5rem' }}>
                    <Controls
                      isRunning={isRunning}
                      isStaging={isStaging}
                      start={start}
                      stop={stop}
                      reset={() => { reset(); setActiveModal('none'); }}
                      seedCountry={seedCountry}
                      setSeedCountry={setSeedCountry}
                      isHistorical={isHistorical}
                      setIsHistorical={setIsHistorical}
                      gameMode={props.gameMode}
                        setGameMode={props.setGameMode}
                        params={props.params}
                        setParams={props.setParams}
                      />
                 </div>
              </div>
           )}
         </>
       )}

       {/* PRE-SIMULATION MENU & AI INTELLIGENCE */}
       {!hasStarted && (
          <>
             {/* Left Column (Intel) */}
             <div style={{ position: 'absolute', top: '2rem', bottom: '2rem', left: '2rem', width: '380px', pointerEvents: 'none' }}>
                 {targetIntel && targetCountry && (
                   <div className="plague-start-menu fade-in" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 'auto', transform: 'none', maxHeight: '100%', overflowY: 'auto', pointerEvents: 'auto' }}>
                      <div className="section-title" style={{ color: 'var(--cyan)' }}>Target Intelligence</div>
                      <h2 style={{ color: '#fff', margin: '0.5rem 0 1rem 0' }}>{targetCountry.name}</h2>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--soft)', textTransform: 'uppercase' }}>Climate</div>
                           <div style={{ color: '#fff', fontWeight: 'bold' }}>{targetIntel.climate}</div>
                        </div>
                        <div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--soft)', textTransform: 'uppercase' }}>Density</div>
                           <div style={{ color: '#fff', fontWeight: 'bold' }}>{targetIntel.density}</div>
                        </div>
                        <div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--soft)', textTransform: 'uppercase' }}>Healthcare</div>
                           <div style={{ color: '#fff', fontWeight: 'bold' }}>{targetIntel.healthcare}</div>
                        </div>
                        <div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--soft)', textTransform: 'uppercase' }}>Population</div>
                           <div style={{ color: '#fff', fontWeight: 'bold' }}>{formatNumber(targetCountry.population)}</div>
                        </div>
                      </div>

                      <div className="section-title" style={{ color: 'var(--yellow)', fontSize: '0.8rem' }}>AI Recommendations</div>
                      <ul style={{ color: '#ddd', fontSize: '0.85rem', paddingLeft: '1.2rem', margin: '0.5rem 0 0 0' }}>
                         {targetIntel.recommendations.map((r, i) => (
                            <li key={i} style={{ marginBottom: '0.4rem' }}>{r}</li>
                         ))}
                      </ul>

                      {targetIntel.bestPathogen && (
                        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid var(--i)' }}>
                           <div style={{ color: 'var(--i)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ideal Pathogen: {targetIntel.bestPathogen.name}</div>
                           <div style={{ color: '#ccc', fontSize: '0.85rem', marginTop: '0.3rem', lineHeight: '1.4' }}>{targetIntel.bestPathogen.reason}</div>
                        </div>
                      )}
                      
                      {targetIntel.connectivity && (
                        <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid var(--cyan)' }}>
                           <div style={{ color: 'var(--cyan)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Global Transit: {targetIntel.connectivity}</div>
                           <div style={{ color: '#ccc', fontSize: '0.85rem', marginTop: '0.3rem', lineHeight: '1.4' }}>{targetIntel.transit}</div>
                        </div>
                      )}
                   </div>
                 )}
             </div>

             {/* Right Column (Controls) */}
             <div style={{ position: 'absolute', top: '2rem', bottom: '2rem', right: '2rem', width: '380px', pointerEvents: 'none' }}>
               <div className="plague-start-menu fade-in" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 'auto', transform: 'none', pointerEvents: 'auto' }}>
                     <Controls
                     isRunning={isRunning}
                     isStaging={isStaging}
                     prepare={prepare}
                     start={start}
                     stop={stop}
                     reset={reset}
                     seedCountry={seedCountry}
                     setSeedCountry={setSeedCountry}
                     isHistorical={isHistorical}
                     setIsHistorical={setIsHistorical}
                    gameMode={props.gameMode}
                        setGameMode={props.setGameMode}
                        params={props.params}
                        setParams={props.setParams}
                      />
               </div>
             </div>
          </>
       )}
    
              {gameResult && (
                  <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      backdropFilter: 'blur(10px)', pointerEvents: 'auto'
                  }}>
                      <div style={{
                          padding: '3rem', borderRadius: '12px', textAlign: 'center',
                          border: gameResult === 'WIN' ? `2px solid ${props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)'}` : '2px solid #555',
                          background: 'rgba(20,20,20,0.95)',
                          boxShadow: gameResult === 'WIN' ? `0 0 50px ${props.gameMode === 'DOOMSDAY' ? 'rgba(255, 50, 50, 0.4)' : 'rgba(0, 255, 200, 0.4)'}` : 'none',
                          maxWidth: '600px'
                      }}>
                          <h1 style={{
                              fontSize: '2.5rem', marginBottom: '1rem',
                              color: gameResult === 'WIN' ? (props.nukeFired ? '#ffaa00' : (props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)')) : '#888',
                              textShadow: gameResult === 'WIN' ? `0 0 20px ${props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)'}` : 'none',
                              textTransform: 'uppercase', letterSpacing: '2px'
                          }}>
                              {gameResult === 'WIN' ? (props.nukeFired ? 'PYRRHIC VICTORY' : 'MISSION ACCOMPLISHED') : (gameResult === 'LOSS_TIMING' ? 'PREDICTION DRIFT DETECTED' : 'MISSION FAILED')}
                          </h1>
                          <p style={{ color: '#ccc', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                              {gameResult === 'LOSS_TIMING' ? 
                                 (props.gameMode === 'DOOMSDAY' ? "Global infection was achieved, but the AI failed its timeframe prediction (missed by >100 days). Precision is required for a true victory." : "The pathogen was eradicated, but the AI failed its timeframe prediction (missed by >100 days). Precision is required for a true victory.")
                              : (props.gameMode === 'DOOMSDAY' ? (
                                  gameResult === 'WIN' ? "The entire global population has been infected on the predicted day. Project Doomsday is a complete success." : "The pathogen died out before every susceptible person was infected. Humanity survives."
                              ) : (
                                  gameResult === 'WIN' ? (props.nukeFired ? "The pathogen was eradicated, but millions of infected civilians were sacrificed in a nuclear sanitization protocol to achieve containment." : "The pathogen has been completely eradicated within the predicted timeframe. Project Aegis has successfully defended humanity.") : "Global defenses were overwhelmed and the pathogen breached containment."
                              ))}
                          </p>
                          <button 
                              className={`hud-btn glow ${props.gameMode === 'DOOMSDAY' ? '' : 'primary'}`} 
                              style={{ padding: '0.8rem 2rem', fontSize: '1rem', borderColor: props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)', color: props.gameMode === 'DOOMSDAY' ? 'var(--red)' : 'var(--cyan)' }}
                              onClick={() => { reset(); setGameResult(null); }}
                          >
                              INITIALIZE NEW SIMULATION
                          </button>
                      </div>
                  </div>
              )}
</div>
  );
}
