import fs from 'fs';

async function run() {
  console.log("Fetching topojson...");
  const topoRes = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json');
  const topoData = await topoRes.json();
  const topoNames = topoData.objects.countries.geometries.map(g => g.properties.name);
  
  console.log("Fetching WorldBank 2025 population projections...");
  const wbRes = await fetch('http://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=300&date=2025');
  const wbData = await wbRes.json();
  const wbPops = wbData[1]; 
  
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

  const manualOverrides = {
    "Taiwan": 24000000,
    "Russian Federation": 143500000,
    "Russia": 143500000,
    "North Korea": 26200000,
    "Korea": 51700000,
    "South Korea": 51700000,
    "Iran": 89800000,
    "Syria": 23500000,
    "Venezuela": 29000000,
    "Yemen": 34500000,
    "Czechia": 10500000,
    "Macedonia": 2080000,
    "Swaziland": 1200000,
    "eSwatini": 1200000,
    "Palestine": 5400000,
    "Vatican": 800,
    "Bahamas": 410000,
    "Gambia": 2800000,
    "Egypt": 114000000,
    "United States of America": 341000000,
    "Slovakia": 5400000,
    "Kyrgyzstan": 7100000,
    "Laos": 7600000,
    "Côte d'Ivoire": 29000000,
    "Dem. Rep. Congo": 105000000,
    "Congo": 6200000,
    "Tanzania": 69000000,
    "Micronesia": 115000,
    "São Tomé and Principe": 230000,
    "St. Vin. and Gren.": 110000,
    "St. Kitts and Nevis": 47000,
    "Antigua and Barb.": 94000,
    "Bosnia and Herz.": 3200000,
    "Central African Rep.": 5800000,
    "Eq. Guinea": 1700000,
    "Dominican Rep.": 11400000,
    "Vietnam": 100000000,
    "Turkey": 86000000,
    "Solomon Is.": 750000,
    "Saint Lucia": 180000,
    "Nauru": 13000,
    "Marshall Is.": 42000
  };

  const allCountries = [];
  
  for (const name of topoNames) {
    if (!name || exclusions.has(name)) continue;
    
    let pop = 0;
    if (manualOverrides[name]) {
       pop = manualOverrides[name];
    } else {
       let wbMatch = wbPops.find(w => {
          if (!w.country || !w.country.value) return false;
          const wn = w.country.value.toLowerCase();
          const tn = name.toLowerCase();
          return wn === tn || wn === tn + ", the" || wn === "republic of " + tn;
       });
       if (wbMatch && wbMatch.value) {
          // Add 0.85% for exactly 2026 estimates
          pop = Math.floor(wbMatch.value * 1.0085);
       } else {
          // Fallback search
          wbMatch = wbPops.find(w => {
            if (!w.country || !w.country.value) return false;
            const wn = w.country.value.toLowerCase();
            const tn = name.toLowerCase();
            return wn.includes(tn) || tn.includes(wn);
          });
          if (wbMatch && wbMatch.value) pop = Math.floor(wbMatch.value * 1.0085);
          else {
             console.log("Missing WB data, applying fallback:", name);
             pop = 5000000;
          }
       }
    }
    
    let id = name.replace(/[^A-Za-z]/g, '').toUpperCase();
    allCountries.push({ id, name, population: pop });
  }
  
  console.log("Generated " + allCountries.length + " official sovereign states for 2026.");
  const jsContent = `const countries = ${JSON.stringify(allCountries, null, 2)};\n\nexport default countries;\n`;
  fs.writeFileSync('src/data/countries.js', jsContent);
}

run();
