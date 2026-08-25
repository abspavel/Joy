const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';",
  "import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';\nimport { motion, AnimatePresence } from 'motion/react';"
);

app = app.replace(
  `  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const scrollToHash = () => {
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          return true;
        }
        return false;
      };

      if (!scrollToHash()) {
        const observer = new MutationObserver(() => {
          if (scrollToHash()) {
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 3000);
      }
    } else {
      // Check if we have a saved scroll position for this specific history key
      const savedPosition = sessionStorage.getItem(\`scroll-\${key}\`);
      if (savedPosition) {
        // Wait a tick for rendering, then restore scroll
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition, 10));
        }, 50);
      } else {
        // New navigation without hash -> scroll to top
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash, key]);`,
  `  useEffect(() => {
    // Wait for exit animations to complete before restoring scroll position
    const timeout = setTimeout(() => {
      if (hash) {
        const id = hash.replace('#', '');
        const scrollToHash = () => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            return true;
          }
          return false;
        };

        if (!scrollToHash()) {
          const observer = new MutationObserver(() => {
            if (scrollToHash()) {
              observer.disconnect();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
          setTimeout(() => observer.disconnect(), 3000);
        }
      } else {
        const savedPosition = sessionStorage.getItem(\`scroll-\${key}\`);
        if (savedPosition) {
          window.scrollTo(0, parseInt(savedPosition, 10));
        } else {
          window.scrollTo(0, 0);
        }
      }
    }, 450); // Delay allows AnimatePresence exit animations (0.4s) to complete first

    return () => clearTimeout(timeout);
  }, [pathname, hash, key]);`
);

app = app.replace(
  `export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="*" element={<PublicSite />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`,
  `function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/contact" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <ContactPage />
          </motion.div>
        } />
        <Route path="/services/:slug" element={
          <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <ServiceDetailPage />
          </motion.div>
        } />
        <Route path="*" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <PublicSite />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TopProgressBar />
      <Suspense fallback={<PageSkeleton />}>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  );
}`
);

fs.writeFileSync('src/App.tsx', app);
