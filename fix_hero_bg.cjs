const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

code = code.replace(/setTimeout\(\(\) => setRenderBg\(true\), 200\);/, 'setTimeout(() => setRenderBg(true), 1500);');

fs.writeFileSync('src/sections/HeroSection.tsx', code);
