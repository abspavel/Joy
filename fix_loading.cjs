const fs = require('fs');
let code = fs.readFileSync('src/hooks/usePortfolioData.ts', 'utf8');

code = code.replace(/setData\(fallback\);\n      \}/g, "setData(fallback);\n      }\n      setLoading(false);");
code = code.replace(/setError\(err\);\n    \}/g, "setError(err);\n      setLoading(false);\n    }");

fs.writeFileSync('src/hooks/usePortfolioData.ts', code);
