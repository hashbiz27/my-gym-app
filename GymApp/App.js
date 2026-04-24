import "./global.css";

import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { supabase } from "./src/lib/supabase";
import AuthNavigator from "./src/navigation/AuthNavigator";
import MainNavigator from "./src/navigation/MainNavigator";

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // Restore existing session on launch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Keep session state in sync with Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => subscription.unsubscribe();
  }, []);

  // Show a spinner while the initial session check is in flight
  if (session === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {session ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
