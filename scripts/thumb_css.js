import fs from 'fs';
let css = fs.readFileSync('src/App.css', 'utf8');

css = css.replace(
  /input\[type=range\]\.slider-new::-webkit-slider-thumb\s*\{[^}]+\}/,
  `input[type=range].slider-new::-webkit-slider-thumb {
  -webkit-appearance:none; 
  width:14px; 
  height:14px; 
  border-radius:50%;
  background:var(--ink); 
  cursor:pointer; 
  box-shadow:0 0 0 3px var(--panel);
  margin-top: -5.5px;
}`
);
fs.writeFileSync('src/App.css', css);
console.log("thumb centered");
