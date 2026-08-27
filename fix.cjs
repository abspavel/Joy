const fs = require('fs');
let code = fs.readFileSync('src/sections/ProjectsSection.tsx', 'utf8');

code = code.replace(/offset: \['start start', 'end start'\]\n  \};\n/, "offset: ['start start', 'end start']\n  });\n");
code = code.replace(/offset: \['start end', 'end start'\]\n  \};\n/, "offset: ['start end', 'end start']\n  });\n");
code = code.replace(/\{ stiffness: 300, damping: 30 \};/g, "{ stiffness: 300, damping: 30 });");

fs.writeFileSync('src/sections/ProjectsSection.tsx', code);
