const fs = require('fs');
let code = fs.readFileSync('src/components/FlatWorldMap.jsx', 'utf8');

code = code.replace(
    'infected: true, vaccine: false',
    'infected: evt.isVaccine ? false : true, vaccine: evt.isVaccine ? true : false'
);
code = code.replace(
    'infected: true, vaccine: false',
    'infected: evt.isVaccine ? false : true, vaccine: evt.isVaccine ? true : false'
);

fs.writeFileSync('src/components/FlatWorldMap.jsx', code);
console.log("Updated FlatWorldMap for vaccine transit UI");
