const fs = require('fs');
let code = fs.readFileSync('src/hooks/usePortfolioData.ts', 'utf8');

// Remove static import
code = code.replace(/import { supabase } from '\.\.\/lib\/supabase';\n/, '');

// Replace supabase.from with dynamic import
code = code.replace(/let query = supabase\.from\(tableName\)\.select\('\*'\);/, 
  `const { supabase } = await import('../lib/supabase');
    let query = supabase.from(tableName).select('*');`);

fs.writeFileSync('src/hooks/usePortfolioData.ts', code);
