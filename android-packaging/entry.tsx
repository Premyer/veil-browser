import React from 'react';
import { createRoot } from 'react-dom/client';
import BrowserWorkspace from './src/components/browser-workspace';
import './src/styles.css';
const root = document.getElementById('root');
if (root) createRoot(root).render(<BrowserWorkspace />);
