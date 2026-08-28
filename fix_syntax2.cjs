const fs = require('fs');
let code = fs.readFileSync('src/sections/SkillsCertificationsSection.tsx', 'utf8');

code = code.replace(/<div key=\{skill\.id\} className="animate-fade-in-up" style=\{\{ animationDuration: '0\.4s' \}\}\s*transition=\{\{[\s\S]*?\}\}\s*whileHover=\{\{[\s\S]*?\}\}\s*className="group/g, 
  `<div key={skill.id} className="animate-fade-in-up group`);

code = code.replace(/<div className="h-full rounded-full transition-all duration-1000 ease-out" style=\{\{ width: \`\$\{meta\.percent\}%\` \}\}\s*style=\{\{\s*background: \`linear-gradient\(90deg, \$\{meta\.color\}88, \$\{meta\.color\}\)\`,\s*boxShadow: \`0 0 8px \$\{meta\.color\}\`\s*\}\}/g, 
  `<div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: \`\$\{meta.percent\}%\`, background: \`linear-gradient(90deg, \$\{meta.color\}88, \$\{meta.color\})\`, boxShadow: \`0 0 8px \$\{meta.color\}\` }}`);

fs.writeFileSync('src/sections/SkillsCertificationsSection.tsx', code);
