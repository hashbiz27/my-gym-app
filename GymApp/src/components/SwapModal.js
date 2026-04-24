import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetBackdrop,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { scoreAllExercises, scoreColor } from "../data/compatibility";

export default function SwapModal({
  visible,
  exerciseName,
  sessionExercises,
  slotIndex,
  originalName,
  onSwap,
  onClose,
}) {
  const sheetRef = useRef(null);
  const [search, setSearch] = useState("");
  const snapPoints = useMemo(() => ["75%"], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  // scoreAllExercises is CPU-heavy; only recompute when the target exercise changes
  const ranked = useMemo(() => {
    if (!visible || !exerciseName || !sessionExercises?.length) return [];
    return scoreAllExercises(sessionExercises, exerciseName, slotIndex);
  }, [visible, exerciseName, sessionExercises, slotIndex]);

  const results = search.trim()
    ? ranked.filter((e) =>
        e.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : ranked;

  function handleDismiss() {
    setSearch("");
    onClose();
  }

  function handleSwap(name) {
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

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#e5e7eb", width: 40 }}
    >
      {/* Header */}
      <View className="px-4 pb-3 border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-lg font-bold text-gray-900">
            Swap Exercise
          </Text>
          <TouchableOpacity onPress={handleDismiss} className="p-1">
            <Ionicons name="close" size={22} color="#9ca3af" />
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-400 mb-3">
          Replacing:{" "}
          <Text className="text-gray-600 font-semibold">{exerciseName}</Text>
        </Text>
        <BottomSheetTextInput
          style={{
            backgroundColor: "#f9fafb",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 14,
            color: "#111827",
          }}
          placeholder="Search exercises…"
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
      </View>

      {/* Ranked list */}
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
              onPress={() => handleSwap(item.name)}
            >
              <View className="flex-1 mr-3">
                <Text className="text-sm font-semibold text-gray-900">
                  {item.name}
                  {isOriginal && (
                    <Text className="text-xs text-indigo-500">
                      {" "}(original)
                    </Text>
                  )}
                </Text>
                {item.muscles.primary.length > 0 && (
                  <Text className="text-xs text-gray-400 mt-0.5">
                    {item.muscles.primary.slice(0, 3).join(" · ")}
                  </Text>
                )}
              </View>
              <View
                className="rounded px-2 py-0.5"
                style={{ backgroundColor: bg }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{ color: textCol }}
                >
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
    </BottomSheetModal>
  );
}
