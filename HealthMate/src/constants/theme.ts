export const THEME = {
  colors: {
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    secondary: '#10B981', 
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    danger: '#fd4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',

    water: '#0EA5E9', 
    waterLight: '#E0F2FE',
    waterDark: '#0369A1',

    calories: '#EA580C', 
    caloriesLight: '#FFEDD5',
    caloriesDark: '#C2410C',

    steps: '#b910a5', 
    stepsLight: '#DCFCE7',
    stepsDark: 'rgb(128, 21, 91)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 18,
    xl: 24,
    full: 9999,
  },
  elevation: {
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    hover: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
  },
};

export const DEFAULT_GOALS = {
  stepsGoal: 8000, 
  caloriesGoal: 500, 
  waterGoal: 2500, 
};
