const fs = require('fs');
let code = fs.readFileSync('src/App.css', 'utf8');

code = code.replace(
  'width: 50%;\n  max-width: 600px;',
  'flex: 1;\n  max-width: 900px;\n  overflow: hidden;'
);

code = code.replace(
  '.ticker-label {\n  font-weight: 800;\n  color: var(--s);\n  margin-right: 1rem;\n  text-transform: uppercase;\n  font-size: 0.8rem;\n  letter-spacing: 1px;\n}',
  '.ticker-label {\n  font-weight: 800;\n  color: var(--s);\n  margin-right: 1rem;\n  text-transform: uppercase;\n  font-size: 0.8rem;\n  letter-spacing: 1px;\n  flex-shrink: 0;\n}'
);

code = code.replace(
  '.ticker-text {\n  color: #fff;\n  font-size: 0.9rem;\n}',
  '.ticker-text {\n  color: #fff;\n  font-size: 0.9rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  flex: 1;\n}'
);

fs.writeFileSync('src/App.css', code);
console.log('done');
