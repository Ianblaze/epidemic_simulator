const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSimulation.js', 'utf8');

// The line is: addNews(nextDay, "dYs" AEGIS AI EXECUTED NUCLEAR SANITIZATION PROTOCOL. ALL INFECTED ZONES NEUTRALIZED.", 'warning');
// So we want to replace anything looking like addNews(nextDay, "..." AEGIS ... ", 'warning');
code = code.replace(/addNews\(nextDay, "[^"]*" AEGIS AI EXECUTED NUCLEAR SANITIZATION PROTOCOL. ALL INFECTED ZONES NEUTRALIZED.", 'warning'\);/g, "addNews(nextDay, 'AEGIS AI EXECUTED NUCLEAR SANITIZATION PROTOCOL. ALL INFECTED ZONES NEUTRALIZED.', 'warning');");

// Let's also fix the vaccine bracket: if (vaccineProgressRef.current >= 100 {
code = code.replace(/if \(vaccineProgressRef\.current >= 100 \{/g, 'if (vaccineProgressRef.current >= 100) {');

fs.writeFileSync('src/hooks/useSimulation.js', code);
