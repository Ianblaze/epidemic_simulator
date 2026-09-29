const fs = require('fs');

let code = fs.readFileSync('src/data/transit.js', 'utf8');

const additionalWaypoints = [
    { id: 'BISCAY', name: 'Bay of Biscay', lat: 45, lon: -7, country: 'FRANCE' },
    { id: 'ENG_CHNL', name: 'English Channel', lat: 50, lon: -2, country: 'UNITEDKINGDOM' },
    { id: 'NORTH_AUS', name: 'Cape York', lat: -10, lon: 142, country: 'AUSTRALIA' },
    { id: 'LEEUWIN', name: 'Cape Leeuwin', lat: -35, lon: 115, country: 'AUSTRALIA' },
    { id: 'SICILY_OFF', name: 'South of Sicily', lat: 36, lon: 15, country: 'ITALY' },
    { id: 'SPAIN_EAST', name: 'East of Spain', lat: 37.5, lon: 0.5, country: 'SPAIN' },
    { id: 'PNG_OFF', name: 'East of PNG', lat: -10, lon: 155, country: 'PAPUANEWGUINEA' },
    { id: 'FLORIDA_OFF', name: 'Florida Coast', lat: 28, lon: -79, country: 'UNITEDSTATESOFA' }
];

let waypointsStr = "";
additionalWaypoints.forEach(w => {
    waypointsStr += `    { "id": "${w.id}", "name": "${w.name}", "lat": ${w.lat}, "lon": ${w.lon}, "country": "${w.country}" },\n`;
});

// Append the new waypoints to the existing seaports array
code = code.replace(/export const seaports = \[/, 'export const seaports = [\n' + waypointsStr);

const newShips = `"ships": [
    { "path": ["SHG","HKG_P","MAL","SGP","SGP_STRAIT","COLOMBO_OFF","BOM_P","KHI","HRM","DXB_P"] },
    { "path": ["DXB_P","HRM","ADEN","BAB","SUEZ","PIR","SICILY_OFF","GOA","SPAIN_EAST","BAR","SPAIN_EAST","GIB"] },
    { "path": ["GIB","AZOR","BERM","NYC"] },
    { "path": ["NYC","FLORIDA_OFF","CUB","PAN","MEX_PAC","BAJA_OFF","LAX"] },
    { "path": ["LAX","HAWI","YOK","BUS","SHG"] },
    { "path": ["VNC","LAX","HAWI","YOK"] },
    { "path": ["SHG","BUS","YOK","PNG_OFF","SYD_P"] },
    { "path": ["SYD_P","NORTH_AUS","JKT","SGP_STRAIT","SGP"] },
    { "path": ["SGP","SGP_STRAIT","COLOMBO_OFF","HORN_OFF","MOM","MOZ","DUR","GDH","CPT"] },
    { "path": ["CPT","GDH","SNT","URUGUAY_OFF","EZE_P"] },
    { "path": ["SNT","RECIFE_OFF","BERM","AZOR","BISCAY","ENG_CHNL","ANT","RTM","HAM"] },
    { "path": ["HAM","RTM","ANT","ENG_CHNL","BISCAY","AZOR","NYC"] },
    { "path": ["VAL","CLO","PAN","CUB","FLORIDA_OFF","NYC"] },
    { "path": ["ALG","SPAIN_EAST","GIB","BISCAY","ENG_CHNL","RTM","HAM"] },
    { "path": ["SYD_P","LEEUWIN","MAD_EAST","DUR","GDH","CPT"] }
  ]
};`;

code = code.replace(/"ships": \[\s*\{[\s\S]*?\]\s*\};/, newShips);
fs.writeFileSync('src/data/transit.js', code);
