const fs = require('fs');
let code = fs.readFileSync('src/admin/AdminRouter.tsx', 'utf8');
code = code.replace(
  'supabase.auth.getSession().then(({ data: { session } }) => {',
  `Promise.race([
      supabase.auth.getSession(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 5000))
    ]).then(({ data: { session } }) => {`
);
code = code.replace(
  'setLoading(false);\n    });',
  `setLoading(false);\n    }).catch(err => {\n      console.error("Session fetch error:", err);\n      setLoading(false);\n    });`
);
fs.writeFileSync('src/admin/AdminRouter.tsx', code);
