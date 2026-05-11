import "./global.css";

import { useEffect, useRef, useState } from "react";
import { Animated, Image, View } from "react-native";
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

function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, speed: 14, bounciness: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#000000", alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={{ opacity, transform: [{ translateY }], alignItems: "center" }}>
        <Image
          source={require("./assets/icon.png")}
          style={{ width: 100, height: 100, resizeMode: "contain" }}
        />
        <Animated.Text
          style={{
            color: "#fff",
            fontSize: 28,
            fontWeight: "800",
            letterSpacing: 1,
            marginTop: 16,
          }}
        >
          LiftOff
        </Animated.Text>
        <Animated.Text
          style={{
            color: "#6b7280",
            fontSize: 13,
            marginTop: 6,
          }}
        >
          Loading your programme…
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

function Root() {
  const { isDark } = useAppTheme();
  const [session, setSession] = useState(undefined);
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
    return <SplashScreen />;
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
