import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EXERCISES = [
  {
    id: "1",
    name: "Barbell Bench Press",
    note: "Primary chest driver",
    sets: "4",
    reps: "6–8",
    rest: "2–3 min",
    target: "60–80 kg",
  },
  {
    id: "2",
    name: "Barbell Bent-Over Row",
    note: "Upper back thickness",
    sets: "4",
    reps: "6–8",
    rest: "2–3 min",
    target: "55–75 kg",
  },
  {
    id: "3",
    name: "Overhead Press",
    note: "Front delt + upper chest",
    sets: "3",
    reps: "8–10",
    rest: "2 min",
    target: "40–55 kg",
  },
];

function ExerciseCard({ item, index }) {
  return (
    <View className="mx-4 mt-3 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Card header */}
      <View className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          {/* Number + name row */}
          <View className="flex-row items-center gap-x-2">
            <Text className="text-xs text-gray-300 font-mono">
              {String(index + 1).padStart(2, "0")}
            </Text>
            <Text className="text-sm font-bold text-gray-900">{item.name}</Text>
          </View>

          {/* Coach note */}
          <Text className="text-xs text-gray-400 italic mt-0.5 ml-5">
            {item.note}
          </Text>

          {/* Target weight */}
          <Text className="text-xs text-gray-500 mt-0.5 ml-5">
            Target: <Text className="font-semibold">{item.target}</Text>
          </Text>

          {/* Swap button — greyed out placeholder */}
          <TouchableOpacity
            className="mt-1.5 self-start ml-5"
            disabled
            activeOpacity={1}
          >
            <Text className="text-xs text-gray-300">Swap</Text>
          </TouchableOpacity>
        </View>

        {/* Sets × reps + rest */}
        <View className="items-end">
          <Text className="text-xs font-semibold text-gray-600">
            {item.sets} × {item.reps}
          </Text>
          <Text className="text-xs text-gray-400 mt-0.5">{item.rest}</Text>
        </View>
      </View>

      {/* Sets placeholder rows */}
      <View className="px-4 py-3 gap-y-2">
        {Array.from({ length: parseInt(item.sets) }).map((_, i) => (
          <View key={i} className="flex-row items-center gap-x-2">
            <Text className="w-5 text-xs text-gray-300 text-center font-bold">
              {i + 1}
            </Text>

            {/* kg input placeholder */}
            <View className="flex-1 border border-gray-200 rounded-lg py-2 items-center">
              <Text className="text-sm text-gray-300">—</Text>
            </View>

            {/* reps input placeholder */}
            <View className="flex-1 border border-gray-200 rounded-lg py-2 items-center">
              <Text className="text-sm text-gray-300">—</Text>
            </View>

            {/* 1RM placeholder */}
            <Text className="w-10 text-xs text-gray-200 text-right">—</Text>

            {/* Done checkbox placeholder */}
            <View className="w-7 h-7 rounded border-2 border-gray-200 bg-white" />

            {/* Remove placeholder */}
            <View className="w-6 h-6 rounded border border-gray-100 items-center justify-center">
              <Text className="text-gray-300 text-sm leading-none">×</Text>
            </View>
          </View>
        ))}

        {/* Add set */}
        <View className="mt-1 py-2 border border-dashed border-gray-100 rounded-lg items-center">
          <Text className="text-xs text-gray-300">+ add set</Text>
        </View>
      </View>
    </View>
  );
}

function WorkoutHeader() {
  return (
    <View className="bg-gray-900 px-5 pt-4 pb-4">
      {/* Date line */}
      <Text className="text-xs tracking-widest uppercase text-gray-500 mb-1">
        Mon 24 Apr 2026
      </Text>

      {/* Session title + set count */}
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-xl font-bold text-white">Upper A</Text>
          <Text className="text-xs text-gray-400 italic mt-0.5">
            Strength Focus · Compound-heavy
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-2xl font-bold text-white">
            0<Text className="text-sm text-gray-500">/18</Text>
          </Text>
          <Text className="text-xs text-gray-500 uppercase tracking-wider">
            sets done
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-1 bg-gray-700 rounded-full mt-3">
        <View className="h-1 bg-green-500 rounded-full w-0" />
      </View>
    </View>
  );
}

function ListFooter() {
  return (
    <View className="mx-4 mt-5 mb-8">
      {/* Notes placeholder */}
      <Text className="text-xs tracking-widest uppercase text-gray-400 mb-2">
        Session notes
      </Text>
      <View className="border border-gray-200 rounded-xl px-4 py-3 bg-white h-20 justify-start">
        <Text className="text-sm text-gray-300">
          How did it feel? PRs, injuries, observations…
        </Text>
      </View>

      {/* Finish / Discard */}
      <View className="flex-row mt-4 gap-x-3">
        <View className="flex-1 bg-green-600 rounded-xl py-3.5 items-center">
          <Text className="text-white font-bold text-sm">Finish Workout</Text>
        </View>
        <View className="px-5 py-3.5 rounded-xl border border-gray-200 items-center">
          <Text className="text-gray-400 font-semibold text-sm">Discard</Text>
        </View>
      </View>
    </View>
  );
}

export default function WorkoutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <WorkoutHeader />

      <FlatList
        data={EXERCISES}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ExerciseCard item={item} index={index} />
        )}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ paddingBottom: 16 }}
        className="flex-1"
      />
    </SafeAreaView>
  );
}
