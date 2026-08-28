const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

code = code.replace(/setTimeout\(\(\) => setRenderBg\(true\), 50\);/, 'setTimeout(() => setRenderBg(true), 1200);');

fs.writeFileSync('src/sections/HeroSection.tsx', code);
