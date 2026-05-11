import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useGymData } from "../hooks/useGymData";
import { Colors } from "../theme";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSectionDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === yesterday.getTime()) return "Yesterday";

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatWeight(w) {
  if (w == null) return null;
  const n = typeof w === "string" ? parseFloat(w) : w;
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function formatSetChip(log) {
  const w = log.weight != null ? `${formatWeight(log.weight)}kg` : null;
  const r = log.reps != null ? String(log.reps) : null;
  if (w && r) return `${w} × ${r}`;
  if (r) return `${r} reps`;
  if (w) return w;
  return "—";
}

function calcEst1RM(weight, reps) {
  if (weight == null || reps == null || reps <= 0) return null;
  const w = parseFloat(weight);
  const r = parseInt(reps);
  if (!w || r > 30) return null; // Epley formula loses accuracy above 30 reps
  return Math.round(w * (1 + r / 30));
}

function calcVolume(logs) {
  return logs.reduce((sum, l) => {
    const w = l.weight != null ? parseFloat(l.weight) : 0;
    const r = l.reps != null ? parseInt(l.reps) : 0;
    return sum + w * r;
  }, 0);
}

function formatVolume(vol) {
  if (vol <= 0) return null;
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}t`;
  return `${Math.round(vol)}kg`;
}

const REGIME_META = {
  hypertrophy: { label: "Hypertrophy", cls: "bg-indigo-100 dark:bg-indigo-900/40", textCls: "text-indigo-700 dark:text-indigo-300" },
  strength:    { label: "Strength",    cls: "bg-red-100 dark:bg-red-900/40",        textCls: "text-red-700 dark:text-red-300" },
  power:       { label: "Power",       cls: "bg-orange-100 dark:bg-orange-900/40",  textCls: "text-orange-700 dark:text-orange-300" },
  endurance:   { label: "Endurance",   cls: "bg-emerald-100 dark:bg-emerald-900/40",textCls: "text-emerald-700 dark:text-emerald-300" },
  stability:   { label: "Stability",   cls: "bg-teal-100 dark:bg-teal-900/40",      textCls: "text-teal-700 dark:text-teal-300" },
  flexibility: { label: "Flexibility", cls: "bg-purple-100 dark:bg-purple-900/40",  textCls: "text-purple-700 dark:text-purple-300" },
  custom:      { label: "Custom",      cls: "bg-gray-100 dark:bg-gray-700",          textCls: "text-gray-600 dark:text-gray-300" },
  ppl:         { label: "PPL",         cls: "bg-amber-100 dark:bg-amber-900/40",    textCls: "text-amber-700 dark:text-amber-300" },
};

function regimeMeta(name) {
  if (!name) return null;
  return REGIME_META[name.toLowerCase()] ?? {
    label: name.charAt(0).toUpperCase() + name.slice(1),
    cls: "bg-gray-100 dark:bg-gray-700",
    textCls: "text-gray-600 dark:text-gray-300",
  };
}

// ─── Set chip with optional 1RM ───────────────────────────────────────────────

function SetChip({ log, onEdit }) {
  const est1rm = calcEst1RM(log.weight, log.reps);
  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onEdit(log); }}
      activeOpacity={0.7}
      className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg px-2.5 py-1.5"
    >
      <Text className="text-xs text-gray-600 dark:text-gray-300 font-medium">{formatSetChip(log)}</Text>
      {est1rm ? (
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">~{est1rm}kg 1RM</Text>
      ) : null}
    </TouchableOpacity>
  );
}

// ─── Add-set form (inline, per exercise) ─────────────────────────────────────

function AddSetForm({ onSave, onCancel }) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave({ weight: weight || null, reps: reps || null });
    setSaving(false);
  }

  return (
    <View className="flex-row items-center gap-x-2 mt-1 mb-1">
      <TextInput
        className="w-16 border border-gray-200 dark:border-gray-600 rounded-lg py-1.5 px-2 text-center text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
        placeholder="kg"
        placeholderTextColor={Colors.textLight}
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
        autoFocus
      />
      <TextInput
        className="w-16 border border-gray-200 dark:border-gray-600 rounded-lg py-1.5 px-2 text-center text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
        placeholder="reps"
        placeholderTextColor={Colors.textLight}
        keyboardType="number-pad"
        value={reps}
        onChangeText={setReps}
      />
      <TouchableOpacity
        onPress={handleSave}
        disabled={saving || (!weight && !reps)}
        className={`w-7 h-7 rounded-lg items-center justify-center ${saving || (!weight && !reps) ? "bg-indigo-300" : "bg-indigo-600"}`}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <Ionicons name="checkmark" size={14} color={Colors.white} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onCancel}
        className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-600 items-center justify-center"
        activeOpacity={0.8}
      >
        <Ionicons name="close" size={14} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Inline set editor ────────────────────────────────────────────────────────

function SetEditor({ log, onSave, onDelete, onCancel }) {
  const [weight, setWeight] = useState(log.weight != null ? String(log.weight) : "");
  const [reps, setReps] = useState(log.reps != null ? String(log.reps) : "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave(log.id, { weight: weight || null, reps: reps || null });
    setSaving(false);
  }

  return (
    <View className="flex-row items-center gap-x-2 mt-1 mb-1">
      <TextInput
        className="w-16 border border-gray-200 dark:border-gray-600 rounded-lg py-1.5 px-2 text-center text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
        placeholder="kg"
        placeholderTextColor={Colors.textLight}
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        className="w-16 border border-gray-200 dark:border-gray-600 rounded-lg py-1.5 px-2 text-center text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
        placeholder="reps"
        placeholderTextColor={Colors.textLight}
        keyboardType="number-pad"
        value={reps}
        onChangeText={setReps}
      />
      <TouchableOpacity
        onPress={handleSave}
        disabled={saving}
        className="w-7 h-7 rounded-lg bg-indigo-600 items-center justify-center"
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <Ionicons name="checkmark" size={14} color={Colors.white} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(log.id)}
        className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 items-center justify-center"
        activeOpacity={0.8}
      >
        <Ionicons name="trash-outline" size={14} color={Colors.danger} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onCancel}
        className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-600 items-center justify-center"
        activeOpacity={0.8}
      >
        <Ionicons name="close" size={14} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Session card ─────────────────────────────────────────────────────────────

function SessionCard({ session, updateLog, deleteLog, insertLog, updateDate, renameExercise }) {
  const [editingLogId, setEditingLogId] = useState(null);
  const [addingExercise, setAddingExercise] = useState(null);
  const [renamingExercise, setRenamingExercise] = useState(null);
  const [renameInput, setRenameInput] = useState("");
  const [savingRename, setSavingRename] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [dateInput, setDateInput] = useState(session.date);
  const [savingDate, setSavingDate] = useState(false);
  const [localLogs, setLocalLogs] = useState(session.session_logs ?? []);

  const startTime = formatTime(session.started_at);
  const totalSets = localLogs.length;
  const volume = formatVolume(calcVolume(localLogs));
  const regime = regimeMeta(session.regimes?.name);

  const exerciseOrder = [];
  const byExercise = {};
  [...localLogs]
    .sort((a, b) => a.set_number - b.set_number)
    .forEach((log) => {
      if (!byExercise[log.exercise_name]) {
        byExercise[log.exercise_name] = [];
        exerciseOrder.push(log.exercise_name);
      }
      byExercise[log.exercise_name].push(log);
    });

  async function handleSave(logId, { weight, reps }) {
    await updateLog(logId, { weight, reps });
    setLocalLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? { ...l, weight: weight != null ? parseFloat(weight) : null, reps: reps != null ? parseInt(reps) : null }
          : l
      )
    );
    setEditingLogId(null);
  }

  async function handleDelete(logId) {
    Alert.alert("Delete set?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteLog(logId);
          setLocalLogs((prev) => prev.filter((l) => l.id !== logId));
          setEditingLogId(null);
        },
      },
    ]);
  }

  async function handleSaveDate() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      Alert.alert("Invalid date", "Use YYYY-MM-DD format.");
      return;
    }
    const entered = new Date(dateInput + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (entered > today) {
      Alert.alert("Invalid date", "Date cannot be in the future.");
      return;
    }
    setSavingDate(true);
    await updateDate(session.id, dateInput);
    setSavingDate(false);
    setEditingDate(false);
  }

  async function handleRenameExercise() {
    const newName = renameInput.trim();
    if (!newName || newName === renamingExercise) { setRenamingExercise(null); return; }
    setSavingRename(true);
    const ok = await renameExercise(session.id, renamingExercise, newName);
    if (ok) {
      setLocalLogs((prev) =>
        prev.map((l) => l.exercise_name === renamingExercise ? { ...l, exercise_name: newName } : l)
      );
    }
    setSavingRename(false);
    setRenamingExercise(null);
  }

  async function handleAddSet(exerciseName, { weight, reps }) {
    const existingForExercise = localLogs.filter((l) => l.exercise_name === exerciseName);
    const nextSetNumber = existingForExercise.length
      ? Math.max(...existingForExercise.map((l) => l.set_number)) + 1
      : 1;
    const newId = await insertLog(session.id, {
      exerciseName,
      setNumber: nextSetNumber,
      weight: weight || null,
      reps: reps || null,
    });
    if (newId) {
      setLocalLogs((prev) => [
        ...prev,
        { id: newId, session_id: session.id, exercise_name: exerciseName, set_number: nextSetNumber,
          weight: weight ? parseFloat(weight) : null, reps: reps ? parseInt(reps) : null },
      ]);
    }
    setAddingExercise(null);
  }

  return (
    <View className="mx-4 mb-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Header */}
      <View className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-x-2 flex-1">
            {regime ? (
              <View className={`rounded-md px-2 py-0.5 ${regime.cls}`}>
                <Text className={`text-xs font-semibold ${regime.textCls}`}>{regime.label}</Text>
              </View>
            ) : null}
            {startTime ? (
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">{startTime}</Text>
            ) : null}
            {session.notes ? (
              <Ionicons name="document-text-outline" size={12} color={Colors.textMuted} />
            ) : null}
          </View>
          <View className="flex-row items-center gap-x-2">
            <View className="items-end">
              <Text className="text-xs text-gray-400 dark:text-gray-500">
                <Text className="font-semibold text-gray-500 dark:text-gray-400">{totalSets}</Text>
                {" sets"}
              </Text>
              {volume ? (
                <Text className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-0.5">{volume}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEditingDate((v) => !v); setDateInput(session.date); }}
              activeOpacity={0.7}
              className="w-6 h-6 items-center justify-center"
            >
              <Ionicons name={editingDate ? "close" : "pencil-outline"} size={13} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
        {editingDate && (
          <View className="flex-row items-center gap-x-2 mt-2">
            <TextInput
              className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-1.5 px-3 text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
              value={dateInput}
              onChangeText={setDateInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numbers-and-punctuation"
              autoFocus
            />
            <TouchableOpacity
              onPress={handleSaveDate}
              disabled={savingDate}
              className="w-7 h-7 rounded-lg bg-indigo-600 items-center justify-center"
              activeOpacity={0.8}
            >
              {savingDate ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Ionicons name="checkmark" size={14} color={Colors.white} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Exercise rows */}
      {exerciseOrder.length === 0 ? (
        <View className="px-4 py-4">
          <Text className="text-sm text-gray-300 italic">No sets logged</Text>
        </View>
      ) : (
        exerciseOrder.map((name, idx) => {
          const logs = byExercise[name];
          const isLast = idx === exerciseOrder.length - 1;
          return (
            <View
              key={name}
              className={`px-4 py-3 ${isLast ? "" : "border-b border-gray-50 dark:border-gray-700"}`}
            >
              {renamingExercise === name ? (
                <View className="flex-row items-center gap-x-2 mb-2">
                  <TextInput
                    className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-1 px-2 text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                    value={renameInput}
                    onChangeText={setRenameInput}
                    placeholder="New exercise name"
                    placeholderTextColor={Colors.textMuted}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleRenameExercise}
                  />
                  <TouchableOpacity onPress={handleRenameExercise} disabled={savingRename}
                    className="w-6 h-6 rounded-lg bg-indigo-600 items-center justify-center" activeOpacity={0.8}>
                    {savingRename ? <ActivityIndicator size="small" color={Colors.white} /> : <Ionicons name="checkmark" size={12} color={Colors.white} />}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRenamingExercise(null)}
                    className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-600 items-center justify-center" activeOpacity={0.8}>
                    <Ionicons name="close" size={12} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center gap-x-1.5 flex-1">
                    <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300">{name}</Text>
                    <TouchableOpacity
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setRenamingExercise(name); setRenameInput(name); }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="swap-horizontal-outline" size={13} color={Colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                  {addingExercise !== name && (
                    <TouchableOpacity
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setAddingExercise(name); }}
                      activeOpacity={0.7}
                      className="flex-row items-center gap-x-0.5"
                    >
                      <Ionicons name="add-circle-outline" size={14} color={Colors.primary} />
                      <Text className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Add set</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <View className="flex-row flex-wrap gap-x-2 gap-y-1.5">
                {logs.map((log) =>
                  editingLogId === log.id ? (
                    <SetEditor
                      key={log.id}
                      log={log}
                      onSave={handleSave}
                      onDelete={handleDelete}
                      onCancel={() => setEditingLogId(null)}
                    />
                  ) : (
                    <SetChip
                      key={log.id}
                      log={log}
                      onEdit={(l) => setEditingLogId(l.id)}
                    />
                  )
                )}
              </View>
              {addingExercise === name && (
                <AddSetForm
                  onSave={(vals) => handleAddSet(name, vals)}
                  onCancel={() => setAddingExercise(null)}
                />
              )}
            </View>
          );
        })
      )}

      {/* Session notes */}
      {session.notes ? (
        <View className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-800/40">
          <Text className="text-xs text-amber-700 dark:text-amber-400 italic">"{session.notes}"</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const { fetchSessionHistory, updateSessionLog, deleteSessionLog, insertSessionLog, updateSessionDate, renameExerciseInSession, sessionHistory, loading } = useGymData();

  useFocusEffect(
    useCallback(() => {
      fetchSessionHistory();
    }, [fetchSessionHistory])
  );

  const sections = useMemo(() => {
    if (!sessionHistory.length) return [];
    const grouped = {};
    sessionHistory.forEach((session) => {
      const date = session.date;
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(session);
    });
    Object.values(grouped).forEach((group) =>
      group.sort((a, b) => {
        if (!a.started_at && !b.started_at) return 0;
        if (!a.started_at) return 1;
        if (!b.started_at) return -1;
        return b.started_at.localeCompare(a.started_at);
      })
    );
    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([title, data]) => ({ title, data }));
  }, [sessionHistory]);

  if (loading && !sessionHistory.length) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-950 items-center justify-center" edges={["top"]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (!loading && !sessionHistory.length) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-950 items-center justify-center px-8" edges={["top"]}>
        <Ionicons name="time-outline" size={48} color={Colors.textLight} />
        <Text className="text-lg font-bold text-gray-400 mt-4 text-center">No sessions yet</Text>
        <Text className="text-sm text-gray-400 mt-2 text-center leading-5">
          Complete your first workout and it will appear here.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={["top"]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section: { title } }) => (
          <View className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {formatSectionDate(title)}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            updateLog={updateSessionLog}
            deleteLog={deleteSessionLog}
            insertLog={insertSessionLog}
            updateDate={updateSessionDate}
            renameExercise={renameExerciseInSession}
          />
        )}
        SectionSeparatorComponent={() => <View className="h-1" />}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}
