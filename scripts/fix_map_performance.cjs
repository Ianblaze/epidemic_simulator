const fs = require('fs');

let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

const oldVehiclesLoop = /for \(let i = vehiclesRef\.current\.length - 1; i >= 0; i--\) \{[\s\S]*?vehiclesRef\.current\.splice\(i, 1\);/g;
const newVehiclesLoop = `
        let activeVehicles = [];
        for (let i = 0; i < vehiclesRef.current.length; i++) {
          const v = vehiclesRef.current[i];
          if (runningRef.current) v.progress += v.speed;

          if (v.progress >= 1) {`;

code = code.replace(oldVehiclesLoop, newVehiclesLoop);

// Also need to push to activeVehicles if progress < 1
// We find the block that ends the if (v.progress >= 1) { ... }
const oldVehiclesEnd = /          \}\s*const x = v\.startX \+ \(v\.endX - v\.startX\) \* v\.progress;[\s\S]*?ctx\.fill\(\);\s*\}/g;

const newVehiclesEnd = `          } else {
             activeVehicles.push(v);
          }
          
          if (v.progress < 1) {
             const x = v.startX + (v.endX - v.startX) * v.progress;
             const y = v.startY + (v.endY - v.startY) * v.progress;
             if (v.type === 'ship') {
               ctx.fillStyle = v.infected ? 'rgba(255, 50, 50, 0.9)' : 'rgba(100, 200, 255, 0.7)';
               ctx.fillRect(x - 1, y - 1, 2, 2);
             } else {
               const p = getBezierXY(v.progress, v.startX, v.startY, v.cx, v.cy, v.endX, v.endY);
               ctx.fillStyle = v.infected ? 'rgba(255, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)';
               
               // Draw the plane as a tiny triangle
               ctx.save();
               ctx.translate(p.x, p.y);
               const nextP = getBezierXY(Math.min(1, v.progress + 0.01), v.startX, v.startY, v.cx, v.cy, v.endX, v.endY);
               const angle = Math.atan2(nextP.y - p.y, nextP.x - p.x);
               ctx.rotate(angle);
               ctx.beginPath();
               ctx.moveTo(3, 0);
               ctx.lineTo(-2, 2);
               ctx.lineTo(-2, -2);
               ctx.closePath();
               ctx.fill();
               ctx.restore();
             }
          }
        }
        vehiclesRef.current = activeVehicles;`;

code = code.replace(oldVehiclesEnd, newVehiclesEnd);

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log('Optimized vehicles removal to stop stuttering');
