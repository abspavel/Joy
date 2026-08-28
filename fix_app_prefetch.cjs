const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/prefetchAllPortfolioData\(\['marquee_images'\]\);/, `
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      prefetchAllPortfolioData(['marquee_images']);
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      prefetchAllPortfolioData(['marquee_images']);
    }, 1000);
  }
`);

fs.writeFileSync('src/App.tsx', code);
