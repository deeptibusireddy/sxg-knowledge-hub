import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './auth/msalConfig';
import { ThemeProvider } from './contexts/ThemeProvider';
import './index.css';
import App from './App.tsx';

// MSAL v3 requires explicit initialization before rendering.
msalInstance.initialize().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MsalProvider>
    </StrictMode>,
  );
});
