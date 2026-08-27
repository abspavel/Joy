const fs = require('fs');
let code = fs.readFileSync('src/components/originkit/ui/pixelreveal.tsx', 'utf8');

code = code.replace(
    `import { useEffect, useLayoutEffect, useRef } from "react"`,
    `import { useEffect, useLayoutEffect, useRef } from "react"\nimport { useIsPresent } from "motion/react"`
);

code = code.replace(
    `type Props = {`,
    `type Props = {\n    reverse?: boolean`
);

code = code.replace(
    `export default function PixelReveal(props: Props) {`,
    `export default function PixelReveal(props: Props) {
    const isPresent = useIsPresent()`
);

code = code.replace(
    `        progressRef.current = easeFn(linear)`,
    `        progressRef.current = propsRef.current.reverse ? (1 - easeFn(linear)) : easeFn(linear)`
);

code = code.replace(
    `        if (linear >= 1) {`,
    `        if (linear >= 1) {
            if (propsRef.current.reverse) {
                progressRef.current = 0;
                draw();
            }`
);

fs.writeFileSync('src/components/originkit/ui/pixelreveal.tsx', code);
