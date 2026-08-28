const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/rootMargin: '200px'/g, "rootMargin: '600px'");
fs.writeFileSync('src/App.tsx', code);
