const fs = require('fs');
let code = fs.readFileSync('src/hooks/usePortfolioData.ts', 'utf8');

code = code.replace(/fetchData\(\);\n\n    return \(\) => \{/g, `
    let timeoutId: any;
    if (typeof window !== 'undefined' && ('requestIdleCallback' in window)) {
      timeoutId = (window as any).requestIdleCallback(() => fetchData(), { timeout: 2000 });
    } else {
      timeoutId = setTimeout(() => fetchData(), 500);
    }
    
    return () => {
      if (typeof window !== 'undefined' && ('cancelIdleCallback' in window) && timeoutId) {
        (window as any).cancelIdleCallback(timeoutId);
      } else if (timeoutId) {
        clearTimeout(timeoutId);
      }
`);

fs.writeFileSync('src/hooks/usePortfolioData.ts', code);
