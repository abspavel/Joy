const fs = require('fs');
let code = fs.readFileSync('src/sections/MarqueeSection.tsx', 'utf8');

code = code.replace(/fetchPriority=\{index < 2 \? "high" : "auto"\}/g, 'fetchPriority="low"');
code = code.replace(/loading=\{index < 4 \? "eager" : "lazy"\}/g, 'loading="lazy"');

fs.writeFileSync('src/sections/MarqueeSection.tsx', code);
