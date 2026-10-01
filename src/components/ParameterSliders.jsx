import React, { useState, useEffect, useMemo } from 'react';
import aiModel from '../data/ai_model.json';

function predictPandemic(r0, incubation, infectious, cfr) {
    if (!aiModel || !aiModel.weights) return null;
    
    // 1. Scale input
    const input = [r0, incubation, infectious, cfr];
    const scaledInput = input.map((val, i) => (val - aiModel.scaler_X_mean[i]) / aiModel.scaler_X_scale[i]);
    
    // 2. Forward pass (Layer 1 - ReLU)
    let layer1 = [];
    for (let j = 0; j < aiModel.weights[0][0].length; j++) {
        let sum = aiModel.biases[0][j];
        for (let i = 0; i < scaledInput.length; i++) {
            sum += scaledInput[i] * aiModel.weights[0][i][j];
        }
        layer1.push(Math.max(0, sum));
    }
    
    // 3. Forward pass (Output Layer - Linear)
    let output = [];
    for (let j = 0; j < aiModel.weights[1][0].length; j++) {
        let sum = aiModel.biases[1][j];
        for (let i = 0; i < layer1.length; i++) {
            sum += layer1[i] * aiModel.weights[1][i][j];
        }
        output.push(sum);
    }
    
    // 4. Inverse scale output
    const predictions = output.map((val, i) => (val * aiModel.scaler_y_scale[i]) + aiModel.scaler_y_mean[i]);
    
    return {
        peakDay: Math.max(0, Math.round(predictions[0])),
        peakInfections: Math.max(0, Math.round(predictions[1])),
        totalDeaths: Math.max(0, Math.round(predictions[2]))
    };
}

function formatBig(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.round(n).toLocaleString();
}

const SliderParam = ({ label, paramKey, min, max, step, format, trackClass, canChangeWhileRunning, params, setParams, isRunning }) => {
  const disabled = isRunning && !canChangeWhileRunning;
  const formatter = format || ((v) => v);
  
  const [localVal, setLocalVal] = useState(params[paramKey] || 0);

  useEffect(() => {
    setLocalVal(params[paramKey] || 0);
  }, [params[paramKey]]);

  const handleInput = (e) => {
    setLocalVal(Number(e.target.value));
  };

  const handleMouseUp = () => {
    if (setParams && localVal !== params[paramKey]) {
      setParams({ [paramKey]: localVal });
    }
  };

  return (
    <div className="param">
      <div className="paramtop">
        <span>{label}</span>
        <b>{formatter(localVal)}</b>
      </div>
      <input
        type="range"
        className={`slider-new ${trackClass}`}
        min={min}
        max={max}
        step={step}
        value={localVal}
        disabled={disabled}
        onChange={handleInput}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      />
    </div>
  );
};

