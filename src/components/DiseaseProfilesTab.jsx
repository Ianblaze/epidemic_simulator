import React, { useMemo, useState } from 'react';
import historicalDiseases from '../data/historical_diseases.js';

const C = {
  bg: '#080D16', panel: 'rgba(16, 25, 39, .88)', panel2: '#111C2C', line: 'rgba(148, 163, 184, .14)',
  text: '#EDF4FC', muted: '#90A0B5', faint: '#617188', cyan: '#54E2D0', blue: '#5B9BFF',
  red: '#FF7584', gold: '#F5C46A', green: '#6BE0AA', purple: '#B79AFF'
};

const historicalFrame = (disease) => {
  if (disease.historicalDataNote) return disease.historicalDataNote;
  const year = Number(disease.year);
  const longRunning = /HIV|AIDS|tuberculosis|malaria|hepatitis|chagas|leprosy|schistosomiasis|sleeping sickness|leishmaniasis/i.test(disease.name);
  if (longRunning) return 'Long-running disease burden. The total may span many decades and is not a single outbreak.';
  if (year < 1900) return 'Retrospective estimate from incomplete historical records; boundaries and totals are uncertain.';
  if (disease.infected > 10000000) return 'Cumulative estimate across multiple outbreaks or waves; totals vary by source and case definition.';
  return 'Reported outbreak totals are incomplete; undetected cases may make the true burden higher.';
};

