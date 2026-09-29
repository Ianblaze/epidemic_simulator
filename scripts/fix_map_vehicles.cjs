const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

const startIdx = code.indexOf('// 4. DRAW AND UPDATE VEHICLES');
const endIdx = code.indexOf('animationFrameId = requestAnimationFrame(render);');

if (startIdx !== -1 && endIdx !== -1) {
  const newBlock = `// 4. DRAW AND UPDATE VEHICLES
      
        let activeVehicles = [];
        for (let i = 0; i < vehiclesRef.current.length; i++) {
          const v = vehiclesRef.current[i];
          if (runningRef.current) v.progress += v.speed;

          if (v.progress >= 1) {
            // Infect destination
            if (v.infected && inboundInfectionsRef && inboundInfectionsRef.current) {
                inboundInfectionsRef.current.push({
                   countryId: v.endCountry,
                   amount: Math.floor(Math.random() * 50) + 10
                });
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

      `;
  
  const modifiedCode = code.substring(0, startIdx) + newBlock + code.substring(endIdx);
  fs.writeFileSync('src/components/FlatWorldMap.jsx', modifiedCode);
  console.log('Fixed FlatWorldMap vehicle rendering');
} else {
  console.log('Could not find markers');
}
