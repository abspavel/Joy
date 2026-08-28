const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/rootMargin: '800px'/g, "rootMargin: '200px'");

fs.writeFileSync('src/App.tsx', code);
