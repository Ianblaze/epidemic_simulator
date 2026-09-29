import fs from 'fs';

async function build() {
  const res = await fetch('https://restcountries.com/v3.1/all');
  const restCountries = await res.json();
  
  // We will read our own countries.js
  const myCountriesRaw = fs.readFileSync('src/data/countries.js', 'utf8');
  // It exports an array. We can just parse it loosely or extract the names.
  const myCountries = [...myCountriesRaw.matchAll(/"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)"/g)].map(m => ({
    id: m[1],
    name: m[2]
  }));

  const intelMap = {};

  myCountries.forEach(c => {
    // Find in restCountries
    let rc = restCountries.find(r => 
      r.name.common.toLowerCase() === c.name.toLowerCase() || 
      r.name.official.toLowerCase() === c.name.toLowerCase() ||
      (r.cca3 && r.cca3 === c.id) // sometimes IDs match CCA3
    );

    // Fallbacks for tricky names
    if (!rc) {
      if (c.name === 'United States') rc = restCountries.find(r => r.name.common === 'United States');
      if (c.name === 'Russia') rc = restCountries.find(r => r.name.common === 'Russia');
      if (c.name === 'South Korea') rc = restCountries.find(r => r.name.common === 'South Korea');
      if (c.name === 'Ivory Coast') rc = restCountries.find(r => r.cca3 === 'CIV');
      if (c.name === 'Democratic Republic of Congo') rc = restCountries.find(r => r.cca3 === 'COD');
    }

    if (!rc) {
      // Very basic fallback if not found
      intelMap[c.id] = {
        climate: 'Temperate',
        density: 'Moderate',
        healthcare: 'Standard',
        recommendations: ['Balanced region. Standard transmission vectors are viable.']
      };
      return;
    }

    const area = rc.area || 100000;
    const pop = rc.population || 5000000;
    const densityNum = pop / area;
    const lat = rc.latlng ? rc.latlng[0] : 0;
    
    // Density logic
    let density = 'Moderate';
    if (densityNum > 150) density = 'High';
    if (densityNum < 25) density = 'Low';

    // Climate logic
    let climate = 'Temperate';
    let climateType = 'temperate';
    if (Math.abs(lat) > 50) { climate = 'Cold / Arctic'; climateType = 'cold'; }
    else if (Math.abs(lat) < 25) { climate = 'Hot / Tropical'; climateType = 'hot'; }
    else if (rc.subregion && rc.subregion.toLowerCase().includes('northern africa')) { climate = 'Arid / Hot'; climateType = 'arid'; }
    
    // Healthcare logic
    const advancedRegions = ['Western Europe', 'Northern Europe', 'North America', 'Australia and New Zealand'];
    const advancedCountries = ['Japan', 'South Korea', 'Singapore', 'Israel', 'United Arab Emirates'];
    let healthcare = 'Standard';
    if (advancedRegions.includes(rc.subregion) || advancedCountries.includes(rc.name.common)) {
      healthcare = 'Advanced';
    } else if (rc.region === 'Africa' || (rc.subregion && rc.subregion.includes('Southern Asia'))) {
      healthcare = 'Developing';
    }

    let recs = [];
    if (climateType === 'cold') recs.push('Requires Cold Resistance. Blood transmission is limited due to heavy winter clothing.');
    if (climateType === 'hot') recs.push('Requires Heat Resistance. Mosquito and insect-based transmission is highly effective.');
    if (climateType === 'arid') recs.push('Arid environment. Air transmission travels far, but water transmission is severely limited.');
    
    if (density === 'High') recs.push('High urban density. Airborne transmission scales exponentially here.');
    if (density === 'Low') recs.push('Sparsely populated. Rural and zoonotic (animal) transmission recommended to bridge gaps.');
    
    if (healthcare === 'Advanced') recs.push('Advanced healthcare will slow infection and accelerate cure research. Drug Resistance heavily advised.');
    if (healthcare === 'Developing') recs.push('Developing healthcare infrastructure. Symptoms will increase lethality rapidly without treatment.');

    if (recs.length === 0) recs.push('Balanced region. Standard transmission vectors are viable.');

    intelMap[c.id] = {
      climate,
      density,
      healthcare,
      recommendations: recs
    };
  });

  fs.writeFileSync('src/data/intelligence.json', JSON.stringify(intelMap, null, 2));
  console.log('Intelligence data generated successfully!');
}

build();
