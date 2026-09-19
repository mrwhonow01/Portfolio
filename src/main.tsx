import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initBackgroundPreloader } from './utils/imagePreloader';

// Start intelligent idle background preloading
initBackgroundPreloader();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
