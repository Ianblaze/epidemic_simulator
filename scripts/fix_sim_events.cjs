const fs = require('fs');
let code = fs.readFileSync('src/simulation/stepSimulation.js', 'utf8');

code = code.replace(
    /const airRisk = Math\.min\(1\.0, infectionPressure \* airVolume \* airTrans \* \(1 \- borderStrictness\) \* 0\.3\);\s*if \(random\(\) < airRisk\) \{\s*const amount = Math\.floor\(1 \+ random\(\) \* 10\);\s*const actualAmount = Math\.min\(rTarget\.S, amount\);\s*rTarget\.S \-= actualAmount;\s*rTarget\.E \+= actualAmount;\s*\}/,
    `const airRisk = Math.min(1.0, infectionPressure * airVolume * airTrans * (1 - borderStrictness) * 0.3);
                        if (random() < airRisk) {
                            const amount = Math.floor(1 + random() * 10);
                            const actualAmount = Math.min(rTarget.S, amount);
                            rTarget.S -= actualAmount;
                            rTarget.E += actualAmount;
                            if (actualAmount > 0) transitEvents.push({ origin: countryId, target: rTargetId, type: 'flight' });
                        }`
);

code = code.replace(
    /const seaRisk = Math\.min\(1\.0, infectionPressure \* seaVolume \* waterTrans \* \(1 \- borderStrictness\) \* 0\.15\);\s*if \(random\(\) < seaRisk\) \{\s*const amount = Math\.floor\(1 \+ random\(\) \* 5\);\s*const actualAmount = Math\.min\(rTarget\.S, amount\);\s*rTarget\.S \-= actualAmount;\s*rTarget\.E \+= actualAmount;\s*\}/,
    `const seaRisk = Math.min(1.0, infectionPressure * seaVolume * waterTrans * (1 - borderStrictness) * 0.15);
                        if (random() < seaRisk) {
                            const amount = Math.floor(1 + random() * 5);
                            const actualAmount = Math.min(rTarget.S, amount);
                            rTarget.S -= actualAmount;
                            rTarget.E += actualAmount;
                            if (actualAmount > 0) transitEvents.push({ origin: countryId, target: rTargetId, type: 'ship' });
                        }`
);

fs.writeFileSync('src/simulation/stepSimulation.js', code);
console.log("Updated stepSimulation to emit transit events");
