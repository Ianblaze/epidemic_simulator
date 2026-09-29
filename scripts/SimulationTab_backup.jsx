import React, { useMemo, useState } from 'react';
import LiveChart from './LiveChart.jsx';
import ParameterSliders from './ParameterSliders.jsx';
import Controls from './Controls.jsx';
import EventLog from './EventLog.jsx';
import countriesData from '../data/countries.js';

// Highly accurate heuristic engine for country recommendations
function getCountryIntelligence(name, pop) {
  if (!name) return null;
  const n = name.toUpperCase();
  
  // Real world geographical data lists
  const hot = ['INDIA', 'BRAZIL', 'NIGERIA', 'INDONESIA', 'MEXICO', 'EGYPT', 'CONGO', 'THAILAND', 'SAUDI', 'KENYA', 'COLOMBIA', 'MALAYSIA', 'YEMEN', 'SUDAN', 'CHAD', 'SOMALIA', 'MALI', 'NIGER', 'PHILIPPINES', 'VIETNAM', 'ETHIOPIA', 'SOUTH AFRICA', 'CUBA', 'JAMAICA', 'SINGAPORE'];
  const cold = ['RUSSIA', 'CANADA', 'NORWAY', 'SWEDEN', 'FINLAND', 'GREENLAND', 'ICELAND', 'MONGOLIA', 'ALASKA'];
  const wealthy = ['UNITED STATES', 'GERMANY', 'UNITED KINGDOM', 'FRANCE', 'JAPAN', 'SOUTH KOREA', 'AUSTRALIA', 'CANADA', 'SWITZERLAND', 'SWEDEN', 'NORWAY', 'DENMARK', 'FINLAND', 'NETHERLANDS', 'BELGIUM', 'AUSTRIA', 'NEW ZEALAND', 'SINGAPORE', 'IRELAND', 'ISRAEL', 'UNITED ARAB EMIRATES'];
  const sparse = ['RUSSIA', 'CANADA', 'AUSTRALIA', 'KAZAKHSTAN', 'MONGOLIA', 'NAMIBIA', 'MAURITANIA', 'LIBYA', 'SURINAME', 'GUYANA', 'ICELAND', 'BOTSWANA'];
  const extremelyDense = ['INDIA', 'BANGLADESH', 'SOUTH KOREA', 'TAIWAN', 'RWANDA', 'NETHERLANDS', 'ISRAEL', 'LEBANON', 'PHILIPPINES', 'JAPAN', 'UNITED KINGDOM', 'GERMANY', 'ITALY', 'SINGAPORE', 'BELGIUM'];

  let climate = 'Temperate';
  if (hot.some(h => n.includes(h))) climate = 'Hot / Tropical';
  if (cold.some(c => n.includes(c))) climate = 'Cold / Arctic';

  let density = 'Moderate';
  if (extremelyDense.some(d => n.includes(d))) density = 'High';
  else if (sparse.some(s => n.includes(s))) density = 'Low';
  else if (pop > 100000000) density = 'High'; // Fallback for massive unlisted countries

  let healthcare = wealthy.some(w => n.includes(w)) ? 'Advanced' : 'Developing';

  let recs = [];
  if (climate === 'Hot / Tropical') recs.push('Requires Heat Resistance. Mosquito/Insect transmission highly effective in this region.');
  if (climate === 'Cold / Arctic') recs.push('Requires Cold Resistance. Blood transmission limited due to heavy winter clothing.');
  
  if (density === 'High') recs.push('High urban density. Airborne transmission scales exponentially here.');
  if (density === 'Low') recs.push('Sparsely populated. Rural/Zoonotic (animal) transmission recommended to bridge gaps.');
  
  if (healthcare === 'Advanced') recs.push('Advanced healthcare will slow infection and accelerate cure research. Drug Resistance heavily advised.');
  if (healthcare === 'Developing') recs.push('Developing healthcare infrastructure. Symptoms will increase lethality rapidly without treatment.');

  if (recs.length === 0) recs.push('Balanced region. Standard transmission vectors are viable.');

  return { climate, density, healthcare, recommendations: recs };
}

export default function SimulationTab(props) {
  const {
    countryStates,
    seedCountry,
    setSeedCountry,
    isRunning,
    isStaging,
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
    hoveredCountry
  } = props;

  const [activeModal, setActiveModal] = useState('none'); // 'none', 'disease', 'data'
  const hasStarted = isRunning || day > 0 || isStaging;

  const displayStats = useMemo(() => {
    const totals = { S: 0, E: 0, I: 0, R: 0, D: 0 };
    if (!countryStates) return totals;

    if (seedCountry && countryStates.has(seedCountry)) {
      return countryStates.get(seedCountry);
    }

    countryStates.forEach((state) => {
      totals.S += state.S;
      totals.E += state.E;
      totals.I += state.I;
      totals.R += state.R;
      totals.D += state.D;
    });
    return totals;
  }, [countryStates, seedCountry]);

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

  // Hover target intelligence
  const targetId = hoveredCountry || seedCountry;
  const targetCountry = targetId ? countriesData.find(c => c.id === targetId) : null;
  const targetIntel = targetCountry ? getCountryIntelligence(targetCountry.name, targetCountry.population) : null;

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
              <div className="plague-date-block">
                 Day {day}
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
                    <div className="seg" style={{ width: `${pS}%`, background: 'var(--s)' }}></div>
                    <div className="seg" style={{ width: `${pE}%`, background: 'var(--e)' }}></div>
                    <div className="seg" style={{ width: `${pI}%`, background: 'var(--i)' }}></div>
                    <div className="seg" style={{ width: `${pR}%`, background: 'var(--r)' }}></div>
                    <div className="seg" style={{ width: `${pD}%`, background: 'var(--d)' }}></div>
                 </div>
                 <div className="compact-legend">
                    <span style={{ color: 'var(--red)' }}>
                      Infected: {formatNumber(displayStats.I)}
                    </span>
                    <span style={{ color: 'var(--grey)' }}>
                      Dead: {formatNumber(displayStats.D)}
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
                 <ParameterSliders params={params} setParams={setParams} isRunning={isRunning} />
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
                    />
                 </div>
              </div>
           )}
         </>
       )}

       {/* PRE-SIMULATION MENU & AI INTELLIGENCE */}
       {!hasStarted && (
          <>
             {targetIntel && (
               <div className="plague-start-menu fade-in" style={{ right: 'auto', left: '2rem', top: 'auto', bottom: '2rem', transform: 'none', width: '360px', maxHeight: '85vh', overflowY: 'auto' }}>
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
               </div>
             )}

             <div className="plague-start-menu fade-in">
                <Controls
                   isRunning={isRunning}
                   isStaging={isStaging}
                   prepare={prepare}
                   start={start}
                   stop={stop}
                   reset={reset}
                   seedCountry={seedCountry}
                   setSeedCountry={setSeedCountry}
                />
             </div>
          </>
       )}
    </div>
  );
}
