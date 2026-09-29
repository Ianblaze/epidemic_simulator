const fs = require('fs');
let code = fs.readFileSync('src/data/transit.js', 'utf8');

const newWaypoints = [
    { id: 'MEX_PAC', name: 'Pacific Coast Mexico', lat: 15.0, lon: -100.0, country: 'MEXICO' },
    { id: 'BAJA_OFF', name: 'Baja California Off', lat: 22.0, lon: -111.0, country: 'MEXICO' },
    { id: 'RECIFE_OFF', name: 'Recife Coast', lat: -8.0, lon: -34.0, country: 'BRAZIL' },
    { id: 'URUGUAY_OFF', name: 'Uruguay Coast', lat: -35.0, lon: -53.0, country: 'URUGUAY' },
    { id: 'COLOMBO_OFF', name: 'South of Sri Lanka', lat: 5.0, lon: 80.0, country: 'SRILANKA' },
    { id: 'HORN_OFF', name: 'Horn of Africa', lat: 12.0, lon: 52.0, country: 'SOMALIA' },
    { id: 'SGP_STRAIT', name: 'Singapore Strait', lat: 5.0, lon: 95.0, country: 'INDONESIA' },
    { id: 'MAD_EAST', name: 'East Madagascar', lat: -20.0, lon: 55.0, country: 'MADAGASCAR' }
];

let newWaypointsStr = "";
newWaypoints.forEach(w => {
    newWaypointsStr += `    { "id": "${w.id}", "name": "${w.name}", "lat": ${w.lat}, "lon": ${w.lon}, "country": "${w.country}" },\n`;
});

code = code.replace(/export const seaports = \[/, 'export const seaports = [\n' + newWaypointsStr);

const newShips = `"ships": [
    { "path": ["SHG","HKG_P","MAL","SGP","SGP_STRAIT","COLOMBO_OFF","BOM_P","HRM","DXB_P"] },
    { "path": ["DXB_P","HRM","ADEN","BAB","SUEZ","PIR","GOA","BAR","GIB"] },
    { "path": ["GIB","AZOR","BERM","NYC"] },
    { "path": ["NYC","CUB","PAN","MEX_PAC","BAJA_OFF","LAX"] },
    { "path": ["LAX","HAWI","YOK","BUS","SHG"] },
    { "path": ["VNC","LAX","HAWI","YOK"] },
    { "path": ["SHG","BUS","YOK","SYD_P"] },
    { "path": ["SYD_P","JKT","MAL","SGP"] },
    { "path": ["SGP","SGP_STRAIT","COLOMBO_OFF","BOM_P"] },
    { "path": ["BOM_P","COLOMBO_OFF","HORN_OFF","MOM","MOZ","DUR","GDH","CPT"] },
    { "path": ["CPT","GDH","SNT","URUGUAY_OFF","EZE_P"] },
    { "path": ["SNT","RECIFE_OFF","BERM","AZOR","GIB","RTM","HAM"] },
    { "path": ["HAM","ANT","RTM","GIB","AZOR","NYC"] },
    { "path": ["VAL","CLO","PAN","CUB","NYC"] },
    { "path": ["ALG","BAR","GIB","ANT","RTM","HAM"] },
    { "path": ["KHI","HRM","DXB_P","ADEN","BAB","SUEZ"] },
    { "path": ["SYD_P","MAD_EAST","DUR","GDH","CPT"] }
  ]
};`;

code = code.replace(/"ships": \[\s*\{[\s\S]*?\]\s*\};/, newShips);
fs.writeFileSync('src/data/transit.js', code);
