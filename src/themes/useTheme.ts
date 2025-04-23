import { colors, fonts } from './theme';

export const useTheme = () => {
  return {
    colors,
    fonts,
    spacing: (multiplier: number) => multiplier * 4,
  };
};
