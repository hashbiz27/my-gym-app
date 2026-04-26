import { useCallback, useEffect, useMemo, useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { EXERCISE_GUIDES } from "../data/gymData";
import { Colors } from "../theme";

function MuscleTag({ label, primary }) {
  return (
    <View
      className={`px-2.5 py-1 rounded-full mr-1.5 mb-1.5 ${
        primary ? "bg-indigo-100" : "bg-gray-100"
      }`}
    >
      <Text
        className={`text-xs font-semibold ${
          primary ? "text-indigo-700" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

export default function HowToModal({ visible, exerciseName, onClose }) {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["80%"], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

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

  const guide = exerciseName ? EXERCISE_GUIDES[exerciseName] : null;

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: Colors.gray200, width: 40 }}
    >
      {/* Header */}
      <View className="px-4 pb-3 border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-900 flex-1 mr-3" numberOfLines={2}>
            {exerciseName}
          </Text>
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheetScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {!guide ? (
          <View className="py-12 items-center">
            <Text className="text-gray-400 text-sm">No guide available for this exercise</Text>
          </View>
        ) : (
          <>
            {/* Muscles */}
            {(guide.muscles?.primary?.length > 0 || guide.muscles?.secondary?.length > 0) && (
              <View className="mb-5">
                <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Muscles
                </Text>
                <View className="flex-row flex-wrap">
                  {(guide.muscles?.primary ?? []).map((m) => (
                    <MuscleTag key={m} label={m} primary />
                  ))}
                  {(guide.muscles?.secondary ?? []).map((m) => (
                    <MuscleTag key={m} label={m} primary={false} />
                  ))}
                </View>
                <View className="flex-row gap-x-3 mt-1">
                  <View className="flex-row items-center gap-x-1">
                    <View className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <Text className="text-xs text-gray-400">Primary</Text>
                  </View>
                  <View className="flex-row items-center gap-x-1">
                    <View className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <Text className="text-xs text-gray-400">Secondary</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Steps */}
            {guide.steps?.length > 0 && (
              <View className="mb-5">
                <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  How to perform
                </Text>
                {guide.steps.map((step, i) => (
                  <View key={i} className="flex-row mb-2.5">
                    <View className="w-6 h-6 rounded-full bg-indigo-600 items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <Text className="text-white text-xs font-bold">{i + 1}</Text>
                    </View>
                    <Text className="text-sm text-gray-700 leading-5 flex-1">{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Cues */}
            {guide.cues?.length > 0 && (
              <View className="mb-5">
                <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Key cues
                </Text>
                {guide.cues.map((cue, i) => (
                  <View key={i} className="flex-row items-start mb-1.5">
                    <Text className="text-green-500 font-bold mr-2 text-sm">+</Text>
                    <Text className="text-sm text-gray-700 leading-5 flex-1">{cue}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Mistakes */}
            {guide.mistakes?.length > 0 && (
              <View className="mb-5">
                <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Common mistakes
                </Text>
                {guide.mistakes.map((mistake, i) => (
                  <View key={i} className="flex-row items-start mb-1.5">
                    <Text className="text-red-400 font-bold mr-2 text-sm">−</Text>
                    <Text className="text-sm text-gray-700 leading-5 flex-1">{mistake}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
