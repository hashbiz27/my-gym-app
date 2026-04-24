import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
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

function buildInitialLogState(exercises, sessionId) {
  const initial = {};
  exercises.forEach((ex, i) => {
    initial[`${sessionId}-${i}`] = Array.from(
      { length: parseInt(ex.sets) || 3 },
      () => ({ weight: "", reps: "", done: false, logId: null })
    );
  });
  return initial;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WorkoutHeader({ session, regimeCfg, doneSets, totalSets }) {
  const pct = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;
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
            {doneSets}
            <Text className="text-sm text-gray-500">/{totalSets}</Text>
          </Text>
          <Text className="text-xs text-gray-500 uppercase tracking-wider">
            sets done
          </Text>
        </View>
      </View>

      <View className="h-1 bg-gray-700 rounded-full mt-3">
        <View
          className="h-1 bg-green-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
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

function SetRow({ setIndex, row, onToggle, onChangeWeight, onChangeReps, onBlur, disabled }) {
  return (
    <View className="flex-row items-center gap-x-2 mb-2">
      <Text className="w-5 text-xs text-gray-400 text-center font-bold">
        {setIndex + 1}
      </Text>
      <TextInput
        className={`flex-1 border rounded-lg py-2 text-center text-sm ${
          row.done
            ? "border-green-200 bg-green-50 text-gray-700"
            : "border-gray-200 bg-white text-gray-800"
        }`}
        placeholder="kg"
        placeholderTextColor="#d1d5db"
        keyboardType="decimal-pad"
        value={row.weight}
        onChangeText={(v) => onChangeWeight(setIndex, v)}
        onBlur={() => onBlur(setIndex)}
        editable={!disabled}
      />
      <TextInput
        className={`flex-1 border rounded-lg py-2 text-center text-sm ${
          row.done
            ? "border-green-200 bg-green-50 text-gray-700"
            : "border-gray-200 bg-white text-gray-800"
        }`}
        placeholder="reps"
        placeholderTextColor="#d1d5db"
        keyboardType="number-pad"
        value={row.reps}
        onChangeText={(v) => onChangeReps(setIndex, v)}
        onBlur={() => onBlur(setIndex)}
        editable={!disabled}
      />
      <TouchableOpacity
        onPress={() => onToggle(setIndex)}
        disabled={disabled}
        className={`w-7 h-7 rounded border-2 items-center justify-center ${
          row.done ? "bg-green-500 border-green-500" : "border-gray-300 bg-white"
        }`}
      >
        {row.done && <Ionicons name="checkmark" size={16} color="white" />}
      </TouchableOpacity>
    </View>
  );
}

function ExerciseCard({
  exercise,
  exKey,
  index,
  weightClass,
  sex,
  rows,
  expanded,
  cardSaving,
  onToggleExpand,
  onToggleDone,
  onChangeWeight,
  onChangeReps,
  onBlurField,
}) {
  const target =
    weightClass && exercise.weight?.[weightClass]
      ? adjustWeightForSex(exercise.weight[weightClass], sex)
      : null;

  const doneSets = rows.filter((r) => r.done).length;
  const allDone = doneSets === rows.length && rows.length > 0;

  return (
    <View className="mx-4 mt-3 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Tappable card header */}
      <TouchableOpacity
        onPress={() => onToggleExpand(exKey)}
        activeOpacity={0.7}
        className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-start"
      >
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
          <View className="flex-row items-center mt-1.5 gap-x-1.5">
            {cardSaving ? (
              <ActivityIndicator size="small" color="#16a34a" />
            ) : null}
            <Text
              className={`text-xs font-semibold ${
                allDone ? "text-green-600" : "text-gray-400"
              }`}
            >
              {doneSets}/{rows.length}
            </Text>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={14}
              color="#9ca3af"
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded set rows */}
      {expanded && (
        <View className="px-4 py-3">
          {rows.map((row, i) => (
            <SetRow
              key={i}
              setIndex={i}
              row={row}
              onToggle={(si) => onToggleDone(exKey, si, exercise)}
              onChangeWeight={(si, v) => onChangeWeight(exKey, si, v)}
              onChangeReps={(si, v) => onChangeReps(exKey, si, v)}
              onBlur={(si) => onBlurField(exKey, si)}
              disabled={cardSaving}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function ListFooter({ notes, onNotesChange, onFinish, onDiscard }) {
  return (
    <View className="mx-4 mt-5 mb-8">
      <Text className="text-xs tracking-widest uppercase text-gray-400 mb-2">
        Session notes
      </Text>
      <TextInput
        className="border border-gray-200 rounded-xl px-4 py-3 bg-white h-20 text-sm text-gray-800"
        placeholder="How did it feel? PRs, injuries, observations…"
        placeholderTextColor="#9ca3af"
        multiline
        textAlignVertical="top"
        value={notes}
        onChangeText={onNotesChange}
      />
      <View className="flex-row mt-4 gap-x-3">
        <TouchableOpacity
          className="flex-1 bg-green-600 rounded-xl py-3.5 items-center"
          onPress={() => onFinish(notes)}
        >
          <Text className="text-white font-bold text-sm">Finish Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-5 py-3.5 rounded-xl border border-gray-200 items-center"
          onPress={onDiscard}
        >
          <Text className="text-gray-400 font-semibold text-sm">Discard</Text>
        </TouchableOpacity>
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
  const {
    fetchProfile,
    ensureRegime,
    createSession,
    insertSessionLog,
    deleteSessionLog,
    updateSessionLog,
    updateSessionNotes,
  } = useGymData();

  const [profile, setProfile] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeSessionId, setActiveSessionId] = useState(null);
  const [logState, setLogState] = useState({});
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [savingCards, setSavingCards] = useState({});
  const [workoutNotes, setWorkoutNotes] = useState("");

  // Refs keep async callbacks from capturing stale state
  const activeSessionIdRef = useRef(null);
  activeSessionIdRef.current = activeSessionId;
  const logStateRef = useRef({});
  logStateRef.current = logState;
  const profileRef = useRef(null);
  profileRef.current = profile;
  const selectedSessionIdRef = useRef(null);
  selectedSessionIdRef.current = selectedSessionId;

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

  const regimeCfg = profile?.regime ? REGIMES[profile.regime] : null;

  const session = useMemo(
    () =>
      profile?.regime && selectedSessionId
        ? resolveSession(profile.regime, selectedSessionId, profile.age_class)
        : null,
    [profile, selectedSessionId]
  );

  // Reset log state whenever regime / session / age class changes
  const sessionKey =
    profile?.regime && selectedSessionId && profile?.age_class
      ? `${profile.regime}|${selectedSessionId}|${profile.age_class}`
      : null;

  useEffect(() => {
    if (!sessionKey || !profile?.regime || !selectedSessionId) return;
    const resolved = resolveSession(
      profile.regime,
      selectedSessionId,
      profile.age_class
    );
    if (!resolved) return;
    setLogState(buildInitialLogState(resolved.exercises, selectedSessionId));
    setExpandedCards(new Set());
    setSavingCards({});
    setActiveSessionId(null);
    setWorkoutNotes("");
  }, [sessionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const doneSets = useMemo(
    () => Object.values(logState).flat().filter((r) => r.done).length,
    [logState]
  );

  const totalSets = useMemo(
    () =>
      session?.exercises.reduce(
        (sum, ex) => sum + (parseInt(ex.sets) || 3),
        0
      ) ?? 0,
    [session]
  );

  // Lazily create the session row on first set completion
  const ensureSessionRow = useCallback(async () => {
    if (activeSessionIdRef.current) return activeSessionIdRef.current;
    const p = profileRef.current;
    const regimeId = await ensureRegime(p.regime);
    // Guard against concurrent calls both reaching this point
    if (activeSessionIdRef.current) return activeSessionIdRef.current;
    const sess = await createSession({
      regimeId,
      date: new Date().toISOString().split("T")[0],
      notes: null,
    });
    if (!sess) return null;
    setActiveSessionId(sess.id);
    return sess.id;
  }, [ensureRegime, createSession]);

  const handleToggleDone = useCallback(
    async (exKey, setIndex, exercise) => {
      const row = logStateRef.current[exKey]?.[setIndex];
      if (!row) return;

      setSavingCards((prev) => ({ ...prev, [exKey]: true }));

      if (!row.done) {
        const sessionId = await ensureSessionRow();
        if (!sessionId) {
          setSavingCards((prev) => ({ ...prev, [exKey]: false }));
          return;
        }
        const logId = await insertSessionLog(sessionId, {
          exerciseName: exercise.name,
          setNumber: setIndex + 1,
          reps: row.reps,
          weight: row.weight,
        });
        setLogState((prev) => {
          const rows = [...(prev[exKey] ?? [])];
          rows[setIndex] = { ...rows[setIndex], done: true, logId };
          return { ...prev, [exKey]: rows };
        });
      } else {
        if (row.logId) await deleteSessionLog(row.logId);
        setLogState((prev) => {
          const rows = [...(prev[exKey] ?? [])];
          rows[setIndex] = { ...rows[setIndex], done: false, logId: null };
          return { ...prev, [exKey]: rows };
        });
      }

      setSavingCards((prev) => ({ ...prev, [exKey]: false }));
    },
    [ensureSessionRow, insertSessionLog, deleteSessionLog]
  );

  const handleChangeWeight = useCallback((exKey, setIndex, value) => {
    setLogState((prev) => {
      const rows = [...(prev[exKey] ?? [])];
      rows[setIndex] = { ...rows[setIndex], weight: value };
      return { ...prev, [exKey]: rows };
    });
  }, []);

  const handleChangeReps = useCallback((exKey, setIndex, value) => {
    setLogState((prev) => {
      const rows = [...(prev[exKey] ?? [])];
      rows[setIndex] = { ...rows[setIndex], reps: value };
      return { ...prev, [exKey]: rows };
    });
  }, []);

  const handleBlurField = useCallback(
    async (exKey, setIndex) => {
      const row = logStateRef.current[exKey]?.[setIndex];
      if (!row?.done || !row.logId) return;
      await updateSessionLog(row.logId, { reps: row.reps, weight: row.weight });
    },
    [updateSessionLog]
  );

  const handleToggleExpand = useCallback((exKey) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(exKey)) next.delete(exKey);
      else next.add(exKey);
      return next;
    });
  }, []);

  const resetWorkoutState = useCallback(() => {
    const p = profileRef.current;
    const sid = selectedSessionIdRef.current;
    if (p?.regime && sid) {
      const resolved = resolveSession(p.regime, sid, p.age_class);
      if (resolved) setLogState(buildInitialLogState(resolved.exercises, sid));
    }
    setExpandedCards(new Set());
    setSavingCards({});
    setActiveSessionId(null);
    setWorkoutNotes("");
  }, []);

  const handleFinishWorkout = useCallback(
    async (notes) => {
      if (activeSessionIdRef.current && notes?.trim()) {
        await updateSessionNotes(activeSessionIdRef.current, notes.trim());
      }
      resetWorkoutState();
      Alert.alert("Workout saved!", "Great work today.");
    },
    [updateSessionNotes, resetWorkoutState]
  );

  const handleDiscard = useCallback(() => {
    Alert.alert("Discard workout?", "All logged sets will be lost.", [
      { text: "Cancel", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: resetWorkoutState },
    ]);
  }, [resetWorkoutState]);

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
        doneSets={doneSets}
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
        renderItem={({ item, index }) => {
          const exKey = `${selectedSessionId}-${index}`;
          return (
            <ExerciseCard
              exercise={item}
              exKey={exKey}
              index={index}
              weightClass={profile.weight_class}
              sex={profile.sex}
              rows={logState[exKey] ?? []}
              expanded={expandedCards.has(exKey)}
              cardSaving={!!savingCards[exKey]}
              onToggleExpand={handleToggleExpand}
              onToggleDone={handleToggleDone}
              onChangeWeight={handleChangeWeight}
              onChangeReps={handleChangeReps}
              onBlurField={handleBlurField}
            />
          );
        }}
        ListFooterComponent={
          session ? (
            <ListFooter
              notes={workoutNotes}
              onNotesChange={setWorkoutNotes}
              onFinish={handleFinishWorkout}
              onDiscard={handleDiscard}
            />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 16 }}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}
