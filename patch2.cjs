const fs = require('fs');
let code = fs.readFileSync('src/components/originkit/ui/pixelreveal.tsx', 'utf8');

code = code.replace(
    `const propsRef = useRef({
        gridSize,
        edgeHeight,
        direction,
        transition,
        transitionColor,
        onRevealComplete,
    })`,
    `const propsRef = useRef({
        gridSize,
        edgeHeight,
        direction,
        transition,
        transitionColor,
        onRevealComplete,
        reverse: false as boolean,
    })`
);

code = code.replace(
    `        propsRef.current = {
            gridSize,
            edgeHeight,
            direction,
            transition,
            transitionColor,
            onRevealComplete,
        }`,
    `        propsRef.current = {
            gridSize,
            edgeHeight,
            direction,
            transition,
            transitionColor,
            onRevealComplete,
            reverse: propsRef.current.reverse,
        }`
);

code = code.replace(
    `        progressRef.current = easeFn(linear)`,
    `        progressRef.current = propsRef.current.reverse ? (1 - easeFn(linear)) : easeFn(linear)`
);

code = code.replace(
    `        if (linear >= 1) {
            stopRaf()
            if (!completedRef.current) {`,
    `        if (linear >= 1) {
            if (propsRef.current.reverse) {
                progressRef.current = 0;
                draw();
            }
            stopRaf()
            if (!completedRef.current) {`
);

fs.writeFileSync('src/components/originkit/ui/pixelreveal.tsx', code);
