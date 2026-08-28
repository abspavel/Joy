const fs = require('fs');
let code = fs.readFileSync('src/components/TopProgressBar.tsx', 'utf8');

code = code.replace(/NProgress\.start\(\);/, '// NProgress.start();');

fs.writeFileSync('src/components/TopProgressBar.tsx', code);
