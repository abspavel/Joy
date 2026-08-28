const fs = require('fs');
let code = fs.readFileSync('src/sections/MarqueeSection.tsx', 'utf8');

code = code.replace(/className=\{\`w-\[160px\].*?\`\}/, 
  `className="w-[160px] h-[100px] sm:w-[280px] sm:h-[180px] md:w-[420px] md:h-[270px] rounded-2xl object-cover object-center shrink-0 bg-white/5"`);
code = code.replace(/const \[loaded, setLoaded\] = useState\(false\);\n?/, '');
code = code.replace(/onLoad=\{.*?\}\s*/, '');

fs.writeFileSync('src/sections/MarqueeSection.tsx', code);
