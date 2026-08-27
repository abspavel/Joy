const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

code = code.replace(
"    </div>\n  );\n}\n\nconst ScrollDownIndicator",
"    </div>\n  );\n});\n\nconst ScrollDownIndicator"
);

code = code.replace(
"    </motion.button>\n  );\n}\n\nconst EnhancedPortrait",
"    </motion.button>\n  );\n});\n\nconst EnhancedPortrait"
);

fs.writeFileSync('src/sections/HeroSection.tsx', code);
