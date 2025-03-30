import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App.jsx';

// Add preload links
const preloadResources = () => {
  const links = [
    { rel: 'preload', href: '/img/front-view-woman-posing-ethereal-environment.jpg', as: 'image' },
    { rel: 'preload', href: '/img/futuristic.jpg', as: 'image' },
  ];

  links.forEach(({ rel, href, as }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
};

preloadResources();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);