const fs = require('fs');
let code = fs.readFileSync('src/hooks/usePortfolioData.ts', 'utf8');

code = code.replace(
    `controller.abort(new Error('TIMEOUT_ERROR'));
      }, 12000); // 12 seconds per attempt`,
    `controller.abort(new Error('TIMEOUT_ERROR'));
      }, 35000); // 35 seconds to allow for Supabase cold starts`
);

code = code.replace(
    `console.error(\`[Supabase Fetch] Error on table '\${tableName}', attempt \${attempt}/\${maxRetries}. Reason: \${errorMsg}\`);`,
    `console.warn(\`[Supabase Fetch] Warning on table '\${tableName}', attempt \${attempt}/\${maxRetries}. Reason: \${errorMsg}\`);`
);

fs.writeFileSync('src/hooks/usePortfolioData.ts', code);
