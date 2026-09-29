import fs from 'fs';
import readline from 'readline';

async function processData() {
    const fileStream = fs.createReadStream('friend_repo/outputs/coupled_seird_extended_simulation.csv');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let isHeader = true;
    const playback = [];
    let currentDayIndex = -1;
    let currentDate = '';
    
    // date,country,scenario,alpha,S,E,I,R,D,beta,Rt,imported_infectious_pressure

    for await (const line of rl) {
        if (isHeader) { isHeader = false; continue; }
        
        const cols = line.split(',');
        if (cols[2] !== 'SCEN_2_MODERATE_COUPLING') continue;
        
        const date = cols[0];
        let country = cols[1].toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (country === 'UNITEDSTATES') country = 'UNITEDSTATESOFAMERICA';
        
        const E = Math.round(parseFloat(cols[5]));
        const I = Math.round(parseFloat(cols[6]));
        const R = Math.round(parseFloat(cols[7]));
        const D = Math.round(parseFloat(cols[8]));
        
        if (date !== currentDate) {
            currentDate = date;
            currentDayIndex++;
            playback.push({ date: currentDate, states: {} });
        }
        
        // Only store if there are actually cases to save space
        if (E > 0 || I > 0 || R > 0 || D > 0) {
            playback[currentDayIndex].states[country] = [E, I, R, D];
        }
    }

    fs.writeFileSync('src/data/historical_playback.json', JSON.stringify(playback));
    console.log('Successfully generated playback JSON: ' + playback.length + ' days.');
}

processData();
