import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useTexture, OrbitControls, Stars, shaderMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import simCountries from '../data/countries.js';

// ----------------------------------------------------
// Cinematic Audio Engine
// ----------------------------------------------------
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.droneGain = null;
    this.initialized = false;
  }
  
  init() {
    if (this.initialized) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!AudioContext) return;
    this.ctx = new AudioContext();
    this.initialized = true;
    
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0.0;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;
    
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55;
    
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = 54.5;
    
    osc1.connect(this.droneGain);
    osc2.connect(this.droneGain);
    this.droneGain.connect(filter);
    filter.connect(this.ctx.destination);
    
    osc1.start();
    osc2.start();
    
    this.droneGain.gain.setTargetAtTime(0.2, this.ctx.currentTime, 2.0);
  }
  
  playImpact() {
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    
    if (this.droneGain) {
       this.droneGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.1);
    }
    
    const impactGain = this.ctx.createGain();
    impactGain.connect(this.ctx.destination);
    impactGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
    impactGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.0);
    
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.5);
    
    osc.connect(impactGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 2.0);
    
    const bufferSize = this.ctx.sampleRate * 2.0;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(50, this.ctx.currentTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(4000, this.ctx.currentTime + 0.3);
    noiseFilter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 1.8);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.0);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start();
  }
}
const audio = new AudioEngine();

// ----------------------------------------------------
// Custom Shaders
// ----------------------------------------------------
const AtmosphereMaterial = shaderMaterial(
  { glowColor: new THREE.Color(0.2, 0.8, 1.5), power: 3.5, opacity: 0.7 }, 
  `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `uniform vec3 glowColor; uniform float power; uniform float opacity; varying vec3 vNormal; void main() { float intensity = pow(max(0.0, -dot(vNormal, vec3(0.0, 0.0, 1.0))), power); gl_FragColor = vec4(glowColor, intensity * opacity); }`
);

const RimMaterial = shaderMaterial(
  { color: new THREE.Color(0.5, 1.0, 2.0), power: 3.0, opacity: 0.5 }, 
  `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `uniform vec3 color; uniform float power; uniform float opacity; varying vec3 vNormal; void main() { float intensity = pow(max(0.0, 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0))), power); gl_FragColor = vec4(color, intensity * opacity); }`
);

