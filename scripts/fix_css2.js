import fs from 'fs';

let css = fs.readFileSync('src/App.css', 'utf8');

// 1. Fix .hud-panel height and overflow
css = css.replace(
  /\.hud-panel\s*\{[^}]+\}/,
  `.hud-panel {
  position: absolute;
  top: 150px;
  bottom: 2rem;
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  pointer-events: none;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}
.hud-panel::-webkit-scrollbar { width: 4px; }
.hud-panel::-webkit-scrollbar-thumb { background: var(--rule); border-radius: 2px; }`
);

// 2. Erase the old .hud-day-counter with background and border so it doesn't look cramped
css = css.replace(
  /\.hud-day-counter\s*\{[\s\S]*?min-width:\s*150px;\s*\}/,
  `.hud-day-counter-old { display: none; }`
);

// 3. Make sure .panel-primary / secondary have flex-shrink: 0
css = css.replace(
  /\.panel-primary\s*\{/,
  `.panel-primary {\n  flex-shrink: 0;`
);
css = css.replace(
  /\.panel-secondary\s*\{/,
  `.panel-secondary {\n  flex-shrink: 0;`
);

fs.writeFileSync('src/App.css', css);
console.log("App.css fixed again");
