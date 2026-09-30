import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldAtlasUrl from 'world-atlas/countries-110m.json?url';
import { airports, seaports, routes } from '../data/transit.js';

export default function FlatWorldMap({ countryStates, params, isRunning, inboundInfectionsRef, vaccineProgress = 0, transitEvents = [] }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [geoData, setGeoData] = useState(null);
  const bgImageRef = useRef(null);

  const vehiclesRef = useRef([]); 
  const centroidsRef = useRef({});
  const boundsRef = useRef({});
  const drawnDotsRef = useRef({}); // tracks dots drawn per country: { cid: { infected: n, dead: n, recovered: n } }
  const closedBordersRef = useRef(new Set()); // countries that have closed borders
  
  const trailCanvasRef = useRef(null);
  const infectionCanvasRef = useRef(null); 
  
  const statesRef = useRef(countryStates);
  const paramsRef = useRef(params);
  const runningRef = useRef(isRunning);
    const vaccineRef = useRef(vaccineProgress || 0);
  
    useEffect(() => {
    if (isRunning && transitEvents && transitEvents.length > 0) {
        transitEvents.forEach(evt => {
            // Find coordinates, fallback to centroids if airport/seaport missing
            let p1 = airports.find(p => p.country === evt.origin);
            let p2 = airports.find(p => p.country === evt.target);
            
            if (!p1 && centroidsRef.current[evt.origin]) p1 = { x: centroidsRef.current[evt.origin][0], y: centroidsRef.current[evt.origin][1] };
            if (!p2 && centroidsRef.current[evt.target]) p2 = { x: centroidsRef.current[evt.target][0], y: centroidsRef.current[evt.target][1] };

            if (p1 && p2) {
                if (evt.type === 'ship') {
                    vehiclesRef.current.push({
                        type: 'ship', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,
                        endCountry: evt.target, progress: 0,
                        speed: 0.01 + Math.random() * 0.01,
                        infected: evt.isVaccine ? false : true, vaccine: evt.isVaccine ? true : false
                    });
                } else {
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    // For land borders, draw a fast small arc. For flights, normal arc.
                    vehiclesRef.current.push({
                        type: 'flight', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,
                        endCountry: evt.target, cx: p1.x + dx * 0.5 - dy * 0.2, cy: p1.y + dy * 0.5 + dx * 0.2,
                        progress: 0,
                        speed: evt.type === 'land' ? 0.05 : 0.02 + Math.random() * 0.01,
                        infected: evt.isVaccine ? false : true, vaccine: evt.isVaccine ? true : false
                    });
                }
            }
        });
    }
  }, [transitEvents]);
  
  useEffect(() => {
    statesRef.current = countryStates;
    paramsRef.current = params;
    runningRef.current = isRunning;
      vaccineRef.current = vaccineProgress || 0;

    // Dynamic border closing logic — runs every time countryStates updates
    if (countryStates) {
      countryStates.forEach((state, cid) => {
        const N = state.S + state.E + state.I + state.R + state.D;
        if (N <= 0) return;
        const infectionRatio = state.I / N;
        // Countries dynamically close borders when infection ratio exceeds a threshold
        // The threshold varies per country to simulate different government responses
        // Use a hash of the country ID to create per-country variation (0.01 to 0.08)
        
        const hash = cid.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const variation = (hash % 7) * 0.005;
        const baseThreshold = paramsRef.current && paramsRef.current.borderStrictness > 0 
           ? 0.15 - (paramsRef.current.borderStrictness * 0.14) // if strictness is 1, closes at 1%. If 0, closes at 15%
           : 0.05;
        const threshold = Math.max(0.001, baseThreshold + variation);

        
        if (infectionRatio > threshold && !closedBordersRef.current.has(cid)) {
          closedBordersRef.current.add(cid);
        }
        // Countries reopen if infection drops below half the threshold
        if (infectionRatio < threshold * 0.5 && closedBordersRef.current.has(cid)) {
          closedBordersRef.current.delete(cid);
        }
      });
    }
  }, [countryStates, params, isRunning, vaccineProgress]);

  useEffect(() => {
    fetch(worldAtlasUrl)
      .then((res) => res.json())
      .then((topo) => {
        const geojson = topojson.feature(topo, topo.objects.countries);
        setGeoData(geojson);
      });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, []);

  useEffect(() => {
    if (!geoData || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    if (!trailCanvasRef.current) trailCanvasRef.current = document.createElement('canvas');
    if (!infectionCanvasRef.current) infectionCanvasRef.current = document.createElement('canvas');
    
    const tCanvas = trailCanvasRef.current;
    const tCtx = tCanvas.getContext('2d');
    const iCanvas = infectionCanvasRef.current;
    const iCtx = iCanvas.getContext('2d');

    const resize = () => {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        
        if (tCanvas.width !== w || tCanvas.height !== h) {
           tCanvas.width = w;
           tCanvas.height = h;
           tCtx.clearRect(0, 0, w, h);
           iCanvas.width = w;
           iCanvas.height = h;
           iCtx.clearRect(0, 0, w, h);
           drawnDotsRef.current = {};
        }
        centroidsRef.current = {}; 
        boundsRef.current = {};
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const drawAirplane = (ctx, x, y, angle, infected) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = infected ? '#ff0033' : '#ffffff';
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-5, -6);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-5, 6);
      ctx.closePath();
      if (infected) { ctx.shadowColor = '#ff0033'; ctx.shadowBlur = 8; }
      ctx.fill();
      ctx.restore();
    };

    const drawShip = (ctx, x, y, angle, infected) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = infected ? '#ff0033' : '#88ccff';
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(-4, -2.5);
      ctx.lineTo(-4, 2.5);
      ctx.closePath();
      if (infected) { ctx.shadowColor = '#ff0033'; ctx.shadowBlur = 8; }
      ctx.fill();
      ctx.restore();
    };

    const drawPortIcon = (x, y, closed) => {
      ctx.fillStyle = closed ? '#ff4444' : '#88ccff';
      ctx.fillRect(x - 2, y - 2, 4, 4);
      if (closed) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 4, y - 4);
        ctx.lineTo(x + 4, y + 4);
        ctx.stroke();
      }
    };

    const drawAirportIcon = (x, y, closed) => {
      ctx.fillStyle = closed ? '#ff4444' : '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      if (closed) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 3, y - 3);
        ctx.lineTo(x + 3, y + 3);
        ctx.stroke();
      }
    };

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (bgImageRef.current) {
        ctx.drawImage(bgImageRef.current, 0, 0, width, height);
      } else {
        ctx.fillStyle = '#0a192f';
        ctx.fillRect(0, 0, width, height);
      }

      const projection = d3.geoEquirectangular()
        .scale(width / (2 * Math.PI))
        .translate([width / 2, height / 2]);
      const path = d3.geoPath().projection(projection).context(ctx);

      const features = geoData.features;

      // 1. DRAW COUNTRIES & SPAWN DOTS (infected=red, dead=black, recovered=green)
      features.forEach((feature) => {
        const name = feature.properties.name;
        if (!name) return;
        const cid = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        
        if (!centroidsRef.current[cid]) {
          const c = d3.geoPath().projection(projection).centroid(feature);
          if (!isNaN(c[0]) && !isNaN(c[1])) centroidsRef.current[cid] = c;
          boundsRef.current[cid] = d3.geoBounds(feature);
        }
        
        const state = statesRef.current ? statesRef.current.get(cid) : null;
        if (!state) return;
        
        const N = state.S + state.E + state.I + state.R + state.D;
        if (N <= 0) return;

        const iRatio = Math.min(1, state.I / N);
        const dRatio = Math.min(1, state.D / N);
        const rRatio = Math.min(1, state.R / N);

        // Country tint based on dominant state
        if (iRatio > 0.02) {
          ctx.beginPath();
          path(feature);
          ctx.globalAlpha = Math.min(0.4, iRatio);
          ctx.fillStyle = '#ff0022';
          ctx.fill();
          ctx.globalAlpha = Math.min(1, iRatio * 2);
          ctx.strokeStyle = 'rgba(255, 20, 50, 0.8)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }

        // Border closing visual indicator
        if (closedBordersRef.current.has(cid)) {
          ctx.beginPath();
          path(feature);
          ctx.strokeStyle = 'rgba(255, 200, 0, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        if (!drawnDotsRef.current[cid]) drawnDotsRef.current[cid] = { infected: 0, dead: 0, recovered: 0 };
        const dots = drawnDotsRef.current[cid];
        const bounds = boundsRef.current[cid];
        if (!bounds) return;

        const area = d3.geoArea(feature); 
        const maxDots = Math.max(50, Math.min(4000, area * 40000)); 

        // Helper to spawn dots of a specific color on the persistent canvas
        const spawnDots = (targetCount, currentCount, type, fillColor, shadowColor) => {
          if (!runningRef.current) return currentCount;
          let attempts = 0;
          while (currentCount < targetCount && attempts < 50) {
            attempts++;
            
              let lon, lat;
              if (bounds[0][0] > bounds[1][0]) {
                 const w1 = 180 - bounds[0][0];
                 const w2 = bounds[1][0] + 180;
                 lon = Math.random() * (w1 + w2) < w1 ? bounds[0][0] + Math.random() * w1 : -180 + Math.random() * w2;
              } else {
                 lon = bounds[0][0] + Math.random() * (bounds[1][0] - bounds[0][0]);
              }
              lat = bounds[0][1] + Math.random() * (bounds[1][1] - bounds[0][1]);

            
            if (d3.geoContains(feature, [lon, lat])) {
              const p = projection([lon, lat]);
              iCtx.fillStyle = fillColor;
              iCtx.beginPath();
              iCtx.arc(p[0], p[1], 0.5 + Math.random() * 1.5, 0, Math.PI * 2);
              iCtx.fill();
              
              if (Math.random() < 0.15 && shadowColor) {
                iCtx.shadowColor = shadowColor;
                iCtx.shadowBlur = 5;
                iCtx.fill();
                iCtx.shadowBlur = 0;
              }
              currentCount++;
            }
          }
          return currentCount;
        };

        // Infected dots (red)
        const targetInfected = Math.floor(iRatio * maxDots);
        dots.infected = spawnDots(targetInfected, dots.infected, 'infected', 'rgba(255, 0, 10, 0.9)', '#ff0022');

        // Death dots (black/dark)
        const targetDead = Math.floor(dRatio * maxDots * 0.8);
        dots.dead = spawnDots(targetDead, dots.dead, 'dead', 'rgba(20, 0, 20, 0.95)', '#330033');

        // Recovery dots (green)
        const targetRecovered = Math.floor(rRatio * maxDots * 0.5);
        dots.recovered = spawnDots(targetRecovered, dots.recovered, 'recovered', 'rgba(0, 200, 80, 0.7)', '#00cc44');
      });

      // Overlay the permanent persistent canvases
      ctx.drawImage(tCanvas, 0, 0); // Trails
      ctx.drawImage(iCanvas, 0, 0); // Infection/death/recovery dots

      // 2. DRAW PORTS & AIRPORTS (show closed ones with X)
      const activeAirports = airports.map(a => {
        const p = projection([a.lon, a.lat]);
        const closed = closedBordersRef.current.has(a.country);
        drawAirportIcon(p[0], p[1], closed);
        return { ...a, x: p[0], y: p[1], closed };
      });
      const activeSeaports = seaports.map(s => {
        const p = projection([s.lon, s.lat]);
        const closed = closedBordersRef.current.has(s.country);
        drawPortIcon(p[0], p[1], closed);
        return { ...s, x: p[0], y: p[1], closed };
      });

      // 3. SPAWN TRANSIT VEHICLES (respecting border closures)
      
        if (runningRef.current) {
          const spawnCount = Math.random() < 0.4 ? 1 : 0;
          for (let spawnIndex = 0; spawnIndex < spawnCount; spawnIndex++) {

        const isShip = Math.random() < 0.3;
        
        if (isShip) {
          let route = routes.ships[Math.floor(Math.random() * routes.ships.length)];
          if (statesRef.current) {
             for(let tries=0; tries<15; tries++) {
                 const testP = activeSeaports.find(p => p.id === route.path[0]);
                 if (testP && statesRef.current.get(testP.country)?.I > 500) break;
                 route = routes.ships[Math.floor(Math.random() * routes.ships.length)];
             }
          }
          const segmentIndex = Math.floor(Math.random() * (route.path.length - 1));
          const p1 = activeSeaports.find(p => p.id === route.path[segmentIndex]);
          const p2 = activeSeaports.find(p => p.id === route.path[segmentIndex + 1]);
          
          const s1 = statesRef.current ? statesRef.current.get(p1.country) : null;
            const s2 = statesRef.current ? statesRef.current.get(p2.country) : null;
            const closed1 = s1 && s1.I > (s1.S + s1.E + s1.I + s1.R) * 0.2; // Close borders if >20% infected
            const closed2 = s2 && s2.I > (s2.S + s2.E + s2.I + s2.R) * 0.2;
            if (p1 && p2 && !p1.closed && !p2.closed && !closed1 && !closed2) {
             const state = statesRef.current ? statesRef.current.get(p1.country) : null;
             let infected = false;
             let vaccine = false;
             if (state && state.vaccineAvailable && Math.random() < 0.4) vaccine = true;
             
             if (state && state.I > 0) {
               const N = state.S + state.E + state.I + state.R + state.D;
               const waterMult = paramsRef.current ? 1 + (paramsRef.current.waterImmunity || 0) * 10 : 1;
               if (Math.random() < (1 - Math.exp(-state.I / 50000)) * waterMult) infected = true;
             }
             // Use STRAIGHT LINE for ships (no bezier) to avoid cutting through land
             vehiclesRef.current.push({
               type: 'ship', startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,
               endCountry: p2.country,
               progress: 0, 
               speed: 0.0005 + Math.random() * 0.0005,
               infected, vaccine, lastTrailProg: 0
             });
          }
        } else {
          let pair = routes.flights[Math.floor(Math.random() * routes.flights.length)];
          if (statesRef.current) {
             for(let tries=0; tries<15; tries++) {
                 const testA = activeAirports.find(a => a.id === pair[0]);
                 if (testA && statesRef.current.get(testA.country)?.I > 500) break;
                 pair = routes.flights[Math.floor(Math.random() * routes.flights.length)];
             }
          }
          const a1 = activeAirports.find(a => a.id === pair[0]);
          const a2 = activeAirports.find(a => a.id === pair[1]);
          
          const s1 = statesRef.current ? statesRef.current.get(a1.country) : null;
            const s2 = statesRef.current ? statesRef.current.get(a2.country) : null;
            const closed1 = s1 && s1.I > (s1.S + s1.E + s1.I + s1.R) * 0.2;
            const closed2 = s2 && s2.I > (s2.S + s2.E + s2.I + s2.R) * 0.2;
            if (a1 && a2 && !a1.closed && !a2.closed && !closed1 && !closed2) {
             const state = statesRef.current ? statesRef.current.get(a1.country) : null;
             let infected = false;
             let vaccine = false;
             if (state && state.vaccineAvailable && Math.random() < 0.4) vaccine = true;
             
             if (state && state.I > 0) {
               const N = state.S + state.E + state.I + state.R + state.D;
               const airMult = paramsRef.current ? 1 + (paramsRef.current.airImmunity || 0) * 10 : 1;
               if (Math.random() < (1 - Math.exp(-state.I / 50000)) * airMult) infected = true;
             }
             const dx = a2.x - a1.x;
             const dy = a2.y - a1.y;
             // Flights use bezier curves (arcs in the sky are fine)
             vehiclesRef.current.push({
               type: 'flight', startX: a1.x, startY: a1.y, endX: a2.x, endY: a2.y,
               endCountry: a2.country,
               cx: a1.x + dx * 0.5 - dy * 0.2, cy: a1.y + dy * 0.5 + dx * 0.2, 
               progress: 0, 
               speed: 0.001 + Math.random() * 0.001,
               infected, vaccine, lastTrailProg: 0
             });
          }
        }
      }

        }
        // 4. DRAW AND UPDATE VEHICLES
      
        let activeVehicles = [];
        for (let i = 0; i < vehiclesRef.current.length; i++) {
          const v = vehiclesRef.current[i];
          if (runningRef.current) v.progress += v.speed;

          if (v.progress >= 1) {
            // Infect destination
            if (v.infected && inboundInfectionsRef && inboundInfectionsRef.current) {
                // inboundInfectionsRef.current.push({ countryId: v.endCountry, amount: 10 }); // Disabled so math core drives spread
            }
            continue; // Do not push to activeVehicles, thus removing it
          }

          activeVehicles.push(v);

          const t = v.progress;
          let x, y, angle;
          
          if (v.type === 'ship') {
            // Ships use LINEAR interpolation (straight line between ports)
            x = v.startX + (v.endX - v.startX) * t;
            y = v.startY + (v.endY - v.startY) * t;
            angle = Math.atan2(v.endY - v.startY, v.endX - v.startX);
          } else {
            // Flights use quadratic bezier (arced path)
            const mt = 1 - t;
            x = mt * mt * v.startX + 2 * mt * t * v.cx + t * t * v.endX;
            y = mt * mt * v.startY + 2 * mt * t * v.cy + t * t * v.endY;
            const dx = 2 * mt * (v.cx - v.startX) + 2 * t * (v.endX - v.cx);
            const dy = 2 * mt * (v.cy - v.startY) + 2 * t * (v.endY - v.cy);
            angle = Math.atan2(dy, dx);
          }

          // Draw permanent trail onto offscreen canvas
          if (t - v.lastTrailProg > 0.02) {
            tCtx.fillStyle = v.vaccine ? 'rgba(0, 255, 255, 0.4)' : (v.infected ? 'rgba(255, 0, 50, 0.4)' : (v.type === 'ship' ? 'rgba(136, 204, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)'));
            tCtx.beginPath();
            tCtx.arc(x, y, v.infected || v.vaccine ? 1.5 : 1, 0, Math.PI * 2);
            tCtx.fill();
            if (v.infected) {
               tCtx.shadowColor = '#ff0033';
               tCtx.shadowBlur = 4;
               tCtx.fill();
               tCtx.shadowBlur = 0;
            } else if (v.vaccine) {
               tCtx.shadowColor = '#00ffff';
               tCtx.shadowBlur = 4;
               tCtx.fill();
               tCtx.shadowBlur = 0;
            }
            v.lastTrailProg = t;
          }

          if (v.type === 'flight') {
            // drawAirplane inline instead of calling external function so we can use v.vaccine
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillStyle = v.vaccine ? 'rgba(0, 255, 255, 0.9)' : (v.infected ? 'rgba(255, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)');
            ctx.beginPath();
            ctx.moveTo(3, 0);
            ctx.lineTo(-2, 2);
            ctx.lineTo(-2, -2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          } else {
            // drawShip inline
            ctx.fillStyle = v.vaccine ? 'rgba(0, 255, 255, 0.9)' : (v.infected ? 'rgba(255, 50, 50, 0.9)' : 'rgba(100, 200, 255, 0.7)');
            ctx.fillRect(x - 1, y - 1, 2, 2);
          }
        }
        vehiclesRef.current = activeVehicles;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [geoData]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </div>
  );
}
