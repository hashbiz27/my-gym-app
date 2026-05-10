import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { LayoutAnimation, Platform, UIManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import { useColorScheme } from "nativewind";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const THEME_KEY = "gym_theme";
const BG_DARK = "#111827";
const BG_LIGHT = "#ffffff";

const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const { setColorScheme } = useColorScheme();

  // Restore persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((value) => {
      if (value === "dark") {
        setIsDark(true);
        setColorScheme("dark");
        SystemUI.setBackgroundColorAsync(BG_DARK);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync NativeWind + SystemUI whenever isDark changes
  useEffect(() => {
    setColorScheme(isDark ? "dark" : "light");
    SystemUI.setBackgroundColorAsync(isDark ? BG_DARK : BG_LIGHT);
  }, [isDark, setColorScheme]);

  const toggleTheme = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
