const fs = require('fs');

// ===== FIX 1: stepSimulation.js - DOOMSDAY endgame force + Fix vaccine hub IDs =====
let step = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

// Fix vaccine hub IDs (line 151) - use full names instead of ISO codes
step = step.replace(
    "const prominentCountries = ['USA', 'CHN', 'GBR', 'FRA', 'DEU', 'JPN'];",
    "const prominentCountries = ['UNITEDSTATESOFAMERICA', 'CHINA', 'UNITEDKINGDOM', 'FRANCE', 'GERMANY', 'JAPAN'];"
);

// Add DOOMSDAY endgame force spread after globalPop calculation (after line 128)
const doomsdayForce = `
    // DOOMSDAY ENDGAME: When healthy < 1 billion, force disease to ALL remaining uninfected countries
    if (gameMode === 'DOOMSDAY' && globalS < 1000000000) {
        const infectedSources = [];
        const uninfectedTargets = [];
        newStates.forEach((s, cid) => {
            if (s.I > 1000) infectedSources.push(cid);
            if (s.I === 0 && s.E === 0 && s.S > 100) uninfectedTargets.push(cid);
        });
        if (infectedSources.length > 0) {
            uninfectedTargets.forEach(targetId => {
                const sourceId = infectedSources[Math.floor(random() * infectedSources.length)];
                const seedAmount = Math.min(newStates.get(targetId).S, 500);
                // Force infection via visible transit
                transitEvents.push({ origin: sourceId, target: targetId, type: 'flight', amount: seedAmount });
            });
        }
    }
`;

step = step.replace(
    '    const globalPop = globalS + globalE + totalGlobalI + globalR + globalD;\n\n    \n\n    // Vaccine deployment moved to bottom',
    '    const globalPop = globalS + globalE + totalGlobalI + globalR + globalD;\n' + doomsdayForce + '\n    // Vaccine deployment moved to bottom'
);

fs.writeFileSync('src/simulation/stepSimulation.js', step);
console.log("Fixed stepSimulation: DOOMSDAY endgame force + vaccine hub IDs");

// ===== FIX 2: FlatWorldMap.jsx - Add dark blue vaccine dots =====
let map = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

// Update drawnDotsRef to track vaccine dots too
map = map.replace(
    "if (!drawnDotsRef.current[cid]) drawnDotsRef.current[cid] = { infected: 0, dead: 0, recovered: 0 };",
    "if (!drawnDotsRef.current[cid]) drawnDotsRef.current[cid] = { infected: 0, dead: 0, recovered: 0, vaccinated: 0 };"
);

// Add vaccine dots after recovery dots (line 332)
map = map.replace(
    "// Recovery dots (green)\n        const targetRecovered = Math.floor(rRatio * maxDots * 0.5);\r\n        dots.recovered = spawnDots(targetRecovered, dots.recovered, 'recovered', 'rgba(0, 200, 80, 0.7)', '#00cc44');",
    "// Recovery dots (green)\n        const targetRecovered = Math.floor(rRatio * maxDots * 0.5);\r\n        dots.recovered = spawnDots(targetRecovered, dots.recovered, 'recovered', 'rgba(0, 200, 80, 0.7)', '#00cc44');\r\n\r\n        // Vaccine dots (dark blue) — shows vaccine deployment visually\r\n        if (state.vaccineAvailable) {\r\n          const vacRatio = Math.min(1, state.R / N * 0.8);\r\n          const targetVaccinated = Math.floor(vacRatio * maxDots * 0.6);\r\n          dots.vaccinated = spawnDots(targetVaccinated, dots.vaccinated, 'vaccinated', 'rgba(0, 80, 220, 0.85)', '#0044cc');\r\n        }"
);

fs.writeFileSync('src/components/FlatWorldMap.jsx', map);
console.log("Fixed FlatWorldMap: added dark blue vaccine dots");

// ===== FIX 3: useSimulation.js - Better vaccine news popups =====
let sim = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// Replace vaccine milestones with Plague Inc style messages
sim = sim.replace(
    `[1, "Scientists sequence the genetic code of the pathogen..."],`,
    `[1, "🧬 Pathogen Genome Sequenced — Scientists begin identifying potential vaccine targets."],`
);
sim = sim.replace(
    `[25, "First human trials of experimental vaccine show promising..."],`,
    `[25, "💉 Vaccine Trials Begin — Phase 1 human trials underway. Early results look promising."],`
);
sim = sim.replace(
    `[50, "Phase 3 vaccine trials completed. Manufacturing facilities..."],`,
    `[50, "🏭 Manufacturing Ramping Up — Phase 3 trials complete. Production facilities activated worldwide."],`
);
sim = sim.replace(
    `[75, "Vaccine distribution begins globally. Frontline workers..."],`,
    `[75, "✈️ Global Distribution Planned — Logistics networks preparing for mass deployment."],`
);
sim = sim.replace(
    `[95, "Global vaccination drive reaches critical mass..."]`,
    `[95, "🌍 Vaccine Almost Ready — Final quality checks in progress. Deployment imminent."]`
);

fs.writeFileSync('src/hooks/useSimulation.js', sim);
console.log("Fixed useSimulation: improved vaccine news popups");

console.log("\nAll 3 fixes applied successfully!");
