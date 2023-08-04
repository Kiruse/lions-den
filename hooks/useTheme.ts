import { useMemo } from 'react'
import { MD3Theme, useTheme as useBaseTheme } from 'react-native-paper'
import tinycolor from 'tinycolor2';

type ColorLevels = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type CustomTheme = MD3Theme & {
  /** Shades of gray from 0-10. 0 represents pure black and 10 represents pure white. Numbers in between are corresponding shades. */
  colors: MD3Theme['colors'] & {
    grey: Record<ColorLevels, string>;
  };
};

export default function useTheme() {
  const baseTheme = useBaseTheme();
  const theme = useMemo<CustomTheme>(() => ({
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      grey: Object.fromEntries(Array(11).fill(0).map(
        (_, i) => [i as ColorLevels, tinycolor(`hsl(0 0 ${i * 10}%)`).toRgbString()]
      )) as any,
    },
  }), [baseTheme]);
  return theme;
}
