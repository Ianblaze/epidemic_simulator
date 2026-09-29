import fs from 'fs';

let css = fs.readFileSync('src/App.css', 'utf8');

// Append new root variables
const newRootVars = `
  --s: var(--cyan);
  --e: var(--yellow);
  --i: var(--red);
  --r: var(--purple);
  --d: var(--grey);
  --panel: rgba(10, 15, 30, 0.85);
  --rule: rgba(255, 255, 255, 0.15);
  --ink: #ffffff;
  --soft: rgba(255, 255, 255, 0.6);
`;
css = css.replace(':root {', ':root {\n' + newRootVars);

// Append new UI classes
const newStyles = `
/* REDESIGN PASS */
.stack { display:flex; height:34px; border-radius:6px; overflow:hidden; }
.seg { height:100%; transition:width 0.3s ease; }
.legend { display:flex; flex-wrap:wrap; gap:18px; margin-top:14px; }
.legend div { display:flex; align-items:center; gap:7px; font-size:13px; color:var(--soft); }
.legend b { color:var(--ink); font-weight:600; font-size:15px; }
.swatch { width:9px; height:9px; border-radius:2px; display:inline-block; }

.panel-primary {
  background: var(--panel);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 22px 24px;
  box-shadow: 0 0 0 1px rgba(255,255,255,.02), 0 20px 40px -20px rgba(0,0,0,.6);
  pointer-events: auto;
  margin-bottom: 2rem;
}

.panel-secondary {
  border-top: 1px solid var(--rule);
  padding-top: 1.5rem;
  margin-bottom: 2rem;
  pointer-events: auto;
}

/* Overriding old header */
.hud-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.hud-card-title {
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 14px;
  color: var(--soft);
}
.hud-card-title.primary {
  color: var(--ink);
  font-weight: 600;
  font-size: 16px;
}

.param { margin-bottom:22px; }
.param:last-child { margin-bottom:0; }
.paramtop { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
.paramtop span { font-size:13px; color:var(--soft); }
.paramtop b { font-size:19px; font-weight:700; color:var(--ink); font-variant-numeric:tabular-nums; }

input[type=range].slider-new {
  width:100%; 
  -webkit-appearance:none; 
  height:3px; 
  border-radius:2px; 
  background:var(--rule); 
  outline:none;
}
input[type=range].slider-new::-webkit-slider-thumb {
  -webkit-appearance:none; 
  width:14px; 
  height:14px; 
  border-radius:50%;
  background:var(--ink); 
  cursor:pointer; 
  box-shadow:0 0 0 3px var(--panel);
}
.sev::-webkit-slider-runnable-track { background:linear-gradient(90deg,var(--e),var(--i)); height:3px; border-radius:2px; }
.time::-webkit-slider-runnable-track { background:linear-gradient(90deg,#2A3B55,var(--s)); height:3px; border-radius:2px; }

/* Remove old top bar styles */
.hud-stat-cards { display: none !important; }

/* Move day counter */
.hud-day-counter { 
  position: absolute; 
  top: 2rem; 
  right: 2.5rem; 
  display: flex; 
  flex-direction: column; 
  align-items: flex-end;
  pointer-events: auto;
}
.hud-day-label {
  font-family: var(--font-sans);
  color: var(--soft);
  font-size: 12px;
  font-weight: 500;
}
.hud-day-value {
  font-family: var(--font-mono);
  color: var(--ink);
  font-size: 24px;
  font-weight: 700;
}
`;

fs.writeFileSync('src/App.css', css + newStyles);
console.log("App.css updated");
