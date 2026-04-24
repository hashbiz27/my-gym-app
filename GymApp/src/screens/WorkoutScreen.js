import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WorkoutScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Ionicons name="barbell-outline" size={56} color="#4f46e5" />
      <Text className="text-2xl font-bold text-gray-900 mt-4">Today's Workout</Text>
      <Text className="text-base text-gray-400 mt-2 text-center">
        Your session for today will appear here.
      </Text>
    </View>
  );
}
