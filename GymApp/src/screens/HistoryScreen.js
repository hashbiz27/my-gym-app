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

// ─── Inline set editor ────────────────────────────────────────────────────────

function SetChip({ log, onEdit }) {
  return (
    <TouchableOpacity
      onPress={() => onEdit(log)}
      activeOpacity={0.7}
      className="bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1"
    >
      <Text className="text-xs text-gray-600 font-medium">{formatSetChip(log)}</Text>
    </TouchableOpacity>
  );
}

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
        className="w-16 border border-gray-200 rounded-lg py-1.5 px-2 text-center text-xs text-gray-800 bg-white"
        placeholder="kg"
        placeholderTextColor={Colors.textLight}
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        className="w-16 border border-gray-200 rounded-lg py-1.5 px-2 text-center text-xs text-gray-800 bg-white"
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
        className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 items-center justify-center"
        activeOpacity={0.8}
      >
        <Ionicons name="trash-outline" size={14} color={Colors.danger} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onCancel}
        className="w-7 h-7 rounded-lg bg-gray-100 items-center justify-center"
        activeOpacity={0.8}
      >
        <Ionicons name="close" size={14} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Session card ─────────────────────────────────────────────────────────────

function SessionCard({ session, updateLog, deleteLog, onSessionDeleted }) {
  const [editingLogId, setEditingLogId] = useState(null);
  // Local copy of logs so we can update without a full refetch
  const [localLogs, setLocalLogs] = useState(session.session_logs ?? []);

  const startTime = formatTime(session.started_at);
  const totalSets = localLogs.length;

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

  return (
    <View className="mx-4 mb-3 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <View className="px-4 py-2.5 border-b border-gray-100 flex-row justify-between items-center bg-gray-50">
        <View className="flex-row items-center gap-x-2">
          {startTime ? (
            <Text className="text-xs text-gray-500 font-medium">{startTime}</Text>
          ) : null}
          {session.notes ? (
            <Ionicons name="document-text-outline" size={12} color={Colors.textMuted} />
          ) : null}
        </View>
        <Text className="text-xs text-gray-400">
          <Text className="font-semibold text-gray-500">{totalSets}</Text>
          {" sets logged"}
        </Text>
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
              className={`px-4 py-3 ${isLast ? "" : "border-b border-gray-50"}`}
            >
              <Text className="text-xs font-semibold text-gray-700 mb-2">{name}</Text>
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
            </View>
          );
        })
      )}

      {/* Session notes */}
      {session.notes ? (
        <View className="px-4 py-3 bg-amber-50 border-t border-amber-100">
          <Text className="text-xs text-amber-700 italic">"{session.notes}"</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const { fetchSessionHistory, updateSessionLog, deleteSessionLog, sessionHistory, loading } = useGymData();

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
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={["top"]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (!loading && !sessionHistory.length) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-8" edges={["top"]}>
        <Ionicons name="time-outline" size={48} color={Colors.textLight} />
        <Text className="text-lg font-bold text-gray-400 mt-4 text-center">No sessions yet</Text>
        <Text className="text-sm text-gray-400 mt-2 text-center leading-5">
          Complete your first workout and it will appear here.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section: { title } }) => (
          <View className="px-4 py-2 bg-gray-100 border-b border-gray-200">
            <Text className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              {formatSectionDate(title)}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            updateLog={updateSessionLog}
            deleteLog={deleteSessionLog}
          />
        )}
        SectionSeparatorComponent={() => <View className="h-1" />}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}
