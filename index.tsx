import React, { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('--- Index.tsx Executing ---');

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary to catch render errors
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error in application:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          fontFamily: 'sans-serif', 
          backgroundColor: '#fef2f2', 
          color: '#991b1b',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Something went wrong</h1>
          <p style={{ maxWidth: '600px', marginBottom: '24px' }}>The application encountered an error while rendering.</p>
          <pre style={{ 
            backgroundColor: 'rgba(255,255,255,0.5)', 
            padding: '16px', 
            borderRadius: '8px', 
            border: '1px solid #fca5a5',
            overflowX: 'auto',
            maxWidth: '90%'
          }}>
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '24px',
              padding: '10px 20px',
              backgroundColor: '#991b1b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('FATAL ERROR: Could not find root element with id "root"');
} else {
  console.log('Root element found, attempting to mount React app...');
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('React.render called successfully.');
  } catch (error) {
    console.error('ERROR during React mount:', error);
    // Attempt to render error to DOM if createRoot failed partially or logical error occurred before React took over
    if (rootElement) {
        rootElement.innerHTML = `<div style="color:red; padding: 20px;"><h3>Failed to mount application</h3><pre>${error}</pre></div>`;
    }
  }
}