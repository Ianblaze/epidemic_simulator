import fs from 'fs';

let css = fs.readFileSync('src/App.css', 'utf8');

const newStyles = `
/* PLAGUE INC STYLE LAYOUT */
.plague-layout {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 20;
}

.plague-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 2rem;
  pointer-events: auto;
}

.plague-news-ticker {
  background: rgba(10, 15, 30, 0.95);
  border: 1px solid var(--rule);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  width: 50%;
  max-width: 600px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}
.ticker-label {
  font-weight: 800;
  color: var(--s);
  margin-right: 1rem;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
}
.ticker-text {
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.plague-date-block {
  background: rgba(10, 15, 30, 0.95);
  border: 1px solid var(--rule);
  border-radius: 4px;
  padding: 0.75rem 2rem;
  font-family: var(--font-mono);
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.plague-bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem 2rem;
  pointer-events: auto;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.plague-nav-btn {
  background: rgba(20, 25, 40, 0.95);
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 1rem 3rem;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.2s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}
.plague-nav-btn:hover {
  background: rgba(40, 45, 60, 0.95);
  border-color: #fff;
}
.plague-nav-btn.disease-btn { border-bottom: 4px solid var(--red); color: var(--red); }
.plague-nav-btn.data-btn { border-bottom: 4px solid var(--cyan); color: var(--cyan); }
.plague-nav-btn.active { background: rgba(50, 55, 75, 0.95); border-color: #fff; }

.plague-status-center {
  flex: 1;
  margin: 0 2rem;
  background: rgba(10, 15, 30, 0.95);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}
.compact-stack { width: 100%; height: 16px; border-radius: 3px; }
.compact-legend { 
  display: flex; 
  gap: 3rem; 
  font-family: var(--font-mono); 
  font-size: 1rem; 
  font-weight: bold; 
}
.compact-legend span { display: flex; align-items: center; gap: 0.5rem; }

.plague-modal {
  position: absolute;
  top: 90px;
  bottom: 110px;
  width: 440px;
  background: rgba(10, 15, 30, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 1.5rem;
  pointer-events: auto;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.8);
}
.plague-modal::-webkit-scrollbar { width: 4px; }
.plague-modal::-webkit-scrollbar-thumb { background: var(--rule); border-radius: 2px; }

.modal-left { left: 2rem; }
.modal-right { right: 2rem; }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.75rem;
}
.modal-header .section-title {
  color: #fff;
  font-size: 1.1rem;
  margin: 0;
}
.modal-header button {
  background: none;
  border: none;
  color: var(--soft);
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}
.modal-header button:hover { color: #fff; }

.plague-start-menu {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 380px;
  pointer-events: auto;
  background: rgba(10, 15, 30, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.8);
}

/* Hide the old hud panels so they don't conflict */
.hud-simulation-wrapper .hud-top-bar,
.hud-simulation-wrapper .hud-panel {
  display: none !important;
}
`;

fs.writeFileSync('src/App.css', css + newStyles);
console.log("App.css updated with plague styles");
