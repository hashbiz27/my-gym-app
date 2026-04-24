import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  ALL_SESSIONS,
  AGE_OVERRIDES,
  REGIMES,
  adjustWeightForSex,
} from "../data/gymData";
import { useGymData } from "../hooks/useGymData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Derive a session with age overrides applied directly from the raw constants.
function resolveSession(regimeKey, sessionId, ageClass) {
  const base = ALL_SESSIONS[regimeKey]?.[sessionId];
  if (!base) return null;
  const overrides = AGE_OVERRIDES[regimeKey] ?? {};
  return {
    ...base,
    exercises: base.exercises.map((ex) => {
      const ov = overrides[ex.name]?.[ageClass];
      return ov ? { ...ex, ...ov } : ex;
    }),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WorkoutHeader({ session, regimeCfg, totalSets }) {
  return (
    <View className="bg-gray-900 px-5 pt-4 pb-4">
      <Text className="text-xs tracking-widest uppercase text-gray-500 mb-1">
        {todayLabel()}
      </Text>

      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-4">
          <Text className="text-xl font-bold text-white">
            {session?.label ?? "—"}
          </Text>
          <Text className="text-xs text-gray-400 italic mt-0.5">
            {regimeCfg?.label}
            {session?.tag ? ` · ${session.tag}` : ""}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-2xl font-bold text-white">
            0<Text className="text-sm text-gray-500">/{totalSets}</Text>
          </Text>
          <Text className="text-xs text-gray-500 uppercase tracking-wider">
            sets done
          </Text>
        </View>
      </View>

      <View className="h-1 bg-gray-700 rounded-full mt-3">
        <View className="h-1 bg-green-500 rounded-full w-0" />
      </View>
    </View>
  );
}

function SessionPicker({ regimeCfg, selectedSessionId, onSelect }) {
  if (!regimeCfg?.sessionOrder?.length) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="bg-white border-b border-gray-100"
      contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}
    >
      {regimeCfg.sessionOrder.map((sid) => {
        const active = sid === selectedSessionId;
        return (
          <TouchableOpacity
            key={sid}
            onPress={() => onSelect(sid)}
            className={`mr-2 px-4 py-1.5 rounded-full border ${
              active
                ? "bg-green-600 border-green-600"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                active ? "text-white" : "text-gray-500"
              }`}
            >
              {regimeCfg.sessionLabels[sid]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function ExerciseCard({ exercise, index, weightClass, sex }) {
  const target =
    weightClass && exercise.weight?.[weightClass]
      ? adjustWeightForSex(exercise.weight[weightClass], sex)
      : null;

  const setCount = parseInt(exercise.sets) || 3;

  return (
    <View className="mx-4 mt-3 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Card header */}
      <View className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center gap-x-2">
            <Text className="text-xs text-gray-300 font-mono">
              {String(index + 1).padStart(2, "0")}
            </Text>
            <Text className="text-sm font-bold text-gray-900">
              {exercise.name}
            </Text>
          </View>

          {exercise.note ? (
            <Text className="text-xs text-gray-400 italic mt-0.5 ml-5">
              {exercise.note}
            </Text>
          ) : null}

          {target ? (
            <Text className="text-xs text-gray-500 mt-0.5 ml-5">
              Target: <Text className="font-semibold">{target}</Text>
            </Text>
          ) : null}

          {/* Placeholder swap button */}
          <TouchableOpacity
            className="mt-1.5 self-start ml-5"
            disabled
            activeOpacity={1}
          >
            <Text className="text-xs text-gray-300">Swap</Text>
          </TouchableOpacity>
        </View>

        <View className="items-end">
          <Text className="text-xs font-semibold text-gray-600">
            {exercise.sets} × {exercise.reps}
          </Text>
          <Text className="text-xs text-gray-400 mt-0.5">{exercise.rest}</Text>
        </View>
      </View>

      {/* Set placeholder rows */}
      <View className="px-4 py-3 gap-y-2">
        {Array.from({ length: setCount }).map((_, i) => (
          <View key={i} className="flex-row items-center gap-x-2">
            <Text className="w-5 text-xs text-gray-300 text-center font-bold">
              {i + 1}
            </Text>
            <View className="flex-1 border border-gray-200 rounded-lg py-2 items-center">
              <Text className="text-sm text-gray-300">—</Text>
            </View>
            <View className="flex-1 border border-gray-200 rounded-lg py-2 items-center">
              <Text className="text-sm text-gray-300">—</Text>
            </View>
            <Text className="w-10 text-xs text-gray-200 text-right">—</Text>
            <View className="w-7 h-7 rounded border-2 border-gray-200 bg-white" />
            <View className="w-6 h-6 rounded border border-gray-100 items-center justify-center">
              <Text className="text-gray-300 text-sm leading-none">×</Text>
            </View>
          </View>
        ))}

        <View className="mt-1 py-2 border border-dashed border-gray-100 rounded-lg items-center">
          <Text className="text-xs text-gray-300">+ add set</Text>
        </View>
      </View>
    </View>
  );
}

function ListFooter() {
  return (
    <View className="mx-4 mt-5 mb-8">
      <Text className="text-xs tracking-widest uppercase text-gray-400 mb-2">
        Session notes
      </Text>
      <View className="border border-gray-200 rounded-xl px-4 py-3 bg-white h-20 justify-start">
        <Text className="text-sm text-gray-300">
          How did it feel? PRs, injuries, observations…
        </Text>
      </View>
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

function NoProfilePlaceholder() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons name="barbell-outline" size={48} color="#d1d5db" />
      <Text className="text-lg font-bold text-gray-400 mt-4 text-center">
        No programme selected
      </Text>
      <Text className="text-sm text-gray-400 mt-2 text-center leading-5">
        Go to Settings to choose your regime, age group, and weight class.
      </Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function WorkoutScreen() {
  const { fetchProfile } = useGymData();

  const [profile, setProfile] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile on mount
  useEffect(() => {
    fetchProfile().then((p) => {
      setProfile(p);
      if (p?.regime) {
        const order = REGIMES[p.regime]?.sessionOrder ?? [];
        setSelectedSessionId(order[0] ?? null);
      }
      setLoading(false);
    });
  }, []);

  // Derive regime config from the static REGIMES map
  const regimeCfg = profile?.regime ? REGIMES[profile.regime] : null;

  // Resolve the session with age overrides applied from AGE_OVERRIDES
  const session = useMemo(
    () =>
      profile?.regime && selectedSessionId
        ? resolveSession(profile.regime, selectedSessionId, profile.age_class)
        : null,
    [profile, selectedSessionId]
  );

  // Total prescribed sets across all exercises in this session
  const totalSets = useMemo(
    () =>
      session?.exercises.reduce(
        (sum, ex) => sum + (parseInt(ex.sets) || 3),
        0
      ) ?? 0,
    [session]
  );

  // ── Loading ──
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#16a34a" />
      </SafeAreaView>
    );
  }

  // ── No profile preferences set ──
  if (!profile?.regime) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <NoProfilePlaceholder />
      </SafeAreaView>
    );
  }

  // ── Main screen ──
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <WorkoutHeader
        session={session}
        regimeCfg={regimeCfg}
        totalSets={totalSets}
      />

      <SessionPicker
        regimeCfg={regimeCfg}
        selectedSessionId={selectedSessionId}
        onSelect={setSelectedSessionId}
      />

      <FlatList
        data={session?.exercises ?? []}
        keyExtractor={(_, index) => `${selectedSessionId}-${index}`}
        renderItem={({ item, index }) => (
          <ExerciseCard
            exercise={item}
            index={index}
            weightClass={profile.weight_class}
            sex={profile.sex}
          />
        )}
        ListFooterComponent={session ? ListFooter : null}
        contentContainerStyle={{ paddingBottom: 16 }}
        className="flex-1"
      />
    </SafeAreaView>
  );
}
