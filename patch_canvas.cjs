const fs = require('fs');
let code = fs.readFileSync('src/components/originkit/ui/pixelreveal.tsx', 'utf8');

code = code.replace(
    `position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                    pointerEvents: "none",`,
    `position: "fixed",
                    top: 0, left: 0,
                    width: "100vw",
                    height: "100vh",
                    display: "block",
                    pointerEvents: "none",
                    zIndex: 9999,`
);

// We need to use window dimensions for grid building instead of container if it's fixed.
// Let's modify rebuildGrid
code = code.replace(
    `const cssW = rect.width
        const cssH = rect.height`,
    `const cssW = window.innerWidth
        const cssH = window.innerHeight`
);

// Fix TS errors by making gridSize and direction optional in Props
code = code.replace(
    `    gridSize: number`,
    `    gridSize?: number`
);
code = code.replace(
    `    direction: Direction`,
    `    direction?: Direction`
);

// Ensure container overflow isn't hidden so page can scroll
code = code.replace(
    `overflow: "hidden",`,
    `/* overflow: "hidden", */`
);

fs.writeFileSync('src/components/originkit/ui/pixelreveal.tsx', code);
