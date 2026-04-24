import { useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EXERCISE_GUIDES } from "../data/gymData";

const EXERCISES = Object.entries(EXERCISE_GUIDES)
  .map(([name, data]) => ({
    name,
    primary: data.muscles.primary,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function LibraryScreen({ navigation }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EXERCISES;
    return EXERCISES.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.primary.some((m) => m.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <View className="flex-1 bg-white">
      {/* Search bar */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 gap-x-2">
          <Ionicons name="search" size={16} color="#9ca3af" />
          <TextInput
            className="flex-1 py-2.5 text-sm text-gray-900"
            placeholder="Search exercises or muscles…"
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center px-4 py-3.5 border-b border-gray-50"
            onPress={() =>
              navigation.navigate("ExerciseDetail", { name: item.name })
            }
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900">
                {item.name}
              </Text>
              <Text className="text-xs text-gray-400 mt-0.5">
                {item.primary.join(" · ")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="py-16 items-center">
            <Ionicons name="search-outline" size={32} color="#d1d5db" />
            <Text className="text-gray-400 text-sm mt-3">
              No exercises match "{query}"
            </Text>
          </View>
        }
      />
    </View>
  );
}
