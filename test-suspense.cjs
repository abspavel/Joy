const React = require('react');
const { renderToString } = require('react-dom/server');

const LazyComp = React.lazy(() => new Promise(resolve => setTimeout(() => resolve({ default: () => React.createElement('div', null, 'Lazy') }), 10000)));

function App() {
  const [show, setShow] = React.useState(false);
  
  if (!show) return null;
  return React.createElement(LazyComp);
}

console.log(renderToString(React.createElement(React.Suspense, { fallback: React.createElement('div', null, 'Fallback') }, React.createElement(App))));
