
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { EnsayosProvider } from './context/EnsayosContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <EnsayosProvider>
      <App />
    </EnsayosProvider>
  </React.StrictMode>
);
