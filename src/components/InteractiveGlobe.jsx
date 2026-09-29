import React, { useEffect, useRef, useState } from 'react';
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

export default function InteractiveGlobe({ onLaunch, setSeedCountry }) {
  const svgRef = useRef(null);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json')
      .then(r => r.json())
      .then(d => {
        const features = topojson.feature(d, d.objects.countries).features;
        setData(features);
      });
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 600;
    const projection = d3.geoOrthographic()
      .scale(280)
      .translate([width/2, height/2])
      .clipAngle(90);
    const path = d3.geoPath().projection(projection);

    const getSimCountry = (name) => {
      const mapped = nameMap[name] || name;
      return simCountries.find(c => c.name.includes(mapped) || mapped.includes(c.name));
    };

    // Sphere
    svg.selectAll('.sphere').data([1]).join('path')
      .attr('class', 'sphere')
      .attr('d', path({type: 'Sphere'}))
      .attr('fill', 'rgba(5, 6, 18, 0.9)')
      .attr('stroke', 'rgba(255,255,255,0.05)');

    // Graticule
    const graticule = d3.geoGraticule10();
    svg.selectAll('.graticule').data([1]).join('path')
      .attr('class', 'graticule')
      .attr('d', path(graticule))
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.03)');

    // Countries
    svg.selectAll('.country').data(data).join('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', d => getSimCountry(d.properties.name) ? 'rgba(30, 35, 55, 0.8)' : 'rgba(15, 18, 30, 0.6)')
      .attr('stroke', 'rgba(150, 160, 190, 0.2)')
      .attr('stroke-width', 0.5)
      .on('mouseover', function(e, d) {
         const simC = getSimCountry(d.properties.name);
         if (simC) {
           d3.select(this)
             .attr('fill', 'rgba(229, 9, 47, 0.5)')
             .attr('stroke', 'rgba(255, 70, 95, 0.9)');
         }
      })
      .on('mouseout', function(e, d) {
         const simC = getSimCountry(d.properties.name);
         d3.select(this)
           .attr('fill', simC ? 'rgba(30, 35, 55, 0.8)' : 'rgba(15, 18, 30, 0.6)')
           .attr('stroke', 'rgba(150, 160, 190, 0.2)');
      })
      .on('dblclick', function(e, d) {
         const simC = getSimCountry(d.properties.name);
         if (!simC) return;
         
         const centroid = d3.geoCentroid(d);
         
         // 1. Rotate
         d3.transition().duration(800).tween('rotate', () => {
           const r = d3.interpolate(projection.rotate(), [-centroid[0], -centroid[1], 0]);
           return (t) => {
             projection.rotate(r(t));
             svg.selectAll('.country').attr('d', path);
             svg.selectAll('.graticule').attr('d', path(graticule));
           };
         }).on('end', () => {
           // 2. Zoom & Fade Out
           d3.transition().duration(600).tween('scale', () => {
             const s = d3.interpolate(projection.scale(), 1200);
             return (t) => {
               projection.scale(s(t));
               svg.selectAll('.country').attr('d', path);
               svg.selectAll('.graticule').attr('d', path(graticule));
               svg.style('opacity', 1 - t);
             }
           }).on('end', () => {
             setSeedCountry(simC.id);
             onLaunch();
           });
         });
      });

    // Drag behavior
    let v0, r0;
    const drag = d3.drag()
      .on('start', (e) => {
        v0 = [e.x, e.y];
        r0 = projection.rotate();
      })
      .on('drag', (e) => {
        const v1 = [e.x, e.y];
        const rot = [r0[0] + (v1[0] - v0[0]) * 0.5, r0[1] - (v1[1] - v0[1]) * 0.5, r0[2]];
        projection.rotate(rot);
        svg.selectAll('.country').attr('d', path);
        svg.selectAll('.graticule').attr('d', path(graticule));
      });
    
    svg.call(drag);

    // Auto rotate
    const timer = d3.timer(() => {
       if (!v0) {
         const rot = projection.rotate();
         projection.rotate([rot[0] + 0.1, rot[1], rot[2]]);
         svg.selectAll('.country').attr('d', path);
         svg.selectAll('.graticule').attr('d', path(graticule));
       }
    });

    return () => timer.stop();
  }, [data, onLaunch, setSeedCountry]);

  return (
    <div className="globe-container">
      <svg ref={svgRef} width="600" height="600" viewBox="0 0 600 600" style={{cursor: 'grab'}} />
    </div>
  );
}
