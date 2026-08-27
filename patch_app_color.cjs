const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
    `transitionColor="#0f172a"`,
    `transitionColor="#0C0C0C"`
);
fs.writeFileSync('src/App.tsx', code);
