import "./global.css";

import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { supabase } from "./src/lib/supabase";
import AuthNavigator from "./src/navigation/AuthNavigator";
import MainNavigator from "./src/navigation/MainNavigator";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import { ThemeProvider, useAppTheme } from "./src/context/ThemeContext";
import { SyncProvider } from "./src/context/SyncContext";
import { Colors } from "./src/theme";

function Root() {
  const { isDark } = useAppTheme();
  const [session, setSession] = useState(undefined);
  // null = not yet checked; true = needs onboarding; false = profile complete
  const [needsOnboarding, setNeedsOnboarding] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) setNeedsOnboarding(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setNeedsOnboarding(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // After session is known, check whether the profile has a regime set
  useEffect(() => {
    if (!session) return;
    supabase
      .from("profiles")
      .select("regime")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setNeedsOnboarding(!data?.regime);
      });
  }, [session]);

  const isLoading = session === undefined || (session && needsOnboarding === null);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {!session ? (
        <AuthNavigator />
      ) : needsOnboarding ? (
        <OnboardingScreen onComplete={() => setNeedsOnboarding(false)} />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SyncProvider>
          <BottomSheetModalProvider>
            <Root />
          </BottomSheetModalProvider>
        </SyncProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
