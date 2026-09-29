import fs from 'fs';
let css = fs.readFileSync('src/App.css', 'utf8');

const marker = "/* Remove old top bar styles */";
const idx = css.indexOf(marker);
if (idx > -1) {
  css = css.substring(0, idx);
}

const newStyles = `
/* FIXED TOP BAR STYLES */
.hud-top-bar {
  position: absolute;
  top: 2rem; 
  left: 2rem; 
  right: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
  z-index: 20;
}

.global-status-wrapper {
  pointer-events: auto;
  width: 60%;
  max-width: 800px;
}
.global-status-label {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 1px;
  color: var(--soft);
  margin-bottom: 1rem;
}

.hud-day-counter { 
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
  letter-spacing: 1px;
}
.hud-day-value {
  font-family: var(--font-mono);
  color: var(--ink);
  font-size: 24px;
  font-weight: 700;
}

/* Remove old stats component entirely */
.hud-stat-cards { display: none !important; }

/* Epidemic curves wrapper styling */
.hud-chart-wrapper {
  width: 100%;
  margin-top: 1rem;
}
`;

fs.writeFileSync('src/App.css', css + newStyles);
console.log("App.css fixed");
