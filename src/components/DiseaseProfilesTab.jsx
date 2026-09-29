import React, { useState } from 'react';
import historicalDiseases from '../data/historical_diseases.js';

export default function DiseaseProfilesTab({ onSimulate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(historicalDiseases[0]);

  const filteredProfiles = historicalDiseases.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatNumber = (n) => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100%', 
      width: '100%', 
      background: '#0B0D12', /* Solid dark professional background */
      color: '#E5E7EB', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      pointerEvents: 'auto' /* Crucial: blocks clicks from passing through to the 3D globe */
    }}>
      
      {/* LEFT SIDEBAR: Search and List */}
      <div style={{ 
        width: '320px', 
        borderRight: '1px solid #1F2937', 
        display: 'flex', 
        flexDirection: 'column', 
        background: '#111827' 
      }}>
        
        {/* Search Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1F2937' }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#F9FAFB', fontSize: '1.25rem', fontWeight: '600' }}>
            Pathogen Database
          </h2>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="text"
              placeholder="Search diseases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.6rem 0.6rem 0.6rem 2.2rem', 
                background: '#1F2937', 
                border: '1px solid transparent', 
                borderRadius: '6px', 
                color: '#F9FAFB', 
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #3B82F6';
                e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid transparent';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
        
        {/* List of Diseases */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {filteredProfiles.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280', fontSize: '0.9rem' }}>No pathogens found.</div>
          )}
          {filteredProfiles.map(d => {
            const isSelected = selectedDisease?.name === d.name;
            return (
              <div 
                key={d.name}
                onClick={() => setSelectedDisease(d)}
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  background: isSelected ? '#1F2937' : 'transparent',
                  borderLeft: `3px solid ${isSelected ? '#3B82F6' : 'transparent'}`,
                  transition: 'background 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
                onMouseOver={(e) => { if(!isSelected) e.currentTarget.style.background = '#1F2937'; }}
                onMouseOut={(e) => { if(!isSelected) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ color: isSelected ? '#F9FAFB' : '#D1D5DB', fontWeight: isSelected ? '600' : '400', fontSize: '0.95rem' }}>
                  {d.name}
                </div>
                <div style={{ display: 'flex', gap: '8px', color: '#6B7280', fontSize: '0.75rem' }}>
                  <span>{d.type}</span>
                  <span>•</span>
                  <span>{d.year.replace('-', '')} {d.year.startsWith('-') ? 'BCE' : 'CE'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: Details & Chart */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '3rem 4rem', background: '#0B0D12' }}>
        {selectedDisease ? (
          <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1F2937', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#F9FAFB', fontWeight: '700', letterSpacing: '-0.025em' }}>
                  {selectedDisease.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9CA3AF', fontSize: '1rem' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '2px 8px', 
                    background: '#1F2937', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    color: '#D1D5DB'
                  }}>
                    {selectedDisease.type.toUpperCase()}
                  </span>
                  <span>{selectedDisease.origin}</span>
                  <span>•</span>
                  <span>{selectedDisease.year.replace('-', '')} {selectedDisease.year.startsWith('-') ? 'BCE' : 'CE'}</span>
                </div>
              </div>
              <button 
                onClick={() => onSimulate({ 
                  r0: selectedDisease.r0, 
                  incubationPeriod: selectedDisease.inc, 
                  infectiousPeriod: selectedDisease.inf, 
                  caseFatalityRate: selectedDisease.cfr / 100, 
                  mutationRate: 0.05 
                })}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, transform 0.1s ease',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Load into Simulator
              </button>
            </div>

            {/* INFO GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
              
              {/* Origin Panel */}
              <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.05em', fontWeight: '600' }}>Epidemiological Origin</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '2px' }}>Ground Zero</div>
                  <div style={{ fontSize: '1.1rem', color: '#F9FAFB', fontWeight: '500' }}>{selectedDisease.origin}</div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '2px' }}>Timeline</div>
                  <div style={{ fontSize: '1.1rem', color: '#F9FAFB', fontWeight: '500' }}>{selectedDisease.year.replace('-', '')} {selectedDisease.year.startsWith('-') ? 'BCE' : 'CE'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '2px' }}>Transmission Vector</div>
                  <div style={{ fontSize: '1.1rem', color: '#F9FAFB', fontWeight: '500' }}>{selectedDisease.source}</div>
                </div>
              </div>

              {/* Casualties Panel */}
              <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.05em', fontWeight: '600' }}>Historical Impact</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '2px' }}>Estimated Total Cases</div>
                  <div style={{ fontSize: '1.25rem', color: '#60A5FA', fontWeight: '600' }}>{formatNumber(selectedDisease.infected)}</div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '2px' }}>Estimated Total Deaths</div>
                  <div style={{ fontSize: '1.25rem', color: '#F87171', fontWeight: '600' }}>{formatNumber(selectedDisease.deaths)}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '2px' }}>Case Fatality Rate (CFR)</div>
                  <div style={{ fontSize: '1.1rem', color: '#F9FAFB', fontWeight: '500' }}>{selectedDisease.cfr}%</div>
                </div>
              </div>

              {/* Metrics Panel */}
              <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.05em', fontWeight: '600' }}>Clinical Profile</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '2px' }}>Basic Reproduction Number (R0)</div>
                  <div style={{ fontSize: '1.25rem', color: '#F9FAFB', fontWeight: '600' }}>{selectedDisease.r0}</div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '2px' }}>Incubation Period</div>
                  <div style={{ fontSize: '1.1rem', color: '#F9FAFB', fontWeight: '500' }}>{selectedDisease.inc} Days</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '2px' }}>Infectious Period</div>
                  <div style={{ fontSize: '1.1rem', color: '#F9FAFB', fontWeight: '500' }}>{selectedDisease.inf} Days</div>
                </div>
              </div>

            </div>

            {/* HISTORICAL CHART */}
            <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#F9FAFB', fontWeight: '600' }}>Disease Progression Model</h3>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#9CA3AF' }}>
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#3B82F6', borderRadius: '2px' }}></span> 
                    Active Cases
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#9CA3AF' }}>
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#EF4444', borderRadius: '2px' }}></span> 
                    Cumulative Deaths
                  </div>
                </div>
              </div>
              
              <div style={{ width: '100%', height: '280px', position: 'relative' }}>
                <HistoricalSvgChart data={selectedDisease.chartData} />
              </div>
            </div>

          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6B7280', fontSize: '1rem' }}>
            Select a pathogen to view its profile.
          </div>
        )}
      </div>
    </div>
  );
}