const NebulaMaterial = shaderMaterial(
  { uTime: 0 },
  `varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `uniform float uTime; varying vec3 vPos;
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy ); vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
      i = mod289(i); 
      vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy ); vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m; return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }
  float fbm(vec3 x) {
      float v = 0.0; float a = 0.5; vec3 shift = vec3(100.0);
      for (int i = 0; i < 2; ++i) { v += a * snoise(x); x = x * 2.0 + shift; a *= 0.5; }
      return v;
  }
  void main() {
      vec3 p = normalize(vPos) * 2.0; 
      vec3 q = vec3(snoise(p + vec3(uTime * 0.1, 0.0, 0.0)), snoise(p + vec3(0.0, uTime * 0.08, 0.0)), 0.0);
      float gas = fbm(p + q * 1.0) * 0.5 + 0.5;
      vec3 color = mix(vec3(0.01, 0.015, 0.04), vec3(0.08, 0.04, 0.16), smoothstep(0.1, 0.4, gas));
      color = mix(color, vec3(0.06, 0.10, 0.30), smoothstep(0.3, 0.6, gas));
      color = mix(color, vec3(0.08, 0.20, 0.40), smoothstep(0.5, 0.8, gas));
      color = mix(color, vec3(0.12, 0.35, 0.50), smoothstep(0.7, 1.0, gas));
      color += smoothstep(0.7, 1.0, snoise(p * 35.0)) * vec3(0.9, 0.9, 1.0) * 0.6;
      gl_FragColor = vec4(color, 1.0);
  }`
);
extend({ AtmosphereMaterial, RimMaterial, NebulaMaterial });

function ProceduralNebula() {
  const ref = useRef();
  useFrame((state) => { if (ref.current) ref.current.uTime = state.clock.elapsedTime * 0.1; });
  return <mesh position={[0,0,0]}><sphereGeometry args={[120,48,48]}/><nebulaMaterial ref={ref} depthWrite={false} side={THREE.BackSide} /></mesh>;
}

// ----------------------------------------------------
// Texture Generators & Background Elements
// ----------------------------------------------------
const createGlow = () => {
  const c = document.createElement('canvas'); c.width = 128; c.height = 128;
  const ctx = c.getContext('2d'); const g = ctx.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.1, 'rgba(255,255,255,0.8)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.2)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,128,128); return new THREE.CanvasTexture(c);
};
const createStar = () => {
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const ctx = c.getContext('2d'); const g = ctx.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0, 'rgba(255,255,255,1.0)'); g.addColorStop(0.1, 'rgba(255,255,255,0.8)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.3)'); g.addColorStop(1, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,64,64); return new THREE.CanvasTexture(c);
};

function ScatteredNebulas() {
  const tex = useMemo(createGlow, []);
  const nebs = useMemo(() => {
     const arr = []; const cols = ['#9d4edd','#ff006e','#00f5d4','#3a0ca3','#4361ee']; 
     for(let i=0; i<30; i++) {
        const u = Math.random(); const v = Math.random();
        const th = u * 2.0 * Math.PI; const ph = Math.acos(2.0 * v - 1.0);
        const r = 50 + Math.random() * 40; 
        arr.push({ pos: [r*Math.sin(ph)*Math.cos(th), r*Math.sin(ph)*Math.sin(th), r*Math.cos(ph)],
           scale: 40 + Math.random() * 60, color: cols[Math.floor(Math.random() * cols.length)], op: 0.15 + Math.random() * 0.25 });
     } return arr;
  }, []);
  return <group>{nebs.map((n, i) => <sprite key={i} position={n.pos} scale={n.scale}><spriteMaterial map={tex} color={n.color} transparent opacity={n.op} blending={THREE.AdditiveBlending} depthWrite={false} /></sprite>)}</group>;
}

function ShiningStars() {
  const tex = useMemo(createStar, []);
  const refs = useRef([]);
  const rPos = () => {
      const u = Math.random(); const v = Math.random();
      const th = u * 2.0 * Math.PI; const ph = Math.acos(2.0 * v - 1.0);
      const r = 80 + Math.random() * 40; 
      return [r*Math.sin(ph)*Math.cos(th), r*Math.sin(ph)*Math.sin(th), r*Math.cos(ph)];
  };
  const data = useRef(Array.from({ length: 40 }).map(() => ({
      p: Math.random(), s: 0.05 + Math.random() * 0.1, sc: 0.5 + Math.random() * 1.5, pos: rPos(),
      c: Math.random() > 0.85 ? new THREE.Color(2.0,2.5,4.0) : new THREE.Color(3.0,3.0,3.0)
  })));
  useFrame((state, delta) => {
      refs.current.forEach((sp, i) => {
          if(!sp) return; const d = data.current[i]; d.p += delta * d.s;
          if (d.p >= 1.0) { d.p = 0; d.pos = rPos(); sp.position.set(...d.pos); d.sc = 0.5 + Math.random() * 1.5; d.s = 0.05 + Math.random() * 0.1; }
          const int = Math.sin(d.p * Math.PI); sp.scale.setScalar(d.sc * int); sp.material.opacity = int;
      });
  });
  return <group>{data.current.map((s, i) => <sprite key={i} position={s.pos} ref={el => refs.current[i] = el}><spriteMaterial map={tex} color={s.c} transparent blending={THREE.AdditiveBlending} depthWrite={false} /></sprite>)}</group>;
}

function AsteroidField() {
  const refs = useRef([]);
  const ast = useMemo(() => {
     const arr = []; const cols = ['#4a4a52','#3d3d45','#524e4a','#2b2b30'];
     for(let i=0; i<15; i++) {
        const th = Math.random() * Math.PI * 2; const y = (Math.random() - 0.5) * 25; const r = 25 + Math.random() * 25; 
        arr.push({ pos: [Math.cos(th) * r, y, Math.sin(th) * r - 10], rot: [Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI],
           sc: 0.1 + Math.random() * 0.5, c: cols[Math.floor(Math.random() * cols.length)], speed: { rot: [(Math.random()-0.5)*1.0, (Math.random()-0.5)*1.0, (Math.random()-0.5)*1.0], move: (Math.random() - 0.5) * 0.3 } });
     } return arr;
  }, []);
  useFrame((st, d) => {
     refs.current.forEach((m, i) => {
        if(!m) return; const dat = ast[i];
        m.rotation.x += dat.speed.rot[0] * d; m.rotation.y += dat.speed.rot[1] * d; m.rotation.z += dat.speed.rot[2] * d;
        m.position.x += Math.sin(st.clock.elapsedTime * 0.05 + i) * dat.speed.move * d * 5;
        m.position.z += Math.cos(st.clock.elapsedTime * 0.05 + i) * dat.speed.move * d * 5;
     });
  });
  return <group>{ast.map((a, i) => <mesh key={i} position={a.pos} rotation={a.rot} scale={a.sc} ref={el => refs.current[i] = el}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={a.c} roughness={1.0} metalness={0.1} flatShading={true} /></mesh>)}</group>;
}

function MeteorShowers() {
  const refs = useRef([]);
  const met = useMemo(() => Array.from({ length: 4 }).map(() => ({ a: false, pos: [0,0,0], p: 0, s: 0, v: [0,0], rZ: 0 })), []);
  useEffect(() => {
     const int = setInterval(() => {
        const i = met.findIndex(m => !m.a);
        if (i !== -1 && Math.random() > 0.4) { 
           const m = met[i]; m.a = true; m.p = 0;
           const sX = (Math.random() > 0.5 ? 35 : -35) + (Math.random() - 0.5) * 10;
           const sY = 25 + Math.random() * 10; const sZ = -50 - Math.random() * 30; 
           const tX = (Math.random() - 0.5) * 20; const tY = -25 - Math.random() * 10;
           const ang = Math.atan2(tY - sY, tX - sX); 
           m.pos = [sX, sY, sZ]; m.v = [Math.cos(ang), Math.sin(ang)]; m.s = 10 + Math.random() * 15; m.rZ = ang + Math.PI / 2; 
        }
     }, 2500); return () => clearInterval(int);
  }, [met]);
  useFrame((st, d) => {
     refs.current.forEach((g, i) => {
        if(!g) return; const m = met[i];
        if (m.a) {
           g.visible = true; m.pos[0] += m.v[0] * m.s * d; m.pos[1] += m.v[1] * m.s * d;
           g.position.set(...m.pos); g.rotation.z = m.rZ; m.p += d * 0.4;
           const op = Math.max(0, 1.0 - m.p); g.children.forEach(ch => ch.material.opacity = op * 0.9);
           if (m.p > 1.0) { m.a = false; g.visible = false; }
        } else { g.visible = false; }
     });
  });
  return <group>{met.map((m, i) => <group key={i} ref={el => refs.current[i] = el} visible={false}>
     <mesh><sphereGeometry args={[0.15, 16, 16]} /><meshBasicMaterial color={new THREE.Color(4.0, 4.0, 4.0)} transparent blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
     <mesh position={[0, 4.0, 0]}><cylinderGeometry args={[0.0, 0.15, 8, 16]} /><meshBasicMaterial color={new THREE.Color(0.5, 2.0, 5.0)} transparent blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
  </group>)}</group>;
}

// ----------------------------------------------------
// D3 Country Highlighting Logic
// ----------------------------------------------------
function useCountryGeometry() {
  const [geoData, setGeoData] = useState(null);
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json').then(r => r.json()).then(d => {
        setGeoData(topojson.feature(d, d.objects.countries).features);
    });
  }, []);
  return geoData;
}

// ----------------------------------------------------
// High-Fidelity Main Earth
// ----------------------------------------------------
function Earth({ gameMode, isTransitioning, layoutMode, onEnter, seedCountry, setSeedCountry, onHoveredCountryChange }) {
  const earthGroup = useRef(); const surfaceGroup = useRef(); const cloudsMesh = useRef();
  const geoData = useCountryGeometry();
    const targetRotation = useRef(null);
    useEffect(() => {
       if (seedCountry && geoData) {
           const sc = simCountries.find(c => c.id === seedCountry);
           if (sc) {
              const feature = geoData.find(f => f.properties.name === sc.name);
              if (feature) {
                  const centroid = d3.geoCentroid(feature); // [lon, lat]
                  const lon = centroid[0];
                  const lat = centroid[1];
                  targetRotation.current = { 
                     y: -(lon * 0.0174533) - 1.5708,
                     x: (lat * 0.0174533)
                  };
              }
           }
       }
    }, [seedCountry, geoData]);

  
  const textures = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', 'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://unpkg.com/three-globe/example/img/earth-water.png', 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://unpkg.com/three-globe/example/img/earth-night.jpg'
  ]);
  const [colorMap, normalMap, specularMap, cloudsMap, nightMap] = textures;
  const highlightCanvas = useMemo(() => {
     const c = document.createElement('canvas');
     c.width = 1024; c.height = 512;
     return c;
  }, []);

  const highlightTex = useMemo(() => {
     const tex = new THREE.CanvasTexture(highlightCanvas);
     tex.anisotropy = 8; // reduced from 16 for performance
     return tex;
  }, [highlightCanvas]);

  useMemo(() => {
      textures.forEach(t => { t.anisotropy = 8; t.generateMipmaps = true; });
      colorMap.colorSpace = THREE.SRGBColorSpace; nightMap.colorSpace = THREE.SRGBColorSpace;
  }, [textures]);

  const [hovered, setHover] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
     const initAudio = () => audio.init();
     window.addEventListener('pointermove', initAudio, { once: true }); window.addEventListener('click', initAudio, { once: true });
     return () => { window.removeEventListener('pointermove', initAudio); window.removeEventListener('click', initAudio); };
  }, []);

  useEffect(() => {
    if (!geoData) return;
    const activeId = hoveredCountry || seedCountry;
    const ctx = highlightCanvas.getContext('2d');
    ctx.clearRect(0, 0, 1024, 512);

    if (activeId) {
      const feature = geoData.find(f => {
         const sc = simCountries.find(c => c.name === f.properties.name);
         return sc && sc.id === activeId;
      });
      if (feature) {
         // Scale down projection for 1024x512 (162.9745 scale, [512, 256] translation)
         const projection = d3.geoEquirectangular().translate([512, 256]).scale(162.9745);
         const path = d3.geoPath().projection(projection).context(ctx);
         ctx.fillStyle = activeId === hoveredCountry ? 'rgba(0, 245, 212, 0.4)' : 'rgba(255, 0, 110, 0.4)';
         ctx.strokeStyle = activeId === hoveredCountry ? 'rgba(0, 245, 212, 0.9)' : 'rgba(255, 0, 110, 0.9)';
         ctx.lineWidth = 1.0; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
         ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 8;
         ctx.beginPath(); path(feature); ctx.fill(); ctx.stroke();
         ctx.shadowBlur = 0;
      }
    }
    highlightTex.needsUpdate = true;
  }, [hoveredCountry, seedCountry, geoData, highlightCanvas, highlightTex]);

  const lastCheck = useRef(0);

  const handlePointerMove = (e) => {
    if (isTransitioning || layoutMode !== 'hud' || !geoData) return;
    
    // Throttle the heavy D3 math to a maximum of 20 times per second
    const now = performance.now();
    if (now - lastCheck.current < 50) return;
    
    if (e.intersections.length > 0) {
       const hit = e.intersections.find(i => i.object.geometry.type === 'SphereGeometry' && i.object.material.type === 'MeshPhysicalMaterial');
       if (!hit) return;

       lastCheck.current = now;
       
       const uv = hit.uv; 
       const lon = (uv.x * 360) - 180; 
       const lat = (uv.y * 180) - 90;
       
       let found = null;
       // Quick bounding box check could optimize this further, but 50ms throttle is usually enough
       for (const f of geoData) {
          if (d3.geoContains(f, [lon, lat])) {
             const sc = simCountries.find(c => c.name === f.properties.name);
             if (sc) found = sc.id; break;
          }
       }
       setHoveredCountry(found); document.body.style.cursor = found ? 'crosshair' : 'grab';
    }
  };

  const handlePointerOut = () => { setHover(false); setHoveredCountry(null); document.body.style.cursor = 'auto'; };
  const handleClick = (e) => {
     if (layoutMode === 'center') { audio.playImpact(); onEnter(e); } 
     else if (layoutMode === 'hud' && hoveredCountry && setSeedCountry) { if (gameMode !== 'DOOMSDAY') setSeedCountry(hoveredCountry); }
  };

  useFrame((state, delta) => {
    if (!earthGroup.current || !surfaceGroup.current || !cloudsMesh.current) return;
    if (isTransitioning) { surfaceGroup.current.rotation.y += delta * 0.015; } 
    else if (layoutMode === 'center') {
       const rotSpeed = hovered ? 0.01 : 0.02; 
       surfaceGroup.current.rotation.y += delta * rotSpeed; 
       cloudsMesh.current.rotation.y += delta * (rotSpeed * 1.8);
    } 
    else if (layoutMode === 'hud') { 
         cloudsMesh.current.rotation.y += delta * 0.02; 
         if (targetRotation.current) {
             surfaceGroup.current.rotation.y = THREE.MathUtils.lerp(surfaceGroup.current.rotation.y, targetRotation.current.y, 0.05);
             surfaceGroup.current.rotation.x = THREE.MathUtils.lerp(surfaceGroup.current.rotation.x, targetRotation.current.x, 0.05);
         } else {
             surfaceGroup.current.rotation.y += delta * 0.005; 
         }
      }
    const targetScale = hovered && layoutMode === 'center' && !isTransitioning ? 1.015 : 1.0;
    earthGroup.current.scale.setScalar(THREE.MathUtils.lerp(earthGroup.current.scale.x, targetScale, 0.05));
  });

  return (
    <group ref={earthGroup} onClick={handleClick} onPointerMove={handlePointerMove} onPointerOver={() => layoutMode === 'center' && setHover(true)} onPointerOut={handlePointerOut} position={[0, 0.5, 0]}>
      <group ref={surfaceGroup}>
        <mesh>
          <sphereGeometry args={[1, 128, 128]} />
          <meshPhysicalMaterial map={colorMap} bumpMap={normalMap} bumpScale={0.015} roughness={0.7} metalnessMap={specularMap} metalness={0.4} clearcoat={0.05} emissiveMap={nightMap} emissive={new THREE.Color(0xffffee)} emissiveIntensity={hovered && layoutMode === 'center' ? 0.5 : 0.3} />
        </mesh>
        {highlightTex && (
           <mesh scale={1.002}>
              <sphereGeometry args={[1, 128, 128]} />
              <meshBasicMaterial map={highlightTex} transparent blending={THREE.AdditiveBlending} depthTest={true} depthWrite={false} />
           </mesh>
        )}
      </group>
      <mesh ref={cloudsMesh}>
         <sphereGeometry args={[1.012, 128, 128]} />
         <meshStandardMaterial map={cloudsMap} alphaMap={cloudsMap} transparent={true} opacity={0.8} blending={THREE.NormalBlending} depthWrite={false} roughness={0.9} />
      </mesh>
      <mesh scale={1.002}><sphereGeometry args={[1, 128, 128]} /><rimMaterial color={new THREE.Color(0.5, 1.2, 2.5)} power={4.0} opacity={0.6} transparent blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      <mesh scale={1.12}><sphereGeometry args={[1, 128, 128]} /><atmosphereMaterial glowColor={new THREE.Color(0.2, 0.8, 1.5)} power={3.5} opacity={0.6} transparent blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} /></mesh>
    </group>
  );
}

// ----------------------------------------------------
// Main Scene Camera & Controls
// ----------------------------------------------------
function CameraAndControls({ layoutMode, isTransitioning }) {
  const controlsRef = useRef();
  

  const [zoomTarget, setZoomTarget] = useState(null);

  useEffect(() => {
     if (isTransitioning) setZoomTarget(2.5);
     else if (layoutMode === 'hud') setZoomTarget(4.2);
     else setZoomTarget(5.5);
  }, [layoutMode, isTransitioning]);

  useFrame((state) => {
     if (zoomTarget !== null) {
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, zoomTarget, 0.05);
        if (controlsRef.current) controlsRef.current.update();
        
        if (Math.abs(state.camera.position.z - zoomTarget) < 0.02) {
            state.camera.position.z = zoomTarget;
            if (controlsRef.current) controlsRef.current.update();
            setZoomTarget(null); // Release control! Let OrbitControls take over.
        }
     }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enableZoom={true}
      minDistance={1.2}  
      maxDistance={15.0} 
      enablePan={false} 
      rotateSpeed={0.5} 
      zoomSpeed={1.5}    
      autoRotate={false} 
    />
  );
}

export default function CinematicEarth({ gameMode, isTransitioning, onEnter, layoutMode, seedCountry, setSeedCountry, onHoveredCountryChange }) {
  return (
     <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <CameraAndControls layoutMode={layoutMode} isTransitioning={isTransitioning} />
        <ambientLight intensity={0.5} color="#cce6ff" />
        <hemisphereLight skyColor="#ffffff" groundColor="#001133" intensity={0.8} />
        <directionalLight position={[10, 5, 5]} intensity={3.5} color="#ffffff" castShadow />
        <directionalLight position={[-5, -5, -2]} intensity={1.5} color="#5588ff" />
        <EffectComposer disableNormalPass multisampling={0}><Bloom luminanceThreshold={1.0} luminanceSmoothing={0.3} intensity={1.5} mipmapBlur /><Noise opacity={0.035} /></EffectComposer>
        <Stars radius={80} depth={15} count={4000} factor={4} saturation={1.0} fade speed={0.15} />
        
        <ProceduralNebula />
        <ScatteredNebulas />
        <ShiningStars />
        <AsteroidField />
        <MeteorShowers />
        
        <Suspense fallback={null}><Earth gameMode={gameMode} isTransitioning={isTransitioning} onEnter={onEnter} layoutMode={layoutMode} seedCountry={seedCountry} setSeedCountry={setSeedCountry} onHoveredCountryChange={onHoveredCountryChange} /></Suspense>
     </Canvas>
  );
}
