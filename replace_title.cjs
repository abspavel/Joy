const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

const regex = /function AnimatedHeroTitle\([\s\S]*?return \(\s*<div[\s\S]*?<\/h1>\s*<\/div>\s*\);\s*\}/;

const newComponent = `function AnimatedHeroTitle({ text1 = "Hi, i'm ", text2 = "joy" }: { text1?: string, text2?: string }) {
  const renderChar = (char: string, index: number, isGradient = false) => {
    if (char === ' ') return <span key={index}>{'\u00A0'}</span>;
    const isPurplePunctuation = [',', "'", '’', '\`', '‘', 'ʼ', '′', '´', 'ʻ', '‚', '՚'].includes(char);
    
    if (isPurplePunctuation) {
      return (
        <span
          key={index}
          className="inline-block text-[#c084fc] drop-shadow-[0_0_20px_rgba(192,132,252,1)] font-black mx-[0.5px] animate-title-char"
          style={{ animationDelay: \`\$\{0.15 + index * 0.08\}s\` }}
        >
          {char}
        </span>
      );
    }
    
    if (isGradient) {
      return (
        <span
          key={index}
          className="inline-block animate-title-char"
          style={{ animationDelay: \`\$\{0.15 + index * 0.08\}s\` }}
        >
          {char}
        </span>
      );
    }
    
    return (
      <span
        key={index}
        className="inline-block animate-title-char"
        style={{ animationDelay: \`\$\{0.15 + index * 0.08\}s\` }}
      >
        {char}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center font-black tracking-tighter uppercase relative select-none">
      <h1 className="flex flex-wrap justify-center items-center m-0 leading-[0.8] text-[10vw] sm:text-[11vw] lg:text-[10vw] drop-shadow-2xl filter [text-shadow:0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex text-white mix-blend-plus-lighter relative z-10 font-bold whitespace-nowrap">
          {text1.split('').map((char, i) => renderChar(char, i))}
        </div>
        <div className="flex bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 relative z-10 px-2 sm:px-4 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] filter-none font-black italic tracking-normal transform -rotate-2 scale-110">
          {text2.split('').map((char, i) => renderChar(char, text1.length + i, true))}
        </div>
      </h1>
    </div>
  );
}`;

code = code.replace(regex, newComponent);
fs.writeFileSync('src/sections/HeroSection.tsx', code);
