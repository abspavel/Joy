const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

// Strip all Framer Motion imports
code = code.replace(/import { motion[\s\S]*?} from 'motion\/react';/g, '');

// Clean up FloatingBadge
code = code.replace(/<motion\.div\s+className={`absolute z-30 pointer-events-auto select-none \$\{className\}`}[\s\S]*?>/, 
  `<div className={\`absolute z-30 pointer-events-auto select-none \$\{className\} animate-badge-in\`} style={{ animationDelay: \`\$\{0.2 + delay\}s\` }}>`);
code = code.replace(/<\/motion\.div>/g, '</div>');
code = code.replace(/<motion\.h1/g, '<h1');
code = code.replace(/<\/motion\.h1>/g, '</h1>');
code = code.replace(/<motion\.span[\s\S]*?>/g, '<span>');
code = code.replace(/<\/motion\.span>/g, '</span>');
code = code.replace(/<motion\.div[\s\S]*?>/g, '<div>');

// Overwrite the entire EnhancedPortrait component because it's full of motion hooks
const epStart = code.indexOf('function EnhancedPortrait');
const epEnd = code.indexOf('export function HeroSection');
if (epStart !== -1 && epEnd !== -1) {
  const newEP = `function EnhancedPortrait({ imageUrl = "/joy-photo-transparent.png" }: { imageUrl?: string }) {
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0 });
  const [parallax, setParallax] = React.useState({ y: 0, scale: 1, opacity: 1 });

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const pY = Math.min(100, Math.max(0, scrollY * (100 / 800)));
          const pScale = Math.max(0.94, Math.min(1, 1 - (scrollY / 800) * 0.06));
          const pOp = Math.max(0.7, Math.min(1, 1 - (scrollY / 800) * 0.3));
          setParallax({ y: pY, scale: pScale, opacity: pOp });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!mq.matches) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const mX = (e.clientX / window.innerWidth) * 2 - 1;
          const mY = (e.clientY / window.innerHeight) * 2 - 1;
          setTilt({ rx: mY * -5, ry: mX * 5 });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative z-20 w-full h-full flex justify-center items-center pointer-events-none perspective-[1000px]">
      <div
        style={{
          transform: \`translateY(\$\{parallax.y\}px) scale(\$\{parallax.scale\}) rotateX(\$\{tilt.rx\}deg) rotateY(\$\{tilt.ry\}deg)\`,
          opacity: parallax.opacity,
          transition: 'transform 0.15s ease-out',
          willChange: 'transform, opacity'
        }}
        className="w-full flex justify-center items-center pointer-events-auto will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-radial from-[var(--text-highlight)]/20 to-transparent blur-3xl rounded-full opacity-60 -z-10 mix-blend-screen transform scale-90 translate-y-10"></div>
        <div className="pointer-events-auto">
          <img
            src={imageUrl}
            alt="Pavel Ahmed Joy - 3D Creator"
            fetchPriority="high"
            width="800"
            height="1000"
            className="w-full max-h-[45vh] sm:max-h-[54vh] md:max-h-[60vh] h-auto object-contain pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
            style={{
              imageRendering: 'high-quality',
              WebkitFontSmoothing: 'antialiased',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          />
        </div>
      </div>
    </div>
  );
}\n\n`;
  code = code.substring(0, epStart) + newEP + code.substring(epEnd);
}

// Remove motion usages in ScrollDownIndicator
const sdStart = code.indexOf('function ScrollDownIndicator');
const sdEnd = code.indexOf('function EnhancedPortrait');
if (sdStart !== -1 && sdEnd !== -1) {
  const newSD = `function ScrollDownIndicator() {
  const handleScroll = () => {
    const nextSection = document.getElementById('about') || document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };
  return (
    <button onClick={handleScroll} className="animate-fade-in-up flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none select-none transition-all duration-200" aria-label="Scroll down to view more content" style={{ animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="w-5 h-8 sm:w-6 sm:h-9 rounded-full border-2 border-white/30 group-hover:border-purple-400/90 transition-colors flex justify-center pt-1.5 bg-[var(--bg-secondary)]/60 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-bounce-slow" />
      </div>
      <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--text-secondary)] group-hover:text-purple-300 transition-colors">
        <span>SCROLL</span>
        <div className="animate-bounce-slow">
          <ChevronDown className="w-3 h-3 text-purple-400 group-hover:text-purple-300" />
        </div>
      </div>
    </button>
  );
}\n\n`;
  code = code.substring(0, sdStart) + newSD + code.substring(sdEnd);
}

fs.writeFileSync('src/sections/HeroSection.tsx', code);