const chartSeries = (disease) => {
  const total = Math.max(1, Number(disease.infected) || 1);
  const deaths = Math.min(total, Math.max(0, Number(disease.deaths) || 0));
  const points = 25;
  const weights = Array.from({ length: points }, (_, i) => {
    const x = (i - (points - 1) / 2) / (points / 6.2);
    return Math.exp(-0.5 * x * x) * (1 + 0.12 * Math.sin(i * 1.7 + (Number(disease.r0) || 1)));
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  return weights.map((weight, i) => {
    const newCases = total * weight / sum;
    cumulative = Math.min(total, cumulative + newCases);
    const progress = i / (points - 1);
    const deathProgress = Math.max(0, Math.min(1, (progress - 0.04) / 0.96));
    const cumulativeDeaths = deaths * deathProgress * deathProgress;
    const active = Math.min(cumulative - cumulativeDeaths, newCases * Math.max(1, (disease.inf || 7) / 7) * 1.5);
    const recovered = Math.max(0, cumulative - cumulativeDeaths - active);
    return { time: i, newCases, cumulative, cumulativeDeaths, active, recovered, deaths: cumulativeDeaths };
  });
};

const formatNumber = (n) => {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
};

const yearLabel = (year) => `${String(year).replace('-', '')} ${String(year).startsWith('-') ? 'BCE' : 'CE'}`;
const cardStyle = { background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, boxShadow: '0 18px 55px rgba(0,0,0,.18)' };
const eyebrowStyle = { color: C.cyan, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 800 };

export default function DiseaseProfilesTab({ onSimulate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(historicalDiseases[0]);
  const [chartScale, setChartScale] = useState('linear');
  const [view, setView] = useState('overview');
  const [sortBy, setSortBy] = useState('chronology');

  const filteredProfiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return historicalDiseases
      .filter(d => `${d.name} ${d.type} ${d.origin} ${d.source}`.toLowerCase().includes(query))
      .sort((a, b) => sortBy === 'burden' ? (b.infected || 0) - (a.infected || 0) : Number(a.year) - Number(b.year));
  }, [searchQuery, sortBy]);
  const series = useMemo(() => selectedDisease ? chartSeries(selectedDisease) : [], [selectedDisease]);

  const tabs = [
    ['overview', 'Overview'], ['curves', 'Epidemic curves'], ['composition', 'Case composition'], ['spread', 'Spread & map']
  ];

  return (
    <div style={{ height: '100%', width: '100%', minHeight: 0, display: 'flex', color: C.text, background: C.bg, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', pointerEvents: 'auto', overflow: 'hidden' }}>
      <aside style={{ width: 310, minWidth: 270, display: 'flex', flexDirection: 'column', background: '#0B121E', borderRight: `1px solid ${C.line}` }}>
        <div style={{ padding: '25px 20px 18px', borderBottom: `1px solid ${C.line}` }}>
          <div style={{ ...eyebrowStyle, marginBottom: 10 }}>VECTOR / FIELD ARCHIVE</div>
          <h2 style={{ margin: 0, fontSize: 21, letterSpacing: '-.04em' }}>Disease profiles</h2>
          <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.55, margin: '8px 0 16px' }}>Explore historical outbreaks, transmission patterns and modeled epidemic curves.</p>
          <input aria-label="Search disease profiles" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search disease, origin, vector…" style={{ width: '100%', boxSizing: 'border-box', padding: '11px 12px', color: C.text, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 10, outline: 'none', fontSize: 12 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 13, color: C.muted, fontSize: 11 }}>
            <span>{filteredProfiles.length} of {historicalDiseases.length} records</span>
            <select aria-label="Sort disease profiles" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ color: C.muted, background: 'transparent', border: 0, fontSize: 11, cursor: 'pointer' }}>
              <option value="chronology">Chronology</option><option value="burden">Burden</option>
            </select>
          </div>
        </div>
        <div style={{ overflowY: 'auto', padding: 10, flex: 1 }}>
          {filteredProfiles.map((d, index) => {
            const active = selectedDisease?.name === d.name;
            return <button key={d.name} onClick={() => { setSelectedDisease(d); setView('overview'); }} style={{ width: '100%', display: 'grid', gridTemplateColumns: '28px 1fr auto', textAlign: 'left', alignItems: 'center', gap: 9, padding: '11px 10px', marginBottom: 3, color: active ? C.text : '#C2CDDB', background: active ? 'linear-gradient(100deg, rgba(84,226,208,.13), rgba(91,155,255,.08))' : 'transparent', border: `1px solid ${active ? 'rgba(84,226,208,.2)' : 'transparent'}`, borderRadius: 10, cursor: 'pointer' }}>
              <span style={{ width: 26, height: 26, display: 'grid', placeItems: 'center', color: active ? C.cyan : C.faint, background: active ? 'rgba(84,226,208,.1)' : 'rgba(255,255,255,.035)', borderRadius: 8, fontSize: 10, fontWeight: 800 }}>{String(index + 1).padStart(2, '0')}</span>
              <span style={{ minWidth: 0 }}><span style={{ display: 'block', fontSize: 12, fontWeight: active ? 700 : 550, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span><span style={{ display: 'block', marginTop: 4, color: C.faint, fontSize: 10 }}>{d.type} · {yearLabel(d.year)}</span></span>
              <span style={{ color: C.muted, fontSize: 10 }}>{formatNumber(d.infected)}</span>
            </button>;
          })}
          {!filteredProfiles.length && <div style={{ color: C.muted, padding: 20, fontSize: 12 }}>No matching disease profiles.</div>}
        </div>
        <div style={{ borderTop: `1px solid ${C.line}`, padding: '12px 16px', color: C.faint, fontSize: 10, lineHeight: 1.5 }}>Historical totals are estimates. Modeled charts are illustrative, not surveillance data.</div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0, padding: 'clamp(20px, 4vw, 52px)' }}>
        {selectedDisease ? <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap', marginBottom: 22 }}>
            <div style={{ minWidth: 240 }}>
              <div style={{ ...eyebrowStyle, marginBottom: 12 }}>{selectedDisease.type} / HISTORICAL RECORD</div>
              <h1 style={{ fontSize: 'clamp(30px, 4vw, 48px)', letterSpacing: '-.055em', lineHeight: 1.05, margin: '0 0 12px' }}>{selectedDisease.name}</h1>
              <div style={{ color: C.muted, fontSize: 13 }}>{selectedDisease.origin} <span style={{ color: C.faint, padding: '0 8px' }}>·</span> {yearLabel(selectedDisease.year)}</div>
            </div>
            <button onClick={() => onSimulate?.({ r0: selectedDisease.r0, incubationPeriod: selectedDisease.inc, infectiousPeriod: selectedDisease.inf, caseFatalityRate: selectedDisease.cfr / 100, mutationRate: 0.05 })} style={{ padding: '12px 16px', color: '#07131A', background: `linear-gradient(110deg, ${C.cyan}, #8CF1D4)`, border: 0, borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 800, boxShadow: '0 8px 28px rgba(84,226,208,.18)' }}>Load profile into simulator <span aria-hidden="true">↗</span></button>
          </div>

          <div style={{ display: 'flex', gap: 5, borderBottom: `1px solid ${C.line}`, marginBottom: 20, overflowX: 'auto' }}>
            {tabs.map(([id, label]) => <button key={id} onClick={() => setView(id)} style={{ padding: '11px 13px', whiteSpace: 'nowrap', color: view === id ? C.cyan : C.muted, background: 'transparent', border: 0, borderBottom: `2px solid ${view === id ? C.cyan : 'transparent'}`, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>{label}</button>)}
          </div>

          {view === 'overview' && <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 14 }}>
              <Metric label="Estimated cases" value={formatNumber(selectedDisease.infected)} color={C.blue} detail="Cumulative burden estimate" />
              <Metric label="Estimated deaths" value={formatNumber(selectedDisease.deaths)} color={C.red} detail="Historical estimate" />
              <Metric label="Case fatality" value={`${selectedDisease.cfr}%`} color={C.gold} detail="Reported / estimated" />
              <Metric label="Basic reproduction" value={selectedDisease.r0} color={C.cyan} detail="R₀ · context dependent" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(230px, .85fr)', gap: 14, marginBottom: 14 }}>
              <section style={{ ...cardStyle, padding: 20 }}>
                <SectionTitle kicker="AT A GLANCE" title="Outbreak profile" />
                <p style={{ color: '#C0CBD9', fontSize: 13, lineHeight: 1.8, margin: '17px 0 20px' }}>{historicalFrame(selectedDisease)} The recorded transmission pathway is {selectedDisease.source.toLowerCase()}.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                  <Fact label="Origin / first record" value={selectedDisease.origin} />
                  <Fact label="First recorded" value={yearLabel(selectedDisease.year)} />
                  <Fact label="Estimate type" value={selectedDisease.burdenScope || 'Historical estimate'} />
                  <Fact label="Incubation" value={`${selectedDisease.inc} days`} />
                  <Fact label="Infectious period" value={`${selectedDisease.inf} days`} />
                </div>
                <div style={{ marginTop: 10, color: C.faint, fontSize: 10 }}>Data confidence: {selectedDisease.estimateConfidence || 'Not assessed'} · {historicalFrame(selectedDisease)}</div>
              </section>
              <section style={{ ...cardStyle, padding: 20 }}>
                <SectionTitle kicker="TRANSMISSION" title="Pathway & context" />
                <div style={{ padding: '15px 0 12px', display: 'flex', alignItems: 'center', gap: 10 }}><span style={nodeStyle(C.cyan)} /><span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{selectedDisease.source}</span></div>
                <div style={{ height: 1, background: C.line, margin: '4px 0 12px' }} />
                <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.65, margin: 0 }}>Spread depends on pathogen biology, host behavior, immunity and local conditions. R₀ is a context-specific estimate rather than a fixed property.</p>
              </section>
            </div>
            <section style={{ ...cardStyle, padding: 20, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}><SectionTitle kicker="MODELED SERIES" title="Epidemic curve" /><ScaleControl value={chartScale} onChange={setChartScale} /></div>
              <ChartLegend items={[[C.blue, 'New cases / interval'], [C.red, 'Cumulative deaths']]} />
              <div style={{ height: 240, marginTop: 10 }}><EpiChart data={series} scale={chartScale} /></div>
              <ModelNote />
            </section>
            <section style={{ ...cardStyle, padding: 20 }}>
              <SectionTitle kicker="HISTORICAL NOTES" title="What the record can tell us" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginTop: 16 }}>
                <NoteCard number="01" title="Burden is approximate" body={historicalFrame(selectedDisease)} />
                <NoteCard number="02" title="Case definitions change" body="Testing, reporting rules and access to care differ across place and time, so counts are not directly comparable." />
                <NoteCard number="03" title="Transmission is contextual" body={`The archive lists ${selectedDisease.source.toLowerCase()} as the principal pathway. Outbreak spread can involve several routes and settings.`} />
              </div>
            </section>
          </>}

          {view === 'curves' && <section style={{ ...cardStyle, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}><SectionTitle kicker="TIME SERIES · ILLUSTRATIVE" title="Cases and deaths over time" /><ScaleControl value={chartScale} onChange={setChartScale} /></div>
            <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.65, maxWidth: 760 }}>The histogram shows estimated new cases per interval. The line graph shows cumulative cases and deaths on the same timeline. Change the vertical scale to compare outbreaks with very different sizes.</p>
            <ChartLegend items={[[C.blue, 'New cases / interval'], [C.cyan, 'Cumulative cases'], [C.red, 'Cumulative deaths']]} />
            <div style={{ height: 340, marginTop: 14 }}><EpiChart data={series} scale={chartScale} showCumulative /></div>
            <ModelNote />
          </section>}

          {view === 'composition' && <section style={{ ...cardStyle, padding: 22 }}>
            <SectionTitle kicker="STACKED AREA · ILLUSTRATIVE" title="Estimated case composition" />
            <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.65, maxWidth: 760 }}>The stacked area separates estimated active infections, recovered cases and deaths over a modeled wave. This is a visualization derived from the archive totals, not a measured historical time series.</p>
            <ChartLegend items={[[C.blue, 'Active'], [C.green, 'Recovered'], [C.red, 'Deaths']]} />
            <div style={{ height: 340, marginTop: 14 }}><StackedAreaChart data={series} scale={chartScale} /></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}><ScaleControl value={chartScale} onChange={setChartScale} /></div>
            <ModelNote />
          </section>}

          {view === 'spread' && <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(260px, .75fr)', gap: 14 }}>
            <section style={{ ...cardStyle, padding: 22 }}><SectionTitle kicker="THEMATIC MAP · SCHEMATIC" title="Geographic origin" /><p style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>The source record identifies {selectedDisease.origin}. Historical spread boundaries are not available in this archive, so the map marks the reported origin only.</p><OriginMap origin={selectedDisease.origin} /><div style={{ color: C.faint, fontSize: 10, marginTop: 9 }}>Origin marker is approximate; shaded region is schematic.</div></section>
            <section style={{ ...cardStyle, padding: 22 }}><SectionTitle kicker="CONTACT / TRAVEL GRAPH · CONCEPTUAL" title="Transmission network" /><p style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>A conceptual pathway diagram based on the listed transmission route. It does not represent measured contacts or specific historical travel links.</p><NetworkDiagram disease={selectedDisease} /><div style={{ marginTop: 18, padding: 12, background: 'rgba(255,255,255,.025)', borderRadius: 10 }}><div style={{ color: C.faint, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6 }}>Listed transmission source</div><div style={{ color: C.text, fontSize: 12, lineHeight: 1.5 }}>{selectedDisease.source}</div></div></section>
            <section style={{ ...cardStyle, padding: 22, gridColumn: '1 / -1' }}><SectionTitle kicker="SPREAD CONTEXT" title="Reading the map and network" /><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 15 }}><NoteCard number="A" title="Reported starting point" body={`${selectedDisease.origin} is the origin stated in the archive entry; origins for older diseases may be debated.`} /><NoteCard number="B" title="No fabricated borders" body="The map intentionally avoids inventing country-level case counts or spread routes where records are missing." /><NoteCard number="C" title="Pathways can vary" body="The listed source summarizes a route associated with the disease. Real outbreaks can spread through multiple linked settings." /></div></section>
          </div>}
        </div> : <div style={{ color: C.muted, textAlign: 'center', padding: 50 }}>Select a disease profile to begin.</div>}
      </main>
    </div>
  );
}

