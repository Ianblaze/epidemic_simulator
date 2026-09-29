import React, { useMemo } from 'react';

export default function LiveChart({ chartData }) {
  const data = chartData || [];
  const isEmpty = data.length < 2;

  const computed = useMemo(() => {
    const displayData = isEmpty ? [{ day: 0, E: 0, I: 0, R: 0, D: 0 }, { day: 100, E: 0, I: 0, R: 0, D: 0 }] : data;

    const maxDay = isEmpty ? 100 : Math.max(1, ...displayData.map(d => d.day));
    const maxPop = isEmpty ? 100000 : Math.max(1, ...displayData.map(d => Math.max(d.E, d.I, d.R, d.D)));

    const pad = { top: 25, right: 15, bottom: 25, left: 50 };
    const plotW = 400 - pad.left - pad.right;
    const plotH = 200 - pad.top - pad.bottom;

    const sx = (day) => pad.left + (day / maxDay) * plotW;
    const sy = (val) => pad.top + plotH - (val / maxPop) * plotH;

    const makeLine = (key) => {
      if (isEmpty) return '';
      const start = `M ${sx(data[0].day)},${sy(data[0][key])}`;
      const lines = data.slice(1).map(d => `L ${sx(d.day)},${sy(d[key])}`);
      return [start, ...lines].join(' ');
    };

    const makeArea = (key) => {
      if (isEmpty) return '';
      const line = data.map(d => `${sx(d.day)},${sy(d[key])}`).join(' L ');
      const baseline = pad.top + plotH;
      return `M ${sx(data[0].day)},${baseline} L ${line} L ${sx(data[data.length - 1].day)},${baseline} Z`;
    };

    const gridLines = [];
    for (let i = 0; i <= 4; i++) {
      gridLines.push(pad.top + (plotH / 4) * i);
    }

    return { 
      lines: { E: makeLine('E'), I: makeLine('I'), R: makeLine('R'), D: makeLine('D') }, 
      areaI: makeArea('I'), 
      maxDay, maxPop, pad, plotW, plotH, sx, sy, gridLines 
    };
  }, [data, isEmpty]);

  const formatAxis = (n) => {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return Math.round(n).toString();
  };

  const legend = [
    { label: 'Exposed', color: 'var(--yellow)' },
    { label: 'Infected', color: 'var(--red)' },
    { label: 'Recovered', color: '#00cc44' },
    { label: 'Deceased', color: 'var(--grey)' },
  ];

  return (
    <div className="chart-container" style={{ transition: 'opacity 0.5s ease', width: '100%' }}>
      <svg className="chart-svg" viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: '100%', height: '200px' }}>
        <defs>
          <linearGradient id="infectedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 0, 110, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 0, 110, 0.0)" />
          </linearGradient>
        </defs>

        {computed.gridLines.map((y, i) => (
          <g key={i}>
            <line x1={computed.pad.left} y1={y} x2={computed.pad.left + computed.plotW} y2={y} stroke="var(--rule)" strokeWidth="1" />
            <text x={computed.pad.left - 8} y={y + 4} textAnchor="end" fill="var(--soft)" fontSize="12">
              {formatAxis(computed.maxPop * (1 - i / 4))}
            </text>
          </g>
        ))}

        <line x1={computed.pad.left} y1={computed.pad.top + computed.plotH} x2={computed.pad.left + computed.plotW} y2={computed.pad.top + computed.plotH} stroke="var(--rule)" strokeWidth="1" />

        <text x={computed.pad.left} y={computed.pad.top + computed.plotH + 18} fill="var(--soft)" fontSize="12">0</text>
        <text x={computed.pad.left + computed.plotW} y={computed.pad.top + computed.plotH + 18} textAnchor="end" fill="var(--soft)" fontSize="12">Day {computed.maxDay}</text>

        {!isEmpty && (
          <>
            <path d={computed.areaI} fill="url(#infectedGrad)" />
            <path d={computed.lines.E} fill="none" stroke="var(--yellow)" strokeWidth="2.5" strokeLinejoin="round" />
            <path d={computed.lines.I} fill="none" stroke="var(--red)" strokeWidth="3" strokeLinejoin="round" filter="drop-shadow(0 2px 5px rgba(255,0,110,0.5))" />
            <path d={computed.lines.R} fill="none" stroke="#00cc44" strokeWidth="2.5" strokeLinejoin="round" />
            <path d={computed.lines.D} fill="none" stroke="var(--grey)" strokeWidth="2" strokeLinejoin="round" strokeDasharray="5 4" />
          </>
        )}

        {legend.map((item, i) => (
          <g key={item.label} transform={`translate(${computed.pad.left + i * 80}, 10)`}>
            <line x1="0" y1="3" x2="10" y2="3" stroke={item.color} strokeWidth="3" strokeLinecap="round" />
            <text x="14" y="7" fill="var(--ink)" fontSize="10" fontWeight="600">{item.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
