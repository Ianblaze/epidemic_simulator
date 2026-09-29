const fs = require('fs');
let code = fs.readFileSync('src/components/CinematicEarth.jsx', 'utf8');

// 1. Add gameMode prop
code = code.replace(/export default function CinematicEarth\(\{/, 'export default function CinematicEarth({ gameMode,');

// 2. Prevent click if DOOMSDAY
code = code.replace(/else if \(layoutMode === 'hud' && hoveredCountry && setSeedCountry\) \{ setSeedCountry\(hoveredCountry\); \}/, "else if (layoutMode === 'hud' && hoveredCountry && setSeedCountry) { if (gameMode !== 'DOOMSDAY') setSeedCountry(hoveredCountry); }");

// 3. Add auto-rotation target logic
const autoRotateLogic = `
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
                // Math.PI / 180 = 0.0174533
                targetRotation.current = { 
                   y: -(lon * 0.0174533) - 1.5708, // Adjusting for texture offset? We'll test without offset first. Actually let's just do -lon
                   x: (lat * 0.0174533)
                };
            }
         }
     }
  }, [seedCountry, geoData]);
`;

code = code.replace(/const controlsRef = useRef\(\);/, 'const controlsRef = useRef();' + autoRotateLogic);

// 4. Update useFrame for rotation
// We need to add the lerp logic into layoutMode === 'hud'
const oldHudLogic = /else if \(layoutMode === 'hud'\) \{ cloudsMesh\.current\.rotation\.y \+= delta \* 0\.02; \} \/\/ Only rotate clouds in HUD/;
const newHudLogic = `else if (layoutMode === 'hud') { 
         cloudsMesh.current.rotation.y += delta * 0.02; 
         if (targetRotation.current) {
             surfaceGroup.current.rotation.y = THREE.MathUtils.lerp(surfaceGroup.current.rotation.y, targetRotation.current.y, 0.05);
             surfaceGroup.current.rotation.x = THREE.MathUtils.lerp(surfaceGroup.current.rotation.x, targetRotation.current.x, 0.05);
         } else {
             surfaceGroup.current.rotation.y += delta * 0.005; 
         }
      }`;
code = code.replace(oldHudLogic, newHudLogic);

fs.writeFileSync('src/components/CinematicEarth.jsx', code);
console.log("Updated CinematicEarth.jsx");
