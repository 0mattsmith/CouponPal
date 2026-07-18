import React from 'react';
import { createRoot } from 'react-dom/client';
import AutoApplyWidget from './components/AutoApplyWidget';
import styles from './index.css?inline';

// Only inject if there's a promo code field on the page
if (document.getElementById('promo-code')) {
  // Create host element
  const host = document.createElement('div');
  host.id = 'couponpal-extension-root';
  document.body.appendChild(host);

  // Attach shadow DOM
  const shadowRoot = host.attachShadow({ mode: 'open' });

  // Inject global styles
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  shadowRoot.appendChild(styleElement);

  // Create React mount point
  const container = document.createElement('div');
  shadowRoot.appendChild(container);

  // Render widget
  const root = createRoot(container);
  root.render(<AutoApplyWidget />);
}
