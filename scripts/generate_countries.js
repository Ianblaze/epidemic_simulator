import fs from 'fs';

async function run() {
  console.log("Fetching topojson...");
  const topoRes = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json');
  const topoData = await topoRes.json();
  const topoNames = topoData.objects.countries.geometries.map(g => g.properties.name);
  
  console.log("Fetching REST countries...");
  const restRes = await fetch('https://restcountries.com/v3.1/all');
  const restData = await restRes.json();
  
  const allCountries = [];
  
  for (const name of topoNames) {
    if (!name) continue;
    
    // Attempt to match names
    const match = restData.find(r => {
      const n1 = r.name.common.toLowerCase();
      const n2 = r.name.official.toLowerCase();
      const t = name.toLowerCase();
      return n1 === t || n2 === t || t.includes(n1) || n1.includes(t) || t === r.cca3.toLowerCase() || (r.cca3 === 'USA' && t.includes('united states'));
    });
    
    let pop = Math.floor(1000000 + Math.random() * 20000000); // Default if not found
    let id = name.substring(0, 3).toUpperCase();
    
    if (match) {
       pop = match.population;
       id = match.cca2;
    } else {
       console.log("No match for:", name);
    }
    
    allCountries.push({
      id: id,
      name: name,
      population: pop
    });
  }
  
  console.log("Found " + allCountries.length + " countries.");
  const jsContent = `const countries = ${JSON.stringify(allCountries, null, 2)};\n\nexport default countries;\n`;
  fs.writeFileSync('src/data/countries.js', jsContent);
  console.log("Wrote to src/data/countries.js");
}

run();