// Custom clean SVG chart for historical data
function HistoricalSvgChart({ data }) {
  if (!data || data.length === 0) return null;

  const maxCases = Math.max(...data.map(d => d.cases)) || 1;
  const maxDeaths = Math.max(...data.map(d => d.deaths)) || 1;
  const maxVal = Math.max(maxCases, maxDeaths) * 1.1; // 10% padding top

  const width = 1000;
  const height = 280;
  
  const getX = (index) => (index / (data.length - 1)) * width;
  const getY = (val) => height - (val / maxVal) * height;

  const casePoints = data.map((d, i) => `${getX(i)},${getY(d.cases)}`).join(' ');
  const casePath = `M ${getX(0)},${height} L ${casePoints} L ${getX(data.length - 1)},${height} Z`;

  const deathPoints = data.map((d, i) => `${getX(i)},${getY(d.deaths)}`).join(' ');
  const deathPath = `M ${getX(0)},${height} L ${deathPoints} L ${getX(data.length - 1)},${height} Z`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      {/* Grid lines */}
      <line x1="0" y1={height} x2={width} y2={height} stroke="#374151" strokeWidth="1" />
      <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#1F2937" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#1F2937" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#1F2937" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="0" y1="0" x2={width} y2="0" stroke="#1F2937" strokeWidth="1" strokeDasharray="4 4" />

      {/* Case Curve (Blue) */}
      <path d={casePath} fill="#3B82F6" opacity="0.1" />
      <polyline points={casePoints} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />

      {/* Death Curve (Red) */}
      <path d={deathPath} fill="#EF4444" opacity="0.1" />
      <polyline points={deathPoints} fill="none" stroke="#EF4444" strokeWidth="2" strokeLinejoin="round" />

      {/* Basic Y-Axis Markers */}
      <text x="-10" y="10" fill="#6B7280" fontSize="12" fontFamily="sans-serif" textAnchor="end">100%</text>
      <text x="-10" y={height * 0.5 + 4} fill="#6B7280" fontSize="12" fontFamily="sans-serif" textAnchor="end">50%</text>
      <text x="-10" y={height} fill="#6B7280" fontSize="12" fontFamily="sans-serif" textAnchor="end">0</text>
    </svg>
  );
}