function Metric({ label, value, color, detail }) { return <div style={{ ...cardStyle, padding: '16px 17px' }}><div style={{ color: C.muted, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</div><div style={{ color, fontSize: 25, fontWeight: 750, letterSpacing: '-.04em', margin: '9px 0 4px' }}>{value}</div><div style={{ color: C.faint, fontSize: 10 }}>{detail}</div></div>; }
function SectionTitle({ kicker, title }) { return <div><div style={{ ...eyebrowStyle, marginBottom: 7 }}>{kicker}</div><h2 style={{ margin: 0, color: C.text, fontSize: 18, letterSpacing: '-.03em' }}>{title}</h2></div>; }
function Fact({ label, value }) { return <div style={{ padding: 11, background: 'rgba(255,255,255,.025)', border: `1px solid ${C.line}`, borderRadius: 10 }}><div style={{ color: C.faint, fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div><div style={{ color: C.text, fontSize: 12, lineHeight: 1.4, fontWeight: 650 }}>{value}</div></div>; }
function NoteCard({ number, title, body }) { return <div style={{ display: 'flex', gap: 11, padding: 13, background: 'rgba(255,255,255,.025)', border: `1px solid ${C.line}`, borderRadius: 11 }}><span style={{ color: C.cyan, fontSize: 10, fontWeight: 800 }}>{number}</span><div><div style={{ color: C.text, fontSize: 12, fontWeight: 700, marginBottom: 5 }}>{title}</div><div style={{ color: C.muted, fontSize: 11, lineHeight: 1.55 }}>{body}</div></div></div>; }
function ChartLegend({ items }) { return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', marginTop: 16 }}>{items.map(([color, label]) => <span key={label} style={{ display: 'inline-flex', gap: 7, alignItems: 'center', color: C.muted, fontSize: 10 }}><i style={{ width: 8, height: 8, background: color, borderRadius: 3 }} />{label}</span>)}</div>; }
function ScaleControl({ value, onChange }) { return <div style={{ display: 'inline-flex', padding: 3, background: '#0A111C', border: `1px solid ${C.line}`, borderRadius: 8 }}>{['linear', 'log'].map(scale => <button key={scale} onClick={() => onChange(scale)} style={{ padding: '6px 9px', color: value === scale ? C.text : C.faint, background: value === scale ? C.panel2 : 'transparent', border: 0, borderRadius: 6, cursor: 'pointer', fontSize: 10, textTransform: 'capitalize' }}>{scale}</button>)}</div>; }
function ModelNote() { return <div style={{ marginTop: 13, padding: '9px 11px', color: '#C4A973', background: 'rgba(245,196,106,.06)', border: '1px solid rgba(245,196,106,.12)', borderRadius: 8, fontSize: 10, lineHeight: 1.5 }}>Illustrative model based on estimated cumulative totals. It is not observed weekly or daily surveillance data; historical totals and case definitions carry uncertainty.</div>; }
function nodeStyle(color) { return { display: 'inline-block', width: 10, height: 10, flex: '0 0 10px', borderRadius: '50%', background: color, boxShadow: `0 0 14px ${color}77` }; }

function EpiChart({ data, scale, showCumulative = false }) {
  const W = 900, H = 270, L = 54, R = 12, T = 12, B = 30;
  const values = data.flatMap(d => [d.newCases, ...(showCumulative ? [d.cumulative, d.cumulativeDeaths] : [d.cumulativeDeaths])]);
  const max = Math.max(1, ...values);
  const y = (v) => { const ratio = scale === 'log' ? Math.log10(1 + v) / Math.log10(1 + max) : v / max; return T + (H - T - B) * (1 - ratio); };
  const x = (i) => L + i / Math.max(1, data.length - 1) * (W - L - R);
  const ticks = [0, .25, .5, .75, 1];
  const line = (key) => data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d[key])}`).join(' ');
  return <svg role="img" aria-label="Illustrative epidemic curve and time series" viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
    {ticks.map((t, i) => <g key={i}><line x1={L} x2={W - R} y1={T + (H - T - B) * t} y2={T + (H - T - B) * t} stroke={C.line} strokeDasharray="3 5" /><text x={L - 8} y={T + (H - T - B) * t + 3} fill={C.faint} fontSize="9" textAnchor="end">{scale === 'log' ? `10^${Math.round(Math.log10(1 + max) * (1 - t))}` : formatNumber(max * (1 - t))}</text></g>)}
    {data.map((d, i) => { const bw = Math.max(2, (W - L - R) / data.length * .72); const top = y(d.newCases); return <rect key={i} x={x(i) - bw / 2} y={top} width={bw} height={Math.max(1, H - B - top)} rx="1.5" fill={C.blue} opacity=".56" />; })}
    {showCumulative && <path d={line('cumulative')} fill="none" stroke={C.cyan} strokeWidth="2.5" />}
    <path d={line('cumulativeDeaths')} fill="none" stroke={C.red} strokeWidth="2" />
    <text x={L} y={H - 7} fill={C.faint} fontSize="9">Start</text><text x={W - R} y={H - 7} fill={C.faint} fontSize="9" textAnchor="end">Later intervals →</text>
  </svg>;
}

function StackedAreaChart({ data, scale }) {
  const W = 900, H = 300, L = 54, R = 12, T = 12, B = 30;
  const total = Math.max(1, ...data.map(d => d.cumulative));
  const y = (v) => { const ratio = scale === 'log' ? Math.log10(1 + v) / Math.log10(1 + total) : v / total; return T + (H - T - B) * (1 - ratio); };
  const x = (i) => L + i / Math.max(1, data.length - 1) * (W - L - R);
  const area = (lower, upper) => {
    const top = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(upper(d))}`).join(' ');
    const bottom = data.map((d, i) => `${x(data.length - 1 - i)},${y(lower(data[data.length - 1 - i]))}`).join(' ');
    return `${top} ${bottom} Z`;
  };
  const noDeaths = d => Math.max(0, d.cumulative - d.deaths);
  return <svg role="img" aria-label="Illustrative stacked area of active infections, recoveries and deaths" viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
    {[0, .25, .5, .75, 1].map((t, i) => <g key={i}><line x1={L} x2={W - R} y1={T + (H - T - B) * t} y2={T + (H - T - B) * t} stroke={C.line} strokeDasharray="3 5" /><text x={L - 8} y={T + (H - T - B) * t + 3} fill={C.faint} fontSize="9" textAnchor="end">{formatNumber(total * (1 - t))}</text></g>)}
    <path d={area(() => 0, d => d.active)} fill={C.blue} fillOpacity=".72" />
    <path d={area(d => d.active, d => noDeaths(d))} fill={C.green} fillOpacity=".68" />
    <path d={area(d => noDeaths(d), d => d.cumulative)} fill={C.red} fillOpacity=".72" />
    <text x={L} y={H - 7} fill={C.faint} fontSize="9">Start</text><text x={W - R} y={H - 7} fill={C.faint} fontSize="9" textAnchor="end">Later intervals →</text>
  </svg>;
}

function NetworkDiagram({ disease }) {
  const nodes = [
    { x: 68, y: 100, label: 'Origin', color: C.cyan },
    { x: 222, y: 49, label: 'Hosts', color: C.blue },
    { x: 222, y: 151, label: 'Environment', color: C.green },
    { x: 376, y: 100, label: 'New infections', color: C.red }
  ];
  const vector = /water|waterborne|contaminat/i.test(disease.source) ? [0, 2, 3] : /vector|mosquito|flea|tick|insect/i.test(disease.source) ? [0, 2, 1, 3] : [0, 1, 3];
  const edges = vector.slice(0, -1).map((idx, i) => [nodes[idx], nodes[vector[i + 1]]]);
  return <svg role="img" aria-label="Conceptual transmission network diagram" viewBox="0 0 445 205" width="100%" style={{ marginTop: 8 }}>
    {edges.map(([a, b], i) => <g key={i}><path d={`M${a.x},${a.y} Q${(a.x + b.x) / 2},${(a.y + b.y) / 2 - 14} ${b.x},${b.y}`} fill="none" stroke={C.faint} strokeWidth="1.5" strokeDasharray="4 5" /><circle r="3" fill={C.cyan}><animateMotion dur={`${2 + i * .3}s`} repeatCount="indefinite" path={`M${a.x},${a.y} Q${(a.x + b.x) / 2},${(a.y + b.y) / 2 - 14} ${b.x},${b.y}`} /></circle></g>)}
    {nodes.map(node => <g key={node.label}><circle cx={node.x} cy={node.y} r="22" fill={`${node.color}18`} stroke={`${node.color}88`} /><circle cx={node.x} cy={node.y} r="5" fill={node.color} /><text x={node.x} y={node.y + 39} textAnchor="middle" fill={C.muted} fontSize="10">{node.label}</text></g>)}
  </svg>;
}

function OriginMap({ origin }) {
  const normalized = origin.toLowerCase();
  let dot = { x: 510, y: 123 };
  if (/china|japan|asia|india|middle east|saudi|mesopotamia|hong kong|indonesia/.test(normalized)) dot = { x: 647, y: 119 };
  else if (/africa|uganda|guinea|nigeria|congo|egypt|tanzania/.test(normalized)) dot = { x: 520, y: 160 };
  else if (/europe|france|greece|russia|germany/.test(normalized)) dot = { x: 518, y: 92 };
  else if (/america|mexico|united states|south america/.test(normalized)) dot = { x: 285, y: 126 };
  else if (/australia|malaysia/.test(normalized)) dot = { x: 693, y: 205 };
  return <svg role="img" aria-label={`Schematic map with an approximate marker for ${origin}`} viewBox="0 0 900 280" width="100%" style={{ marginTop: 10, background: 'linear-gradient(180deg, rgba(49,94,126,.08), rgba(49,94,126,.01))', borderRadius: 12 }}>
    {[0, 1, 2, 3].map(i => <ellipse key={i} cx="450" cy="140" rx={120 + i * 82} ry={38 + i * 27} fill="none" stroke="rgba(84,226,208,.08)" />)}
    <path d="M82 82l35-30 52 4 16 18 38 4 15 22-21 14-12 26-37 8-9 23-28-4-8-23-30-10-20-25 10-15-16-12zm183 99l29 5 18 26-7 39-15 20-17-24-5-33-12-19zm151-141l38-24 42 7 7 18 36-2 8 18-30 18-16 18-24-4-11 23-26-9-25 3-17-22-30-3-16-20zm73 58l50-19 48 9 16 22-24 20-35 2-12 20-31-6-19-19zm115 66l30-15 34 10 17 28-22 25-35-4-22-22z" fill="rgba(84,226,208,.13)" stroke="rgba(84,226,208,.26)" strokeWidth="1.2" />
    <circle cx={dot.x} cy={dot.y} r="21" fill="rgba(255,117,132,.12)" /><circle cx={dot.x} cy={dot.y} r="8" fill={C.red} stroke="#FFE0E4" strokeWidth="2"><animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" /></circle>
    <path d={`M${dot.x + 10} ${dot.y - 9} L${dot.x + 56} ${dot.y - 40}`} stroke={C.red} strokeDasharray="3 4" /><text x={dot.x + 62} y={dot.y - 42} fill={C.text} fontSize="12">{origin}</text>
    <text x="24" y="258" fill={C.faint} fontSize="9">SCHEMATIC WORLD VIEW · APPROXIMATE ORIGIN REGION</text>
  </svg>;
}
