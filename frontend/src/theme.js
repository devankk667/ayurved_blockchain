export const theme = {
  colors: {
    primary: {
      main: '#4F46E5',
      light: '#6366F1',
      dark: '#4338CA',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
      light: '#334155',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      disabled: '#64748B',
    },
    error: {
      main: '#EF4444',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      dark: '#D97706',
    },
    success: {
      main: '#10B981',
      dark: '#059669',
    },
    divider: '#2D3748',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
  ],
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};

export const GlobalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  :root {
    --primary-main: ${theme.colors.primary.main};
    --primary-light: ${theme.colors.primary.light};
    --primary-dark: ${theme.colors.primary.dark};
    --background-default: ${theme.colors.background.default};
    --background-paper: ${theme.colors.background.paper};
    --text-primary: ${theme.colors.text.primary};
    --text-secondary: ${theme.colors.text.secondary};
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: ${theme.typography.fontFamily};
    background-color: var(--background-default);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
  }
  
  a {
    color: var(--primary-main);
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--primary-light);
    }
  }
  
  button, input, textarea, select {
    font-family: inherit;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .card {
    background: var(--background-paper);
    border-radius: ${theme.shape.borderRadius}px;
    box-shadow: ${theme.shadows[2]};
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: box-shadow 0.3s ease, transform 0.2s ease;
    
    &:hover {
      box-shadow: ${theme.shadows[4]};
      transform: translateY(-2px);
    }
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 1.25rem;
    border-radius: ${theme.shape.borderRadius}px;
    font-weight: 500;
    font-size: 0.9375rem;
    line-height: 1.5;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    
    &-primary {
      background-color: var(--primary-main);
      color: white;
      
      &:hover {
        background-color: var(--primary-dark);
      }
    }
    
    &-outlined {
      background-color: transparent;
      border: 1px solid var(--primary-main);
      color: var(--primary-main);
      
      &:hover {
        background-color: rgba(79, 70, 229, 0.1);
      }
    }
    
    &-text {
      background-color: transparent;
      color: var(--primary-main);
      padding: 0.5rem 0.75rem;
      
      &:hover {
        background-color: rgba(79, 70, 229, 0.1);
      }
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;
