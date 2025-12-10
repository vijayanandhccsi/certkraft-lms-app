import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('--- Index.tsx Executing ---');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('FATAL ERROR: Could not find root element with id "root"');
} else {
  console.log('Root element found, attempting to mount React app...');
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React.render called successfully.');
  } catch (error) {
    console.error('ERROR during React mount:', error);
  }
}