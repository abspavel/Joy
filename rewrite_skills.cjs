const fs = require('fs');
let code = fs.readFileSync('src/sections/SkillsCertificationsSection.tsx', 'utf8');

// Strip motion imports
code = code.replace(/import { motion, AnimatePresence } from 'motion\/react';/g, '');

// Replace motion.div layoutId="activeFilterIndicator"
code = code.replace(/<motion\.span\s*layoutId="activeFilterIndicator"[\s\S]*?\/>/g, 
  `<span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 -z-10 opacity-70 transition-all duration-300" />`);

// Replace motion.div for grid container
code = code.replace(/<motion\.div\s*layout\s*className="grid/g, `<div className="grid`);

// Remove AnimatePresence
code = code.replace(/<AnimatePresence mode="popLayout">/g, '');
code = code.replace(/<\/AnimatePresence>/g, '');

// Replace motion.div for individual skill
code = code.replace(/<motion\.div\s*key=\{skill\.id\}\s*layout\s*initial=\{\{[\s\S]*?\}\}\s*animate=\{\{[\s\S]*?\}\}\s*exit=\{\{[\s\S]*?\}\}/g, 
  `<div key={skill.id} className="animate-fade-in-up" style={{ animationDuration: '0.4s' }}`);
code = code.replace(/<\/motion\.div>/g, '</div>');

// Replace motion.div for progress bar
code = code.replace(/<motion\.div\s*initial=\{\{ width: 0 \}\}\s*whileInView=\{\{ width: \`\$\{meta\.percent\}%\` \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{[\s\S]*?\}\}\s*className="h-full rounded-full"/g, 
  `<div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: \`\$\{meta.percent\}%\` }}`);

// Replace modal AnimatePresence
code = code.replace(/<AnimatePresence>/g, '');

// Replace motion.div for Modal overlay
code = code.replace(/<motion\.div\s*initial=\{\{ opacity: 0 \}\}\s*animate=\{\{ opacity: 1 \}\}\s*exit=\{\{ opacity: 0 \}\}\s*transition=\{\{ duration: 0\.25 \}\}\s*className="fixed inset-0/g, 
  `<div className="fixed inset-0 animate-fade-in-up" style={{ animationDuration: '0.2s' }}`);

// Replace motion.img for Modal image
code = code.replace(/<motion\.img decoding="async"\s*src=\{selectedCert\}\s*alt="Certificate Preview"\s*initial=\{\{ scale: 0\.85, opacity: 0 \}\}\s*animate=\{\{ scale: 1, opacity: 1 \}\}\s*exit=\{\{ scale: 0\.85, opacity: 0 \}\}/g, 
  `<img decoding="async" src={selectedCert} alt="Certificate Preview" className="animate-badge-in" style={{ animationDuration: '0.3s' }}`);
code = code.replace(/<\/motion\.img>/g, '</img>');

fs.writeFileSync('src/sections/SkillsCertificationsSection.tsx', code);
