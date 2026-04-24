import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

export default function SettingsScreen() {
  async function handleSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) Alert.alert("Error", error.message);
          // onAuthStateChange in App.js handles the redirect to Login
        },
      },
    ]);
  }

  return (
    <View className="flex-1 bg-white px-6">
      <View className="flex-1 items-center justify-center">
        <Ionicons name="settings-outline" size={56} color="#4f46e5" />
        <Text className="text-2xl font-bold text-gray-900 mt-4">Settings</Text>
        <Text className="text-base text-gray-400 mt-2 text-center">
          Preferences and account options will appear here.
        </Text>
      </View>

      <TouchableOpacity
        className="mb-10 flex-row items-center justify-center gap-x-2 rounded-lg border border-red-200 py-3"
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={18} color="#dc2626" />
        <Text className="text-red-600 font-semibold text-base">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
