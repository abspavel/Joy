const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

const enhancedPortraitOld = `function EnhancedPortrait({ imageUrl = "/joy-photo-transparent.png" }: { imageUrl?: string }) {
  const { scrollY } = useScroll();
  
  // Parallax + fade as user scrolls out of the hero section
  const pY = useTransform(scrollY, [0, 800], [0, 100]);
  const pScale = useTransform(scrollY, [0, 800], [1, 0.94]);
  const pOp = useTransform(scrollY, [0, 800], [1, 0.7]);

  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  
  // Smooth spring physics for mouse tilt
  const sX = useSpring(mX, { stiffness: 150, damping: 20 });
  const sY = useSpring(mY, { stiffness: 150, damping: 20 });
  
  // Proportional 3D tilt based on cursor offset (±5deg max)
  const rX = useTransform(sY, [-1, 1], [5, -5]); 
  const rY = useTransform(sX, [-1, 1], [-5, 5]);
  
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');

    const handleMouseMove = (e: MouseEvent) => {
      if (!mq.matches) return;
      mX.set((e.clientX / window.innerWidth) * 2 - 1);
      mY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mX, mY]);

  return (
    <div className="relative z-20 w-full h-full flex justify-center items-center pointer-events-none perspective-[1000px]">
      <motion.div
        style={{
          y: pY,
          scale: pScale,
          opacity: pOp,
          rotateX: rX,
          rotateY: rY,
        }}
        className="w-full flex justify-center items-center pointer-events-none will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-radial from-[var(--text-highlight)]/20 to-transparent blur-3xl rounded-full opacity-60 -z-10 mix-blend-screen transform scale-90 translate-y-10"></div>
        <motion.div
          drag
          dragConstraints={{ left: -15, right: 15, top: -15, bottom: 15 }}
          dragElastic={0.1}
          whileDrag={{ scale: 1.02 }}
          className="cursor-grab active:cursor-grabbing pointer-events-auto"
        >
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
        </motion.div>
      </motion.div>
    </div>
  );
}`;

const enhancedPortraitNew = `function EnhancedPortrait({ imageUrl = "/joy-photo-transparent.png" }: { imageUrl?: string }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [parallax, setParallax] = useState({ y: 0, scale: 1, opacity: 1 });

  useEffect(() => {
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

  useEffect(() => {
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
}`;

code = code.replace(enhancedPortraitOld, enhancedPortraitNew);

// There might be some imports to fix up
code = code.replace(/import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion\/react';/, '');

fs.writeFileSync('src/sections/HeroSection.tsx', code);
