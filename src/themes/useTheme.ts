// themes/useTheme.ts
import { colors, fonts } from './theme';

export const useTheme = () => {
  // Add any theme-related logic here if needed
  return {
    colors,
    fonts,
    spacing: (multiplier: number) => multiplier * 4, // 4px base unit
  };
};

// Usage in components:
// const { colors, fonts, spacing } = useTheme();