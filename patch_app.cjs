const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import PixelReveal')) {
    code = code.replace(
        `import { useSEO } from './hooks/useSEO';`,
        `import { useSEO } from './hooks/useSEO';\nimport PixelReveal from './components/originkit/ui/pixelreveal';`
    );
}

code = code.replace(
    `<motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <ServiceDetailPage />
          </motion.div>`,
    `<motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <PixelReveal transitionColor="#0f172a" transition={{ duration: 1.2 }} edgeHeight={4}>
              <ServiceDetailPage />
            </PixelReveal>
          </motion.div>`
);

fs.writeFileSync('src/App.tsx', code);
