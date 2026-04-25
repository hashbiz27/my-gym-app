import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Colors } from "../../theme";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setLoading(false);
      Alert.alert("Sign up failed", error.message);
      return;
    }

    // Create a matching profiles row for the new user
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ user_id: userId });

      if (profileError) {
        // Non-fatal: user exists but profile insert failed; log and continue
        console.warn("Profile insert failed:", profileError.message);
      }
    }

    setLoading(false);
    // If email confirmation is enabled, prompt user; otherwise onAuthStateChange handles navigation
    if (!data.session) {
      Alert.alert(
        "Check your email",
        "We sent you a confirmation link. Please verify your email before signing in."
      );
      navigation.navigate("Login");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Create account</Text>
          <Text className="text-gray-500 mb-8">Start tracking your workouts</Text>

          <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
            placeholder="Min. 6 characters"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            className="bg-indigo-600 rounded-lg py-3 items-center mb-4"
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text className="text-white font-semibold text-base">Create account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-center text-gray-500">
              Already have an account?{" "}
              <Text className="text-indigo-600 font-semibold">Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
