const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

// Remove motion imports
code = code.replace(/import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion\/react';/, '');
code = code.replace(/import \{ FadeIn \} from '\.\.\/components\/FadeIn';/, `import { FadeIn } from '../components/FadeIn';`);

// Replace FloatingBadge
code = code.replace(/<motion\.div\s+className={`absolute z-30 pointer-events-auto select-none \$\{className\}`}\s+initial={{[^}]+}}\s+animate={{[^}]+}}\s+transition={{[^}]+}}\s*>/, 
  `<div className={\`absolute z-30 pointer-events-auto select-none \$\{className\} animate-badge-in\`} style={{ animationDelay: \`\$\{0.2 + delay\}s\` }}>`);
code = code.replace(/<\/motion\.div>/g, '</div>');

// Replace AnimatedHeroTitle
code = code.replace(/const containerVariants = {[\s\S]*?};\n/, '');
code = code.replace(/const letterVariants = {[\s\S]*?};\n/, '');
code = code.replace(/<motion\.span\s*key={key}\s*variants={letterVariants}\s*/, `<span key={key} className="inline-block text-[#c084fc] drop-shadow-[0_0_20px_rgba(192,132,252,1)] font-black mx-[0.5px] animate-title-char" style={{ `);
code = code.replace(/<\/motion\.span>/g, '</span>');

code = code.replace(/<motion\.span\s*key={key}\s*variants={letterVariants}\s*className="inline-block animate-title-char"\s*>/, 
`<span key={key} className="inline-block animate-title-char" style={{ animationDelay: \`\$\{0.15 + parseInt(key) * 0.08\}s\` }}>`);

code = code.replace(/<motion\.h1\s*variants={containerVariants}\s*initial="hidden"\s*animate="visible"\s*/, `<h1 `);
code = code.replace(/<\/motion\.h1>/g, '</h1>');

code = code.replace(/<motion\.span\s*key={key}\s*variants={letterVariants}\s*className="inline-block"\s*>/g, 
  `<span key={key} className="inline-block animate-title-char" style={{ animationDelay: \`\$\{0.15 + (parseInt(key) || 0) * 0.08\}s\` }}>`);

// Replace ScrollDownIndicator
code = code.replace(/<motion\.button\s*onClick={handleScroll}\s*initial={{ opacity: 0, y: 15 }}\s*animate={{ opacity: 1, y: 0 }}\s*transition={{ delay: 0\.8, duration: 0\.8 }}\s*className="flex flex-col items-center gap-1\.5 cursor-pointer group focus:outline-none select-none transition-all duration-200"\s*aria-label="Scroll down to view more content"\s*>/, 
  `<button onClick={handleScroll} className="animate-fade-in-up flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none select-none transition-all duration-200" aria-label="Scroll down to view more content" style={{ animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards' }}>`);
code = code.replace(/<\/motion\.button>/g, '</button>');
code = code.replace(/animate-bounce/g, 'animate-bounce-slow');

fs.writeFileSync('src/sections/HeroSection.tsx', code);
