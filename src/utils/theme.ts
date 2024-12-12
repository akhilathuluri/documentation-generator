export const theme = {
  colors: {
    primary: {
      light: '#60A5FA', // blue-400
      DEFAULT: '#3B82F6', // blue-500
      dark: '#2563EB', // blue-600
    },
    success: {
      light: '#4ADE80', // green-400
      DEFAULT: '#22C55E', // green-500
      dark: '#16A34A', // green-600
    },
    warning: {
      light: '#FBBF24', // yellow-400
      DEFAULT: '#F59E0B', // yellow-500
      dark: '#D97706', // yellow-600
    },
    error: {
      light: '#F87171', // red-400
      DEFAULT: '#EF4444', // red-500
      dark: '#DC2626', // red-600
    },
  },
  animation: {
    slideIn: 'slideIn 0.3s ease-out',
    fadeIn: 'fadeIn 0.3s ease-out',
    scaleIn: 'scaleIn 0.2s ease-out',
  },
};

export const animations = `
  @keyframes slideIn {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`; 