const fs = require('fs');
let code = fs.readFileSync('src/hooks/usePortfolioData.ts', 'utf8');

code = code.replace(
    `setTimeout(() => reject(new Error('TIMEOUT')), 8000);`,
    `setTimeout(() => reject(new Error('TIMEOUT')), 30000); // 30 seconds for Supabase cold start`
);

fs.writeFileSync('src/hooks/usePortfolioData.ts', code);
