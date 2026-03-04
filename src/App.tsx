import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { AppRouter } from './routes/AppRouter';
import './index.css';

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#dcfce7' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fee2e2' },
          },
        }}
      />
    </AppProvider>
  );
}
