const fs = require('fs');
const file = 'src/components/originkit/ui/risinglines-variant-5.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'const deltaSec = (t - lastT) / 1000',
    'if (!isVisible) { rafRef.current = null; return; }\n            const deltaSec = (t - lastT) / 1000'
);

content = content.replace(
    'rafRef.current = requestAnimationFrame(loop)\n\n        return () => {',
    `const visibilityObserver = new IntersectionObserver((entries) => {
            if (entries[0]) {
                isVisible = entries[0].isIntersecting;
                if (isVisible && rafRef.current === null) {
                    lastT = performance.now();
                    rafRef.current = requestAnimationFrame(loop);
                }
            }
        }, { rootMargin: '100px' });
        visibilityObserver.observe(container);

        rafRef.current = requestAnimationFrame(loop)

        return () => {
            visibilityObserver.disconnect();`
);

fs.writeFileSync(file, content);
