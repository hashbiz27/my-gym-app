import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LibraryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Ionicons name="library-outline" size={56} color="#4f46e5" />
      <Text className="text-2xl font-bold text-gray-900 mt-4">Exercise Library</Text>
      <Text className="text-base text-gray-400 mt-2 text-center">
        Browse and search all exercises and muscle guides.
      </Text>
    </View>
  );
}
