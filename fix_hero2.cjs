const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

code = code.replace(
"    </motion.div>\n  );\n}\n\nexport function HeroSection() {",
"    </motion.div>\n  );\n});\n\nexport function HeroSection() {"
);

fs.writeFileSync('src/sections/HeroSection.tsx', code);
