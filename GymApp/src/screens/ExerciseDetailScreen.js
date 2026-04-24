import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EXERCISE_GUIDES } from "../data/gymData";

export default function ExerciseDetailScreen({ route }) {
  const { name } = route.params;
  const guide = EXERCISE_GUIDES[name];

  function openYouTube() {
    const query = encodeURIComponent(name).replace(/%20/g, "+");
    Linking.openURL(
      `https://www.youtube.com/results?search_query=${query}+exercise+form+tutorial`
    );
  }

  if (!guide) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Text className="text-gray-400 text-sm text-center">
          No guide available for this exercise.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* ── Muscles ── */}
      <View className="px-5 pt-5 pb-4 border-b border-gray-100">
        <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Muscles
        </Text>
        <View className="flex-row flex-wrap gap-x-2 gap-y-2">
          {guide.muscles.primary.map((m) => (
            <View key={m} className="bg-green-100 rounded-full px-3 py-1">
              <Text className="text-xs font-semibold text-green-800">{m}</Text>
            </View>
          ))}
          {guide.muscles.secondary.map((m) => (
            <View key={m} className="bg-gray-100 rounded-full px-3 py-1">
              <Text className="text-xs font-semibold text-gray-500">{m}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── How to perform ── */}
      <View className="px-5 pt-4 pb-4 border-b border-gray-100">
        <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          How to perform
        </Text>
        {guide.steps.map((step, i) => (
          <View key={i} className="flex-row mb-3">
            <View className="w-6 h-6 rounded-full bg-indigo-100 items-center justify-center mr-3 mt-0.5 shrink-0">
              <Text className="text-xs font-bold text-indigo-600">{i + 1}</Text>
            </View>
            <Text className="flex-1 text-sm text-gray-700 leading-5">
              {step}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Key cues ── */}
      <View className="px-5 pt-4 pb-4 border-b border-gray-100">
        <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Key cues
        </Text>
        {guide.cues.map((cue, i) => (
          <View key={i} className="flex-row items-start mb-2.5">
            <View className="mt-0.5 mr-3 shrink-0">
              <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            </View>
            <Text className="flex-1 text-sm text-gray-700 leading-5">
              {cue}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Common mistakes ── */}
      <View className="px-5 pt-4 pb-5 border-b border-gray-100">
        <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Common mistakes
        </Text>
        {guide.mistakes.map((mistake, i) => (
          <View key={i} className="flex-row items-start mb-2.5">
            <View className="mt-0.5 mr-3 shrink-0">
              <Ionicons name="alert-circle" size={16} color="#dc2626" />
            </View>
            <Text className="flex-1 text-sm text-gray-700 leading-5">
              {mistake}
            </Text>
          </View>
        ))}
      </View>

      {/* ── YouTube button ── */}
      <View className="px-5 pt-5">
        <TouchableOpacity
          className="flex-row items-center justify-center gap-x-2 bg-red-600 rounded-xl py-3.5"
          onPress={openYouTube}
          activeOpacity={0.85}
        >
          <Ionicons name="logo-youtube" size={20} color="white" />
          <Text className="text-white font-bold text-sm">
            Watch on YouTube
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
