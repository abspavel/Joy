const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

const ahStart = code.indexOf('function AnimatedHeroTitle');
const ahEnd = code.indexOf('function ScrollDownIndicator');

const newAh = `function AnimatedHeroTitle({ text1 = "Hi, i'm ", text2 = "joy" }: { text1?: string, text2?: string }) {
  const renderChar = (char: string, key: string, isGradient = false) => {
    if (char === ' ') return <span key={key}>{'\u00A0'}</span>;
    const isPurplePunctuation = [',', "'", '’', '\`', '‘', 'ʼ', '′', '´', 'ʻ', '‚', '՚'].includes(char);
    
    // Extract a numeric index from key like "text1-4" for animation stagger
    let idx = 0;
    if (key.includes('-')) {
      const parts = key.split('-');
      idx = parseInt(parts[1]) || 0;
      if (parts[0] === 'text2') idx += 10;
    }

    if (isPurplePunctuation) {
      return (
        <span key={key} className="inline-block text-[#c084fc] drop-shadow-[0_0_20px_rgba(192,132,252,1)] font-black mx-[0.5px] animate-title-char" style={{ animationDelay: \`\$\{0.15 + idx * 0.08\}s\`, color: '#c084fc', WebkitTextFillColor: '#c084fc', background: 'none', WebkitBackgroundClip: 'unset' }}>
          {char}
        </span>
      );
    }
    if (isGradient) {
      return (
        <span key={key} className="inline-block animate-title-char" style={{ animationDelay: \`\$\{0.15 + idx * 0.08\}s\`, backgroundImage: 'linear-gradient(90deg, #d946ef, #a855f7, #f43f5e, #d946ef)', backgroundSize: '300% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>
          {char}
        </span>
      );
    }
    return (
      <span key={key} className="inline-block text-[var(--text-primary)] animate-title-char" style={{ animationDelay: \`\$\{0.15 + idx * 0.08\}s\`, color: 'var(--text-primary)', WebkitTextFillColor: 'var(--text-primary)' }}>
        {char}
      </span>
    );
  };
  return (
    <div className="relative inline-flex items-center justify-center mx-auto max-w-full">
      <div 
        className="absolute -inset-x-8 -inset-y-4 rounded-full bg-gradient-to-r from-purple-600/20 via-fuchsia-500/15 to-indigo-600/20 blur-2xl pointer-events-none -z-10 animate-pulse" 
        style={{ animationDuration: '4s' }}
      />
      <div className="relative px-4 sm:px-8 py-1 sm:py-2.5 rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/10 sm:border-white/15 shadow-[0_4px_35px_rgba(168,85,247,0.15)] backdrop-blur-[4px]">
        <h1 className="font-black uppercase tracking-tight text-center whitespace-nowrap z-20 select-none text-[11vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.5vw] xl:text-[7vw] flex justify-center items-center w-full leading-none">
          <span className="flex mr-[1.5vw] drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)]">
            {text1.split('').map((char, index) => renderChar(char, \`text1-\$\{index\}\`, false))}
          </span>
          <span className="flex drop-shadow-[0_2px_18px_rgba(168,85,247,0.4)] animate-title-gradient">
            {text2.split('').map((char, index) => renderChar(char, \`text2-\$\{index\}\`, true))}
          </span>
        </h1>
      </div>
    </div>
  );
}\n\n`;

code = code.substring(0, ahStart) + newAh + code.substring(ahEnd);
fs.writeFileSync('src/sections/HeroSection.tsx', code);
