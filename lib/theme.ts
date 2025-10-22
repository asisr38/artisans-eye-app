/**
 * Centralized theme configuration for The Artisan's Eye
 * Unified dark color scheme with futuristic/old-school visual treatments
 */

export const theme = {
  colors: {
    // Primary dark color scheme
    background: {
      primary: '#0D0D10',      // Main page background
      secondary: '#1A1A1F',    // Card backgrounds
      tertiary: '#25252A',     // Elevated surfaces
    },
    
    // Text colors
    text: {
      primary: '#E4E4E8',      // Primary text
      secondary: '#8A8A9B',    // Secondary text
      tertiary: '#5A5A6B',     // Muted text
      accent: '#FFAB1E',       // Accent text
    },
    
    // Accent colors
    accent: {
      primary: '#FFAB1E',      // Main accent
      secondary: '#FFB74D',    // Lighter accent
      tertiary: '#FF8F00',     // Darker accent
    },
    
    // Status colors
    status: {
      active: '#10B981',       // Green for active items
      sold: '#6B7280',         // Gray for sold items
      warning: '#F59E0B',      // Warning states
      error: '#EF4444',        // Error states
    },
    
    // Interactive elements
    interactive: {
      hover: 'rgba(255, 171, 30, 0.1)',  // Subtle hover overlay
      focus: 'rgba(255, 171, 30, 0.2)',  // Focus ring
      disabled: 'rgba(138, 138, 155, 0.3)', // Disabled state
    },
    
    // Glassmorphism
    glass: {
      background: 'rgba(13, 13, 16, 0.6)',  // Semi-transparent dark
      border: 'rgba(255, 255, 255, 0.1)',   // Subtle border
      backdrop: 'blur(12px)',               // Backdrop filter
    },
    
    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #FFB74D 0%, #FFAB1E 100%)',
      secondary: 'linear-gradient(135deg, rgba(255, 171, 30, 0.1) 0%, rgba(255, 183, 77, 0.05) 100%)',
      background: 'linear-gradient(135deg, #0D0D10 0%, #1A1A1F 100%)',
    },
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.4)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.5)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// CSS Custom Properties for easy theme switching
export const cssVariables = {
  '--color-background-primary': theme.colors.background.primary,
  '--color-background-secondary': theme.colors.background.secondary,
  '--color-background-tertiary': theme.colors.background.tertiary,
  '--color-text-primary': theme.colors.text.primary,
  '--color-text-secondary': theme.colors.text.secondary,
  '--color-text-tertiary': theme.colors.text.tertiary,
  '--color-text-accent': theme.colors.text.accent,
  '--color-accent-primary': theme.colors.accent.primary,
  '--color-accent-secondary': theme.colors.accent.secondary,
  '--color-accent-tertiary': theme.colors.accent.tertiary,
  '--color-status-active': theme.colors.status.active,
  '--color-status-sold': theme.colors.status.sold,
  '--color-status-warning': theme.colors.status.warning,
  '--color-status-error': theme.colors.status.error,
  '--color-interactive-hover': theme.colors.interactive.hover,
  '--color-interactive-focus': theme.colors.interactive.focus,
  '--color-interactive-disabled': theme.colors.interactive.disabled,
  '--color-glass-background': theme.colors.glass.background,
  '--color-glass-border': theme.colors.glass.border,
  '--backdrop-blur': theme.colors.glass.backdrop,
  '--gradient-primary': theme.colors.gradients.primary,
  '--gradient-secondary': theme.colors.gradients.secondary,
  '--gradient-background': theme.colors.gradients.background,
  '--shadow-sm': theme.shadows.sm,
  '--shadow-md': theme.shadows.md,
  '--shadow-lg': theme.shadows.lg,
  '--shadow-xl': theme.shadows.xl,
  '--shadow-glass': theme.shadows.glass,
  '--transition-fast': theme.transitions.fast,
  '--transition-normal': theme.transitions.normal,
  '--transition-slow': theme.transitions.slow,
} as const;

// Utility functions for theme usage
export const getThemeColor = (path: string) => {
  const keys = path.split('.');
  let value: any = theme;
  for (const key of keys) {
    value = value[key];
  }
  return value;
};

export const getCSSVariable = (name: string) => `var(${name})`;

// Component-specific theme helpers
export const cardStyles = {
  background: theme.colors.background.secondary,
  border: `1px solid ${theme.colors.glass.border}`,
  borderRadius: theme.borderRadius.md,
  boxShadow: theme.shadows.md,
  padding: theme.spacing.lg,
  transition: theme.transitions.fast,
};

export const buttonStyles = {
  primary: {
    background: theme.colors.gradients.primary,
    color: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    transition: theme.transitions.fast,
    '&:hover': {
      filter: 'brightness(0.9)',
      transform: 'translateY(-1px)',
    },
  },
  secondary: {
    background: theme.colors.background.tertiary,
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.glass.border}`,
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    transition: theme.transitions.fast,
    '&:hover': {
      background: theme.colors.interactive.hover,
      borderColor: theme.colors.accent.primary,
    },
  },
};

export const glassmorphismStyles = {
  background: theme.colors.glass.background,
  backdropFilter: theme.colors.glass.backdrop,
  border: `1px solid ${theme.colors.glass.border}`,
  borderRadius: theme.borderRadius.lg,
  boxShadow: theme.shadows.glass,
};

export default theme;
