import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ALL_SESSIONS,
  AGE_OVERRIDES,
  MOBILITY_WARMUPS,
  REGIMES,
  adjustWeightForSex,
} from "../data/gymData";
import { useGymData } from "../hooks/useGymData";
import { useSyncContext } from "../context/SyncContext";
import SwapModal from "../components/SwapModal";
import HowToModal from "../components/HowToModal";
import { Colors } from "../theme";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVE_SESSION_KEY = "gym_active_session";

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

// Rebuild log state from previously saved session_logs rows
function buildRestoredLogState(exercises, sessionId, logs) {
  const initial = buildInitialLogState(exercises, sessionId);
  logs.forEach((log) => {
    const exIdx = exercises.findIndex((ex) => ex.name === log.exercise_name);
    if (exIdx === -1) return;
    const exKey = `${sessionId}-${exIdx}`;
    const si = log.set_number - 1;
    if (initial[exKey]?.[si]) {
      initial[exKey][si] = {
        weight: log.weight != null ? String(log.weight) : "",
        reps: log.reps != null ? String(log.reps) : "",
        done: true,
        logId: log.id,
      };
    }
  });
  return initial;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WorkoutHeader({
  session,
  regimeCfg,
  doneSets,
  totalSets,
  phase,
  isSyncing,
  pendingCount,
}) {
  const pct = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;
  const showSync = isSyncing || pendingCount > 0;

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
          {phase === "active" ? (
            <>
              <Text className="text-2xl font-bold text-white">
                {doneSets}
                <Text className="text-sm text-gray-500">/{totalSets}</Text>
              </Text>
              <Text className="text-xs text-gray-500 uppercase tracking-wider">
                sets done
              </Text>
            </>
          ) : (
            <>
              <Text className="text-2xl font-bold text-gray-600">
                {totalSets}
              </Text>
              <Text className="text-xs text-gray-500 uppercase tracking-wider">
                sets total
              </Text>
            </>
          )}
        </View>
      </View>

      <View className="h-1 bg-gray-700 rounded-full mt-3">
        {phase === "active" && (
          <View
            className="h-1 bg-green-500 rounded-full"
            style={{ width: `${pct}%` }}
          />
        )}
      </View>

      {showSync ? (
        <View className="flex-row items-center gap-x-1.5 mt-2">
          {isSyncing ? (
            <ActivityIndicator size="small" color={Colors.info} />
          ) : (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: Colors.warning,
              }}
            />
          )}
          <Text className="text-xs text-blue-400">
            {isSyncing
              ? "Syncing…"
              : `${pendingCount} set${pendingCount !== 1 ? "s" : ""} pending sync`}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function SessionPicker({ regimeCfg, selectedSessionId, onSelect, disabled }) {
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
            onPress={() => !disabled && onSelect(sid)}
            disabled={disabled}
            className={`mr-2 px-4 py-1.5 rounded-full border ${
              active
                ? "bg-green-600 border-green-600"
                : disabled
                ? "bg-gray-50 border-gray-100"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                active ? "text-white" : disabled ? "text-gray-300" : "text-gray-500"
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

function epley1RM(weight, reps) {
  const w = parseFloat(weight);
  const r = parseInt(reps);
  if (!w || !r || r <= 0) return null;
  if (r === 1) return Math.round(w);
  return Math.round(w * (1 + r / 30));
}

function SetRow({ setIndex, row, onToggle, onChangeWeight, onChangeReps, onBlur, disabled }) {
  const orm = row.done ? epley1RM(row.weight, row.reps) : null;
  return (
    <View className="mb-2">
      <View className="flex-row items-center gap-x-2">
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
          placeholderTextColor={Colors.textLight}
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
          placeholderTextColor={Colors.textLight}
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
          {row.done && <Ionicons name="checkmark" size={16} color={Colors.white} />}
        </TouchableOpacity>
      </View>
      {orm !== null && (
        <View className="ml-7 mt-0.5">
          <Text className="text-xs text-green-600 font-medium">
            ≈ {orm} kg 1RM
          </Text>
        </View>
      )}
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
  interactive,
  canSwap,
  originalExerciseName,
  wasSwapped,
  onToggleExpand,
  onToggleDone,
  onChangeWeight,
  onChangeReps,
  onBlurField,
  onOpenSwap,
  onOpenHowTo,
}) {
  const target =
    weightClass && exercise.weight?.[weightClass]
      ? adjustWeightForSex(exercise.weight[weightClass], sex)
      : null;

  const doneSets = rows.filter((r) => r.done).length;
  const allDone = doneSets === rows.length && rows.length > 0;

  return (
    <View className="mx-4 mt-3 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <TouchableOpacity
        onPress={interactive ? () => onToggleExpand(exKey) : undefined}
        activeOpacity={interactive ? 0.7 : 1}
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

          <View className="flex-row items-center mt-1.5 ml-5 gap-x-3">
            {canSwap ? (
              <TouchableOpacity
                onPress={() =>
                  onOpenSwap(exKey, index, exercise.name, originalExerciseName)
                }
                activeOpacity={0.7}
              >
                <Text
                  className={`text-xs font-medium ${
                    wasSwapped ? "text-orange-500" : "text-indigo-500"
                  }`}
                >
                  {wasSwapped ? "Swapped" : "Swap"}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-xs text-gray-300">Swap</Text>
            )}
            <TouchableOpacity
              onPress={() => onOpenHowTo(exercise.name)}
              activeOpacity={0.7}
            >
              <Text className="text-xs font-medium text-gray-400">How to</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xs font-semibold text-gray-600">
            {exercise.sets} × {exercise.reps}
          </Text>
          <Text className="text-xs text-gray-400 mt-0.5">{exercise.rest}</Text>
          {interactive && (
            <View className="flex-row items-center mt-1.5 gap-x-1.5">
              {cardSaving ? (
                <ActivityIndicator size="small" color={Colors.success} />
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
                color={Colors.textMuted}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {interactive && expanded && (
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

function StartFooter({ onStart, starting }) {
  return (
    <View className="mx-4 mt-5 mb-8">
      <TouchableOpacity
        className={`rounded-xl py-4 items-center flex-row justify-center gap-x-2 ${
          starting ? "bg-green-400" : "bg-green-600"
        }`}
        onPress={onStart}
        disabled={starting}
      >
        {starting ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <Ionicons name="play" size={18} color={Colors.white} />
        )}
        <Text className="text-white font-bold text-base">
          {starting ? "Starting…" : "Start Session"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function FinishFooter({ notes, onNotesChange, onFinish, onDiscard }) {
  return (
    <View className="mx-4 mt-5 mb-8">
      <Text className="text-xs tracking-widest uppercase text-gray-400 mb-2">
        Session notes
      </Text>
      <TextInput
        className="border border-gray-200 rounded-xl px-4 py-3 bg-white h-20 text-sm text-gray-800"
        placeholder="How did it feel? PRs, injuries, observations…"
        placeholderTextColor={Colors.textMuted}
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
          <Text className="text-white font-bold text-sm">Finish Session</Text>
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
      <Ionicons name="barbell-outline" size={48} color={Colors.textLight} />
      <Text className="text-lg font-bold text-gray-400 mt-4 text-center">
        No programme selected
      </Text>
      <Text className="text-sm text-gray-400 mt-2 text-center leading-5">
        Go to Settings to choose your regime, age group, and weight class.
      </Text>
    </View>
  );
}

// ─── Mobility warm-up card ────────────────────────────────────────────────────

function MobilityCard({ drills }) {
  const [open, setOpen] = useState(false);
  return (
    <View className="mx-4 mt-3 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
      <TouchableOpacity
        className="flex-row items-center px-4 py-3"
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.75}
      >
        <Text className="text-base mr-2">🧘</Text>
        <View className="flex-1">
          <Text className="text-sm font-bold text-amber-800">Warm-up first</Text>
          <Text className="text-xs text-amber-600 mt-0.5">{drills.length} exercises before lifting</Text>
        </View>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#92400e"
        />
      </TouchableOpacity>
      {open && (
        <View className="px-4 pb-3 border-t border-amber-200">
          {drills.map((drill, i) => (
            <View key={i} className="flex-row items-start py-1.5">
              <Text className="text-xs font-bold text-amber-700 w-5">{i + 1}</Text>
              <Text className="text-sm text-amber-900 flex-1">{drill}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Rest timer helpers ───────────────────────────────────────────────────────

function parseRestSeconds(restStr) {
  if (!restStr) return 0;
  // "3 min", "2–3 min" → use lower bound
  const minMatch = restStr.match(/(\d+)(?:[–-]\d+)?\s*min/i);
  if (minMatch) return parseInt(minMatch[1]) * 60;
  // "90s", "60s", "90–120s"
  const secMatch = restStr.match(/(\d+)(?:[–-]\d+)?\s*s/i);
  if (secMatch) return parseInt(secMatch[1]);
  return 0;
}

function fmt(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function RestTimerBanner({ seconds, total, exerciseName, onSkip }) {
  const progress = total > 0 ? seconds / total : 0;
  const urgent = seconds <= 10;
  return (
    <View
      className={`mx-4 mb-3 rounded-xl overflow-hidden border ${
        urgent ? "border-orange-300 bg-orange-50" : "border-indigo-200 bg-indigo-50"
      }`}
    >
      {/* progress bar */}
      <View className="h-1 bg-gray-100">
        <View
          className={urgent ? "h-1 bg-orange-400" : "h-1 bg-indigo-400"}
          style={{ width: `${progress * 100}%` }}
        />
      </View>
      <View className="flex-row items-center px-4 py-2.5">
        <Ionicons
          name="timer-outline"
          size={18}
          color={urgent ? "#f97316" : "#6366f1"}
        />
        <View className="flex-1 ml-2">
          <Text className={`text-xs ${urgent ? "text-orange-600" : "text-indigo-600"}`}>
            Rest · {exerciseName}
          </Text>
          <Text
            className={`text-xl font-bold tabular-nums ${
              urgent ? "text-orange-600" : "text-indigo-700"
            }`}
          >
            {fmt(seconds)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onSkip}
          className={`px-3 py-1.5 rounded-lg ${urgent ? "bg-orange-100" : "bg-indigo-100"}`}
          activeOpacity={0.75}
        >
          <Text className={`text-xs font-semibold ${urgent ? "text-orange-700" : "text-indigo-700"}`}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function WorkoutScreen() {
  const {
    fetchProfile,
    ensureRegime,
    createSession,
    finishSession,
    fetchSessionById,
    fetchLogsForSession,
    insertSessionLog,
    deleteSessionLog,
    updateSessionLog,
    updateSessionNotes,
  } = useGymData();

  const { isSyncing, pendingCount } = useSyncContext();

  const [profile, setProfile] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  // "idle" → pre-session preview; "starting" → creating row; "active" → logging
  const [sessionPhase, setSessionPhase] = useState("idle");
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [logState, setLogState] = useState({});
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [savingCards, setSavingCards] = useState({});
  const [workoutNotes, setWorkoutNotes] = useState("");

  // { [exKey]: replacementName } — overrides the plan exercise at that slot
  const [swappedExercises, setSwappedExercises] = useState({});
  // { exKey, slotIndex, exerciseName, originalName } | null
  const [swapTarget, setSwapTarget] = useState(null);
  const [howToTarget, setHowToTarget] = useState(null);
  // { seconds: number, total: number, exerciseName: string } | null
  const [restTimer, setRestTimer] = useState(null);

  // Refs for async callbacks to avoid stale closures
  const activeSessionIdRef = useRef(null);
  activeSessionIdRef.current = activeSessionId;
  const logStateRef = useRef({});
  logStateRef.current = logState;
  const profileRef = useRef(null);
  profileRef.current = profile;
  const selectedSessionIdRef = useRef(null);
  selectedSessionIdRef.current = selectedSessionId;
  const sessionPhaseRef = useRef("idle");
  sessionPhaseRef.current = sessionPhase;
  // Prevents sessionKey effect from firing before the mount restore finishes
  const isFirstKeyRun = useRef(true);

  // ── Mount: load profile and restore any in-progress session ───────────────
  useEffect(() => {
    (async () => {
      const p = await fetchProfile();
      setProfile(p);

      if (!p?.regime) {
        setLoading(false);
        return;
      }

      const order = REGIMES[p.regime]?.sessionOrder ?? [];
      const dayKey = String(new Date().getDay()); // "0"=Sun … "6"=Sat
      const scheduled = p.schedule?.[dayKey];
      const defaultSid =
        scheduled && order.includes(scheduled) ? scheduled : order[0] ?? null;

      // Try to restore a persisted session
      try {
        const stored = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);
        if (stored) {
          const { sessionId, regimeKey, sessionTabId } = JSON.parse(stored);
          if (regimeKey === p.regime) {
            const sess = await fetchSessionById(sessionId);
            if (sess && !sess.finished_at) {
              const logs = await fetchLogsForSession(sessionId);
              const resolved = resolveSession(p.regime, sessionTabId, p.age_class);
              if (resolved) {
                setLogState(
                  buildRestoredLogState(resolved.exercises, sessionTabId, logs)
                );
              }
              setSelectedSessionId(sessionTabId);
              setActiveSessionId(sessionId);
              setSessionPhase("active");
              setLoading(false);
              return;
            }
          }
          // Stale or mismatched — clear it
          await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
        }
      } catch (_) {}

      // Fresh start
      if (defaultSid && p.age_class) {
        const resolved = resolveSession(p.regime, defaultSid, p.age_class);
        if (resolved) {
          setLogState(buildInitialLogState(resolved.exercises, defaultSid));
        }
      }
      setSelectedSessionId(defaultSid);
      setLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const regimeCfg = profile?.regime ? REGIMES[profile.regime] : null;

  const session = useMemo(
    () =>
      profile?.regime && selectedSessionId
        ? resolveSession(profile.regime, selectedSessionId, profile.age_class)
        : null,
    [profile, selectedSessionId]
  );

  // Reset when regime / session tab / age class changes (user edits Settings)
  const sessionKey =
    profile?.regime && selectedSessionId && profile?.age_class
      ? `${profile.regime}|${selectedSessionId}|${profile.age_class}`
      : null;

  useEffect(() => {
    // Skip the initial run — mount effect already handled the first setup
    if (isFirstKeyRun.current) {
      if (sessionKey) isFirstKeyRun.current = false;
      return;
    }
    if (!sessionKey || !profile?.regime || !selectedSessionId) return;
    const resolved = resolveSession(
      profile.regime,
      selectedSessionId,
      profile.age_class
    );
    if (!resolved) return;
    AsyncStorage.removeItem(ACTIVE_SESSION_KEY).catch(() => {});
    setLogState(buildInitialLogState(resolved.exercises, selectedSessionId));
    setExpandedCards(new Set());
    setSavingCards({});
    setActiveSessionId(null);
    setSessionPhase("idle");
    setWorkoutNotes("");
    setSwappedExercises({});
  }, [sessionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch profile each time the tab gains focus so changes made in Settings
  // (regime, age class, weight class, schedule) are reflected immediately.
  // Skip during an active session to avoid disrupting an in-progress workout.
  useFocusEffect(
    useCallback(() => {
      if (sessionPhaseRef.current === "active") return;
      fetchProfile().then((p) => {
        if (!p) return;
        setProfile(p);
        if (p.regime && !selectedSessionIdRef.current) {
          const order = REGIMES[p.regime]?.sessionOrder ?? [];
          const dayKey = String(new Date().getDay());
          const scheduled = p.schedule?.[dayKey];
          const sid =
            scheduled && order.includes(scheduled) ? scheduled : order[0] ?? null;
          setSelectedSessionId(sid);
          if (sid) {
            const resolved = resolveSession(p.regime, sid, p.age_class);
            if (resolved) setLogState(buildInitialLogState(resolved.exercises, sid));
          }
          setLoading(false);
        }
      });
    }, [fetchProfile])
  );

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

  // Plan exercises with user-selected swap overrides applied
  const displayedExercises = useMemo(() => {
    if (!session) return [];
    return session.exercises.map((ex, i) => {
      const exKey = `${selectedSessionId}-${i}`;
      const swappedName = swappedExercises[exKey];
      return swappedName
        ? { ...ex, name: swappedName, weight: undefined, note: undefined }
        : ex;
    });
  }, [session, selectedSessionId, swappedExercises]);

  const handleOpenSwap = useCallback(
    (exKey, slotIndex, currentName, originalName) => {
      setSwapTarget({ exKey, slotIndex, exerciseName: currentName, originalName });
    },
    []
  );

  const handleConfirmSwap = useCallback(
    (selectedName) => {
      if (!swapTarget) return;
      setSwappedExercises((prev) => {
        // Re-selecting the original restores the slot to the plan default
        if (selectedName === swapTarget.originalName) {
          const { [swapTarget.exKey]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [swapTarget.exKey]: selectedName };
      });
      setSwapTarget(null);
    },
    [swapTarget]
  );

  const handleCloseSwap = useCallback(() => setSwapTarget(null), []);

  const handleOpenHowTo = useCallback((exerciseName) => {
    setHowToTarget(exerciseName);
  }, []);

  const handleCloseHowTo = useCallback(() => setHowToTarget(null), []);

  // Countdown tick for rest timer
  useEffect(() => {
    if (!restTimer) return;
    if (restTimer.seconds <= 0) {
      Vibration.vibrate([0, 200, 100, 200]);
      setRestTimer(null);
      return;
    }
    const id = setTimeout(() => {
      setRestTimer((prev) => prev ? { ...prev, seconds: prev.seconds - 1 } : null);
    }, 1000);
    return () => clearTimeout(id);
  }, [restTimer]);

  // ── Start session ──────────────────────────────────────────────────────────
  const handleStartSession = useCallback(async () => {
    const p = profileRef.current;
    const sid = selectedSessionIdRef.current;
    if (!p?.regime || !sid) return;

    setSessionPhase("starting");
    const regimeId = await ensureRegime(p.regime);
    const sess = await createSession({
      regimeId,
      date: new Date().toISOString().split("T")[0],
      startedAt: new Date().toISOString(),
      notes: null,
    });

    if (!sess) {
      setSessionPhase("idle");
      return;
    }

    setActiveSessionId(sess.id);
    try {
      await AsyncStorage.setItem(
        ACTIVE_SESSION_KEY,
        JSON.stringify({ sessionId: sess.id, regimeKey: p.regime, sessionTabId: sid })
      );
    } catch (_) {}
    setSessionPhase("active");
  }, [ensureRegime, createSession]);

  // ── Per-set logging ────────────────────────────────────────────────────────
  const handleToggleDone = useCallback(
    async (exKey, setIndex, exercise) => {
      const sessionId = activeSessionIdRef.current;
      const row = logStateRef.current[exKey]?.[setIndex];
      if (!sessionId || !row) return;

      setSavingCards((prev) => ({ ...prev, [exKey]: true }));

      if (!row.done) {
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
        // Start rest timer (skip if this is the last set of the last exercise)
        const secs = parseRestSeconds(exercise.rest);
        if (secs > 0) {
          setRestTimer({ seconds: secs, total: secs, exerciseName: exercise.name });
        }
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
    [insertSessionLog, deleteSessionLog]
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

  // ── Finish / discard ───────────────────────────────────────────────────────
  const resetToIdle = useCallback(() => {
    const p = profileRef.current;
    const sid = selectedSessionIdRef.current;
    if (p?.regime && sid) {
      const resolved = resolveSession(p.regime, sid, p.age_class);
      if (resolved) setLogState(buildInitialLogState(resolved.exercises, sid));
    }
    setExpandedCards(new Set());
    setSavingCards({});
    setActiveSessionId(null);
    setSessionPhase("idle");
    setWorkoutNotes("");
    setSwappedExercises({});
    setRestTimer(null);
  }, []);

  const handleFinishSession = useCallback(
    async (notes) => {
      const sessionId = activeSessionIdRef.current;
      if (sessionId) {
        if (notes?.trim()) await updateSessionNotes(sessionId, notes.trim());
        await finishSession(sessionId);
      }
      try {
        await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
      } catch (_) {}
      resetToIdle();
      Alert.alert("Session complete!", "Great work today.");
    },
    [finishSession, updateSessionNotes, resetToIdle]
  );

  const handleDiscard = useCallback(() => {
    Alert.alert("Discard session?", "All logged sets will be lost.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
          } catch (_) {}
          resetToIdle();
        },
      },
    ]);
  }, [resetToIdle]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.success} />
      </SafeAreaView>
    );
  }

  if (!profile?.regime) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <NoProfilePlaceholder />
      </SafeAreaView>
    );
  }

  const isActive = sessionPhase === "active";

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <WorkoutHeader
        session={session}
        regimeCfg={regimeCfg}
        doneSets={doneSets}
        totalSets={totalSets}
        phase={sessionPhase}
        isSyncing={isSyncing}
        pendingCount={pendingCount}
      />

      <SessionPicker
        regimeCfg={regimeCfg}
        selectedSessionId={selectedSessionId}
        onSelect={setSelectedSessionId}
        disabled={isActive}
      />

      {(() => {
        const drills = MOBILITY_WARMUPS[profile.age_class]?.[selectedSessionId];
        return drills ? <MobilityCard drills={drills} /> : null;
      })()}

      {isActive && restTimer && (
        <RestTimerBanner
          seconds={restTimer.seconds}
          total={restTimer.total}
          exerciseName={restTimer.exerciseName}
          onSkip={() => setRestTimer(null)}
        />
      )}

      <FlatList
        data={displayedExercises}
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
              interactive={isActive}
              canSwap={sessionPhase !== "starting"}
              originalExerciseName={session?.exercises[index]?.name ?? item.name}
              wasSwapped={!!swappedExercises[exKey]}
              onToggleExpand={handleToggleExpand}
              onToggleDone={handleToggleDone}
              onChangeWeight={handleChangeWeight}
              onChangeReps={handleChangeReps}
              onBlurField={handleBlurField}
              onOpenSwap={handleOpenSwap}
              onOpenHowTo={handleOpenHowTo}
            />
          );
        }}
        ListFooterComponent={
          session
            ? isActive
              ? (
                <FinishFooter
                  notes={workoutNotes}
                  onNotesChange={setWorkoutNotes}
                  onFinish={handleFinishSession}
                  onDiscard={handleDiscard}
                />
              )
              : (
                <StartFooter
                  onStart={handleStartSession}
                  starting={sessionPhase === "starting"}
                />
              )
            : null
        }
        contentContainerStyle={{ paddingBottom: 16 }}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
      />

      <SwapModal
        visible={swapTarget !== null}
        exerciseName={swapTarget?.exerciseName}
        sessionExercises={displayedExercises}
        slotIndex={swapTarget?.slotIndex}
        originalName={swapTarget?.originalName}
        onSwap={handleConfirmSwap}
        onClose={handleCloseSwap}
      />

      <HowToModal
        visible={howToTarget !== null}
        exerciseName={howToTarget}
        onClose={handleCloseHowTo}
      />
    </SafeAreaView>
  );
}
