import fs from 'fs';

async function run() {
  console.log("Fetching topojson...");
  const topoRes = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json');
  const topoData = await topoRes.json();
  const topoNames = topoData.objects.countries.geometries.map(g => g.properties.name);
  
  const majorPops = {
    "United States of America": 331000000,
    "China": 1439000000,
    "India": 1380000000,
    "Indonesia": 273000000,
    "Pakistan": 220000000,
    "Brazil": 212000000,
    "Nigeria": 206000000,
    "Bangladesh": 164000000,
    "Russian Federation": 145000000,
    "Mexico": 128000000,
    "Japan": 126000000,
    "Ethiopia": 114000000,
    "Philippines": 109000000,
    "Egypt": 102000000,
    "Vietnam": 97000000,
    "Dem. Rep. Congo": 89000000,
    "Turkey": 84000000,
    "Iran": 83000000,
    "Germany": 83000000,
    "Thailand": 69000000,
    "United Kingdom": 67000000,
    "France": 65000000,
    "Italy": 60000000,
    "South Africa": 59000000,
    "Dem. Rep. Korea": 25000000,
    "South Korea": 51000000,
  };

  const exclusions = new Set([
    "N. Mariana Is.", "U.S. Virgin Is.", "Guam", "American Samoa", "Puerto Rico",
    "S. Geo. and the Is.", "Br. Indian Ocean Ter.", "Saint Helena", "Pitcairn Is.",
    "Anguilla", "Falkland Is.", "Cayman Is.", "Bermuda", "British Virgin Is.",
    "Turks and Caicos Is.", "Montserrat", "Jersey", "Guernsey", "Isle of Man",
    "Taiwan", "Somaliland", "Niue", "Cook Is.", "Aruba", "Curaçao", "W. Sahara",
    "Kosovo", "St. Pierre and Miquelon", "Wallis and Futuna Is.", "St-Martin",
    "St-Barthélemy", "Fr. Polynesia", "New Caledonia", "Fr. S. Antarctic Lands",
    "Åland", "Greenland", "Faeroe Is.", "N. Cyprus", "Macao", "Hong Kong",
    "Indian Ocean Ter.", "Heard I. and McDonald Is.", "Norfolk Island",
    "Ashmore and Cartier Is.", "Siachen Glacier", "Antarctica", "Sint Maarten"
  ]);

  const allCountries = [];
  
  for (const name of topoNames) {
    if (!name || exclusions.has(name)) continue;
    
    // Hash function for stable pseudo-random population
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
       hash = ((hash << 5) - hash) + name.charCodeAt(i);
       hash |= 0; 
    }
    const randPop = 1000000 + (Math.abs(hash) % 40000000); 
    const pop = majorPops[name] || randPop;
    
    // UNIQUE ID: Using full stripped name to avoid 'IND' collision for India/Indonesia
    let id = name.replace(/[^A-Za-z]/g, '').toUpperCase();
    
    allCountries.push({
      id: id,
      name: name,
      population: pop
    });
  }
  
  console.log("Generated " + allCountries.length + " official sovereign states.");
  const jsContent = `const countries = ${JSON.stringify(allCountries, null, 2)};\n\nexport default countries;\n`;
  fs.writeFileSync('src/data/countries.js', jsContent);
  console.log("Wrote to src/data/countries.js");
}

run();
