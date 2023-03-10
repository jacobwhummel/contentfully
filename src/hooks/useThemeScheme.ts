import { useColorScheme } from 'react-native';
import { ThemeState } from '../storage/reducers/theme';
import { useAppSelector } from '../storage/store';

export const useThemeScheme = (): Pick<
  ThemeState,
  'dark' | 'light' | 'theme'
> => {
  const { useSystemTheme, theme, dark, light } = useAppSelector(
    state => state.theme,
  );
  const isDarkMode = useColorScheme() === 'dark';

  if (useSystemTheme) {
    return isDarkMode
      ? { theme: 'dark', dark, light }
      : { theme: 'light', dark, light };
  } else {
    return { theme: theme, dark, light };
  }
};
