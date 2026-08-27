const fs = require('fs');
let code = fs.readFileSync('src/components/originkit/ui/pixelreveal.tsx', 'utf8');

code = code.replace(
    `direction: "up",`,
    `direction: "up" as Direction,`
);

code = code.replace(
    `props = { ...COMPONENT_DEFAULTS, ...props }`,
    `props = { ...COMPONENT_DEFAULTS, ...props } as Props`
);

fs.writeFileSync('src/components/originkit/ui/pixelreveal.tsx', code);
