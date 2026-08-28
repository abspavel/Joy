const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<MarqueeSection \/>/g, '<LazySection fallbackHeight="400px"><MarqueeSection /></LazySection>');

fs.writeFileSync('src/App.tsx', code);
