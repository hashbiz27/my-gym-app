import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, InteractionManager, Text, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetBackdrop,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { getAllExerciseNamesWithMuscles, scoreOneExercise, scoreColor } from "../data/compatibility";
import { Colors } from "../theme";

const CHUNK_SIZE = 40;

// mode: "swap" (session-only) | "override" (permanent)
export default function SwapModal({
  visible,
  exerciseName,
  sessionExercises,
  slotIndex,
  originalName,
  mode = "swap",
  onSwap,
  onClose,
}) {
  const sheetRef = useRef(null);
  const [search, setSearch] = useState("");
  const [ranked, setRanked] = useState([]);
  const [computing, setComputing] = useState(false);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  // Score exercises progressively in chunks after the sheet animation finishes.
  // This keeps the open animation smooth and shows results as they come in.
  useEffect(() => {
    if (!visible || !exerciseName) {
      setRanked([]);
      return;
    }
    setComputing(true);
    setRanked([]);

    let cancelled = false;
    const sessionNames = (sessionExercises ?? []).map((e) => e.name);

    const task = InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;

      // Pool is cached after first call — subsequent opens are instant
      const pool = Object.entries(getAllExerciseNamesWithMuscles())
        .filter(([name]) => name !== exerciseName);

      let index = 0;
      let accumulated = [];

      function processChunk() {
        if (cancelled) return;
        const chunk = pool.slice(index, index + CHUNK_SIZE);
        chunk.forEach(([name, muscles]) => {
          accumulated.push(scoreOneExercise(name, muscles, sessionNames, exerciseName, slotIndex));
        });
        // Sort and publish after each chunk so results appear progressively
        const sorted = [...accumulated].sort((a, b) => b.score - a.score);
        setRanked(sorted);
        index += CHUNK_SIZE;
        if (index < pool.length) {
          setTimeout(processChunk, 0);
        } else {
          setComputing(false);
        }
      }

      processChunk();
    });

    return () => {
      cancelled = true;
      task.cancel();
    };
  }, [visible, exerciseName, sessionExercises, slotIndex]);

  const results = search.trim()
    ? ranked.filter((e) => e.name.toLowerCase().includes(search.trim().toLowerCase()))
    : ranked;

  function handleDismiss() {
    setSearch("");
    onClose();
  }

  function handleSelect(name) {
    setSearch("");
    onSwap(name);
  }

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
        pressBehavior="close"
      />
    ),
    []
  );

  const isOverride = mode === "override";

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["75%"]}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: Colors.gray200, width: 40 }}
    >
      {/* Header */}
      <View className="px-4 pb-3 border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-0.5">
          <Text className="text-lg font-bold text-gray-900">
            {isOverride ? "Override Exercise" : "Swap Exercise"}
          </Text>
          <TouchableOpacity onPress={handleDismiss} className="p-1">
            <Ionicons name="close" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <Text className="text-xs mb-1" style={{ color: isOverride ? "#b45309" : Colors.textMuted }}>
          {isOverride
            ? "Permanent — replaces this exercise in all future sessions"
            : "Session only — reverts after this workout ends"}
        </Text>
        <Text className="text-xs text-gray-400 mb-3">
          Replacing:{" "}
          <Text className="text-gray-600 font-semibold">{exerciseName}</Text>
        </Text>
        <BottomSheetTextInput
          style={{
            backgroundColor: Colors.gray50,
            borderWidth: 1,
            borderColor: Colors.gray200,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 14,
            color: Colors.gray900,
          }}
          placeholder="Search exercises…"
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
      </View>

      {/* List or loader */}
      {computing ? (
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator color={Colors.primary} />
          <Text className="text-xs text-gray-400 mt-3">Scoring compatibility…</Text>
        </View>
      ) : (
        <BottomSheetFlatList
          data={results}
          keyExtractor={(item) => item.name}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const { bg, text: textCol } = scoreColor(item.score);
            const isOriginal = item.name === originalName;
            return (
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-50"
                onPress={() => handleSelect(item.name)}
              >
                <View className="flex-1 mr-3">
                  <Text className="text-sm font-semibold text-gray-900">
                    {item.name}
                    {isOriginal && (
                      <Text className="text-xs text-indigo-500"> (original)</Text>
                    )}
                  </Text>
                  {item.muscles.primary.length > 0 && (
                    <Text className="text-xs text-gray-400 mt-0.5">
                      {item.muscles.primary.slice(0, 3).join(" · ")}
                    </Text>
                  )}
                </View>
                <View className="rounded px-2 py-0.5" style={{ backgroundColor: bg }}>
                  <Text className="text-xs font-bold" style={{ color: textCol }}>
                    {item.score} — {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View className="py-12 items-center">
              <Text className="text-gray-400 text-sm">No exercises found</Text>
            </View>
          }
        />
      )}
    </BottomSheetModal>
  );
}
