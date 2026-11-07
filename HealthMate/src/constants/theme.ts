export const THEME = {
  colors: {
    primary: '#2563EB', // Vibrant Health Blue
    primaryLight: '#DBEAFE',
    secondary: '#10B981', // Emerald Green
    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',

    // Specific Metric Color Scheme required by Coursework Brief:
    water: '#0284C7', // Blue for Water Intake
    waterLight: '#E0F2FE',
    waterDark: '#0369A1',

    calories: '#EA580C', // Orange/Red for Calories Burned
    caloriesLight: '#FFEDD5',
    caloriesDark: '#C2410C',

    steps: '#16A34A', // Green for Steps Walked
    stepsLight: '#DCFCE7',
    stepsDark: '#15803D',
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
  stepsGoal: 8000, // 8,000 steps per day
  caloriesGoal: 500, // 500 kcal per day
  waterGoal: 2500, // 2,500 ml per day
};
