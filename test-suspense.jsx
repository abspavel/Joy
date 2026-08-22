import React, { Suspense, useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';

const LazyComp = React.lazy(() => new Promise(resolve => setTimeout(() => resolve({ default: () => <div>Lazy</div> }), 10000)));

function App() {
  const [show, setShow] = useState(false);
  
  if (!show) return null;
  return <LazyComp />;
}

console.log(renderToString(<Suspense fallback={<div>Fallback</div>}><App /></Suspense>));