export default function ParameterSliders({ params, setParams, isRunning, gameMode, setGameMode, vaccineProgress, nukeFired }) {
  if (!params) return null;

  return (
    <div className="panel-primary" style={{ padding: '0', border: 'none', boxShadow: 'none', marginBottom: '0' }}>

      {gameMode === 'AEGIS' && (
          <div style={{ background: 'rgba(0, 255, 200, 0.05)', border: '1px solid var(--cyan)', borderRadius: '6px', padding: '1rem', marginBottom: '1.5rem' }}>
             <div style={{ color: 'var(--cyan)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                🛡️ AEGIS (AI Cure System)
             </div>
             <div style={{ fontSize: '0.75rem', color: '#ccc', marginBottom: '0.8rem', lineHeight: '1.4' }}>
                You design the pathogen. The AI will constantly analyze the threat level and automatically manage global defenses to save humanity.
             </div>
             
             
             {vaccineProgress > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                   <div style={{ fontSize: '0.7rem', color: 'var(--cyan)' }}>Vaccine Research Progress</div>
                   <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, vaccineProgress)}%`, height: '100%', background: 'var(--cyan)' }}></div>
                   </div>
                </div>
             )}

             <div style={{ marginBottom: '1.5rem', background: nukeFired ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 0, 0.05)', border: nukeFired ? '2px solid var(--red)' : '1px solid var(--red)', borderRadius: '6px', padding: '1rem', textAlign: 'center', transition: 'all 0.5s ease' }}>
                <div style={{ color: 'var(--red)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem' }}>NUCLEAR SANITIZATION PROTOCOL</div>
                <div style={{ fontSize: '0.7rem', color: '#ccc', marginBottom: '1rem' }}>AI Authorization Only. Evaluates global despair thresholds. Eradicates pathogen by neutralizing all infected civilians.</div>
                <button className={`hud-btn ${nukeFired ? '' : 'glow'}`} style={{ borderColor: 'var(--red)', width: '100%', opacity: nukeFired ? 1 : 0.5, cursor: 'not-allowed', background: nukeFired ? 'var(--red)' : 'transparent', color: nukeFired ? '#000' : 'var(--red)', fontWeight: 'bold' }} disabled>
                    {nukeFired ? "⚠️ PROTOCOL EXECUTED" : "AWAITING AI AUTHORIZATION"}
                </button>
             </div>
             <button 
                 className="hud-btn primary glow" 
                 style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                 onClick={async () => {
                     const optModule = await import('../data/aegis_model.json');
                     const opt = optModule.default;
                     if(!opt) return;
                     const inp = [params.r0, params.incubationPeriod, params.caseFatalityRate, params.airImmunity, params.waterImmunity];
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
                     
                     
                     const severity = Math.max(0, Math.min(1, 
                         ((params.r0 - 1) / 12) * 0.55 + 
                         params.caseFatalityRate * 0.20 + 
                         params.airImmunity * 0.125 + 
                         params.waterImmunity * 0.125
                     ));

                     const minIntervention = 0.72 + severity * 0.26;
                     const minBorder = 0.70 + severity * 0.28;
                     const minHygiene = 0.68 + severity * 0.28;
                     const minQuarantine = 0.74 + severity * 0.24;
                     const minVaccine = 0.75 + severity * 0.24;
                     
                     setParams({ 
                         ...params,
                         interventionStringency: parseFloat(Math.max(minIntervention, Math.min(1, res[0])).toFixed(2)),
                         borderStrictness: parseFloat(Math.max(minBorder, Math.min(1, res[1])).toFixed(2)),
                         hygieneCompliance: parseFloat(Math.max(minHygiene, Math.min(1, res[2])).toFixed(2)),
                         quarantineEfficiency: parseFloat(Math.max(minQuarantine, Math.min(1, res[3])).toFixed(2)),
                         vaccineFunding: parseFloat(Math.max(minVaccine, Math.min(1, res[4])).toFixed(2))
                     });

                     alert("AEGIS System updated global defenses based on current threat.");
                 }}
             >
                RUN AI DEFENSE PROTOCOL
             </button>
          </div>
      )}

      <div style={{ color: 'var(--soft)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Biological Traits</div>
      <SliderParam label="R0 — reproduction number" paramKey="r0" min={0.1} max={20} step={0.1} trackClass="sev" params={params} setParams={setParams} isRunning={isRunning} />
      <SliderParam label="Case fatality rate" paramKey="caseFatalityRate" min={0} max={1} step={0.001} format={(v) => `${(v * 100).toFixed(1)}%`} trackClass="sev" params={params} setParams={setParams} isRunning={isRunning} />
      <SliderParam label="Incubation period" paramKey="incubationPeriod" min={1} max={30} step={0.1} format={(v) => `${v} days`} trackClass="time" params={params} setParams={setParams} isRunning={isRunning} />
      <SliderParam label="Infectious period" paramKey="infectiousPeriod" min={1} max={30} step={0.1} format={(v) => `${v} days`} trackClass="time" params={params} setParams={setParams} isRunning={isRunning} />
      <SliderParam label="Air Transmission" paramKey="airImmunity" min={0} max={1} step={0.01} trackClass="time" params={params} setParams={setParams} isRunning={isRunning} />
      <SliderParam label="Water Transmission" paramKey="waterImmunity" min={0} max={1} step={0.01} trackClass="time" params={params} setParams={setParams} isRunning={isRunning} />
      
      <div style={{ color: 'var(--soft)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem', textTransform: 'uppercase' }}>Government Defenses</div>
      <SliderParam label="Lockdown Stringency" paramKey="interventionStringency" min={0} max={1} step={0.01} trackClass="time" canChangeWhileRunning={true} params={params} setParams={setParams} isRunning={isRunning && gameMode === 'DOOMSDAY'} />
      <SliderParam label="Border Closures" paramKey="borderStrictness" min={0} max={1} step={0.01} trackClass="time" canChangeWhileRunning={true} params={params} setParams={setParams} isRunning={isRunning && gameMode === 'DOOMSDAY'} />
      <SliderParam label="Public Hygiene & Masks" paramKey="hygieneCompliance" min={0} max={1} step={0.01} trackClass="time" canChangeWhileRunning={true} params={params} setParams={setParams} isRunning={isRunning && gameMode === 'DOOMSDAY'} />
      <SliderParam label="Quarantine Efficiency" paramKey="quarantineEfficiency" min={0} max={1} step={0.01} trackClass="time" canChangeWhileRunning={true} params={params} setParams={setParams} isRunning={isRunning && gameMode === 'DOOMSDAY'} />
      <SliderParam label="Vaccine Research Funding" paramKey="vaccineFunding" min={0} max={1} step={0.01} trackClass="time" canChangeWhileRunning={true} params={params} setParams={setParams} isRunning={isRunning && gameMode === 'DOOMSDAY'} />
    </div>
  );
}
