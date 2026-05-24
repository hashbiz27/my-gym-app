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

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    Alert.alert(
      "Check your email",
      "If an account exists for that email, you'll receive a password reset link shortly.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset password</Text>
          <Text className="text-gray-500 dark:text-gray-400 mb-8">
            Enter your email and we'll send you a reset link.
          </Text>

          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 mb-6 text-gray-900 dark:text-white"
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            returnKeyType="done"
            onSubmitEditing={handleReset}
          />

          <TouchableOpacity
            className="bg-indigo-600 rounded-lg py-3 items-center mb-4"
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text className="text-white font-semibold text-base">Send reset link</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-center text-gray-500 dark:text-gray-400">
              Back to{" "}
              <Text className="text-indigo-600 dark:text-indigo-400 font-semibold">Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
