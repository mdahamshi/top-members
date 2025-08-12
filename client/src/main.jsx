import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { AppProvider } from './context/AppContext';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { routefromelement } from './routes';
import { MessageProvider } from './context/MessageContext';
import { AuthProvider } from './context/AuthContext';
const router = createBrowserRouter(routefromelement);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
