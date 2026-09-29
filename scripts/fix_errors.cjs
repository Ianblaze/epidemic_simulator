const fs = require('fs');
let code = fs.readFileSync('src/components/CinematicEarth.jsx', 'utf8');

// 1. Remove targetRotation from CameraAndControls
code = code.replace(/const targetRotation = useRef\(null\);[\s\S]*?\}, \[seedCountry, geoData\]\);/, '');

// 2. Add targetRotation to Earth component
const earthTargetLogic = `
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
                  targetRotation.current = { 
                     y: -(lon * 0.0174533) - 1.5708,
                     x: (lat * 0.0174533)
                  };
              }
           }
       }
    }, [seedCountry, geoData]);
`;
code = code.replace(/(function Earth[^\{]*\{[\s\S]*?const geoData = useCountryGeometry\(\);)/, "$1" + earthTargetLogic);

fs.writeFileSync('src/components/CinematicEarth.jsx', code);
console.log('Fixed CinematicEarth');
