import fs from 'fs';
let current = fs.readFileSync('src/data/transit.js', 'utf8');

const replacement = '],\n' +
'  "ships": [\n' +
'    { "path": ["SHG","HKG_P","MAL","SGP","BOM_P","HRM","DXB_P"] },\n' +
'    { "path": ["DXB_P","HRM","ADEN","BAB","SUEZ","PIR","GOA","BAR","GIB"] },\n' +
'    { "path": ["GIB","AZOR","BERM","NYC"] },\n' +
'    { "path": ["NYC","CUB","PAN","LAX"] },\n' +
'    { "path": ["LAX","HAWI","YOK","BUS","SHG"] },\n' +
'    { "path": ["VNC","LAX","HAWI","YOK"] },\n' +
'    { "path": ["SHG","BUS","YOK","SYD_P"] },\n' +
'    { "path": ["SYD_P","JKT","MAL","SGP"] },\n' +
'    { "path": ["SGP","BOM_P","ADEN","MOM","MOZ","DUR","GDH","CPT"] },\n' +
'    { "path": ["CPT","GDH","SNT","EZE_P"] },\n' +
'    { "path": ["SNT","BERM","AZOR","GIB","RTM","HAM"] },\n' +
'    { "path": ["HAM","ANT","RTM","GIB","AZOR","NYC"] },\n' +
'    { "path": ["VAL","CLO","PAN","CUB","NYC"] },\n' +
'    { "path": ["ALG","BAR","GIB","ANT","RTM","HAM"] },\n' +
'    { "path": ["KHI","HRM","DXB_P","ADEN","BAB","SUEZ"] }\n' +
'  ]\n' +
'};\n';

current = current.replace(/],\s*"ships":\s*\[\s*\{\s*"path":\s*\["SHG","HKG_P","MAL","SGP","BOM_P","HRM","DXB_P"\]\s*\};\s*/, replacement);
fs.writeFileSync('src/data/transit.js', current);
