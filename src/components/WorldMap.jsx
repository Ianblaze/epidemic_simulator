import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import simCountries from '../data/countries.js';

const nameMap = {
  "United States of America": "United States",
  "Russian Federation": "Russia",
  "Dem. Rep. Korea": "North Korea",
  "Korea": "South Korea",
  "Taiwan, Province of China": "Taiwan",
  "United Kingdom": "United Kingdom",
  "Czechia": "Czechia",
  "Dem. Rep. Congo": "Democratic Republic of the Congo",
  "Central African Rep.": "Central African Republic",
  "S. Sudan": "South Sudan"
};

export default function WorldMap({ countryStates, seedCountry, setSeedCountry, isRunning, onBackToGlobe }) {
  const [worldData, setWorldData] = useState(null);
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);

  useEffect(() => {
    fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json')
      .then(res => res.json())
      .then(data => {
        setWorldData(topojson.feature(data, data.objects.countries).features);
      });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    zoomRef.current = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (e) => {
        d3.select(gRef.current).attr('transform', e.transform);
      });
    
    const svg = d3.select(svgRef.current);
    svg.call(zoomRef.current);
    
    // Initial zoom animation if seedCountry exists
    if (seedCountry && worldData) {
       // Animate in from globe
       svg.style('opacity', 0).transition().duration(800).style('opacity', 1);
    }
  }, [worldData, seedCountry]);

  const handleZoom = (factor) => {
    if (zoomRef.current && svgRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, factor);
    }
  };

  const handleReset = () => {
    if (zoomRef.current && svgRef.current) {
      d3.select(svgRef.current).transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  const getSimCountry = (name) => {
    const mapped = nameMap[name] || name;
    return simCountries.find(c => c.name.includes(mapped) || mapped.includes(c.name));
  };

  const getCountryColor = (simId) => {
    if (!countryStates) return '';
    const state = countryStates.get(simId);
    if (!state) return '';
    const total = state.S + state.E + state.I + state.R;
    if (total === 0) return '';
    const exposedRatio = state.E / total;
    const infectedRatio = state.I / total;
    const recoveredRatio = state.R / total;

    if (infectedRatio > 0.001) {
      const intensity = Math.min(1, infectedRatio * 50);
      const r = Math.round(181 + (255 - 181) * intensity);
      const g = Math.round(9 + (23 - 9) * intensity);
      const b = Math.round(50 + (68 - 50) * intensity);
      return `rgba(${r}, ${g}, ${b}, ${0.6 + intensity * 0.4})`;
    }
    if (exposedRatio > 0.0001) return 'rgba(255, 181, 71, 0.6)';
    if (recoveredRatio > 0.01) {
      const intensity = Math.min(1, recoveredRatio * 3);
      return `rgba(1, 181, 116, ${0.15 + intensity * 0.35})`;
    }
    return '';
  };

  if (!worldData) return <div className="chart-empty">Loading geographic data...</div>;

  const projection = d3.geoEquirectangular().fitSize([1000, 500], { type: "FeatureCollection", features: worldData });
  const path = d3.geoPath().projection(projection);

  return (
    <div className="map-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg ref={svgRef} className="world-map" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" style={{ background: 'transparent' }}>
        <g ref={gRef}>
          {worldData.map((d, i) => {
            const simC = getSimCountry(d.properties.name);
            const isSeed = simC && seedCountry === simC.id;
            const stateColor = simC ? getCountryColor(simC.id) : '';
            
            return (
              <path
                key={i}
                d={path(d)}
                className={`country-path ${isSeed ? 'country-path--seed' : ''}`}
                fill={stateColor || (simC ? '#151827' : '#0a0d16')}
                stroke="rgba(150,160,190,0.18)"
                strokeWidth={0.5}
                onClick={() => {
                  if (!isRunning && setSeedCountry && simC) {
                    setSeedCountry(simC.id);
                  }
                }}
              >
                <title>{d.properties.name}</title>
              </path>
            );
          })}
        </g>
      </svg>

      <div className="map-controls">
        <button className="map-ctrl-btn" onClick={() => handleZoom(1.5)}>+</button>
        <button className="map-ctrl-btn" onClick={() => handleZoom(0.66)}>−</button>
        <button className="map-ctrl-btn text-ctrl" onClick={handleReset}>RESET</button>
        {onBackToGlobe && (
          <button className="map-ctrl-btn text-ctrl" onClick={onBackToGlobe}>GLOBE</button>
        )}
      </div>
    </div>
  );
}
