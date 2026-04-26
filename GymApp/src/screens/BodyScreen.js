import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { VictoryLine, VictoryChart, VictoryAxis, VictoryScatter } from "victory-native";
import { supabase } from "../lib/supabase";
import { Colors } from "../theme";

const CHART_WINDOW = 90; // days of history shown in chart

function toDateStr(d) {
  return d.toISOString().split("T")[0];
}

function todayStr() {
  return toDateStr(new Date());
}

function shortDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export default function BodyScreen() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(todayStr());
  const inputRef = useRef(null);

  const loadEntries = useCallback(async () => {
    const uid = await getUserId();
    if (!uid) return;
    const cutoff = toDateStr(new Date(Date.now() - CHART_WINDOW * 86400_000));
    const { data, error } = await supabase
      .from("bodyweight_logs")
      .select("id, date, weight_kg")
      .eq("user_id", uid)
      .gte("date", cutoff)
      .order("date", { ascending: true });
    if (!error && data) setEntries(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  async function handleSave() {
    const kg = parseFloat(weight.replace(",", "."));
    if (!kg || kg < 20 || kg > 500) {
      Alert.alert("Invalid weight", "Please enter a weight between 20 and 500 kg.");
      return;
    }
    setSaving(true);
    Keyboard.dismiss();
    const uid = await getUserId();
    const { error } = await supabase
      .from("bodyweight_logs")
      .upsert({ user_id: uid, date, weight_kg: kg }, { onConflict: "user_id,date" });
    setSaving(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setWeight("");
      setDate(todayStr());
      loadEntries();
    }
  }

  async function handleDelete(id) {
    Alert.alert("Delete entry?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await supabase.from("bodyweight_logs").delete().eq("id", id);
          setEntries((prev) => prev.filter((e) => e.id !== id));
        },
      },
    ]);
  }

  const chartData = entries.map((e) => ({
    x: new Date(e.date + "T00:00:00").getTime(),
    y: parseFloat(e.weight_kg),
  }));

  const weights = entries.map((e) => parseFloat(e.weight_kg));
  const minW = weights.length ? Math.min(...weights) : 0;
  const maxW = weights.length ? Math.max(...weights) : 100;
  const yPad = Math.max((maxW - minW) * 0.2, 2);

  const latest = entries[entries.length - 1];
  const prev = entries[entries.length - 2];
  const diff = latest && prev
    ? (parseFloat(latest.weight_kg) - parseFloat(prev.weight_kg)).toFixed(1)
    : null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-4 pt-4 pb-2">
            <Text className="text-2xl font-bold text-gray-900">Body</Text>
            <Text className="text-sm text-gray-400 mt-0.5">Bodyweight tracking</Text>
          </View>

          {/* Stats row */}
          {latest && (
            <View className="flex-row mx-4 gap-x-3 mt-2 mb-1">
              <View className="flex-1 bg-white rounded-xl border border-gray-200 px-4 py-3">
                <Text className="text-xs text-gray-400 uppercase tracking-widest">Latest</Text>
                <Text className="text-2xl font-bold text-gray-900 mt-1">
                  {parseFloat(latest.weight_kg).toFixed(1)}
                  <Text className="text-base font-normal text-gray-400"> kg</Text>
                </Text>
                <Text className="text-xs text-gray-400 mt-0.5">{shortDate(latest.date)}</Text>
              </View>
              {diff !== null && (
                <View className="flex-1 bg-white rounded-xl border border-gray-200 px-4 py-3">
                  <Text className="text-xs text-gray-400 uppercase tracking-widest">Change</Text>
                  <Text
                    className={`text-2xl font-bold mt-1 ${
                      parseFloat(diff) < 0 ? "text-green-600" : parseFloat(diff) > 0 ? "text-orange-500" : "text-gray-400"
                    }`}
                  >
                    {parseFloat(diff) > 0 ? "+" : ""}{diff}
                    <Text className="text-base font-normal text-gray-400"> kg</Text>
                  </Text>
                  <Text className="text-xs text-gray-400 mt-0.5">vs previous</Text>
                </View>
              )}
            </View>
          )}

          {/* Chart */}
          {loading ? (
            <View className="h-40 items-center justify-center">
              <ActivityIndicator color={Colors.primary} />
            </View>
          ) : chartData.length >= 2 ? (
            <View className="mx-4 bg-white rounded-xl border border-gray-200 overflow-hidden mt-3">
              <Text className="px-4 pt-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Last {CHART_WINDOW} days
              </Text>
              <VictoryChart
                height={180}
                padding={{ top: 16, bottom: 32, left: 44, right: 16 }}
                domain={{ y: [minW - yPad, maxW + yPad] }}
              >
                <VictoryAxis
                  tickFormat={(t) => {
                    const d = new Date(t);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                  tickCount={4}
                  style={{
                    axis: { stroke: Colors.gray200 },
                    ticks: { stroke: "transparent" },
                    tickLabels: { fontSize: 10, fill: Colors.textMuted },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(t) => `${t}`}
                  tickCount={4}
                  style={{
                    axis: { stroke: "transparent" },
                    grid: { stroke: Colors.gray200, strokeDasharray: "4,4" },
                    tickLabels: { fontSize: 10, fill: Colors.textMuted },
                  }}
                />
                <VictoryLine
                  data={chartData}
                  style={{ data: { stroke: Colors.primary, strokeWidth: 2 } }}
                  interpolation="monotoneX"
                />
                <VictoryScatter
                  data={chartData}
                  size={3}
                  style={{ data: { fill: Colors.primary } }}
                />
              </VictoryChart>
            </View>
          ) : null}

          {/* Log entry form */}
          <View className="mx-4 mt-4 bg-white rounded-xl border border-gray-200 p-4">
            <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Log weight
            </Text>
            <View className="flex-row gap-x-3 items-center">
              <TextInput
                ref={inputRef}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 bg-gray-50"
                placeholder="e.g. 82.5"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
              <Text className="text-sm text-gray-400 font-medium">kg</Text>
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving || !weight}
                className={`px-4 py-3 rounded-xl items-center ${
                  saving || !weight ? "bg-indigo-300" : "bg-indigo-600"
                }`}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Ionicons name="checkmark" size={20} color={Colors.white} />
                )}
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-400 mt-2">
              Date: {shortDate(date)} (today)
            </Text>
          </View>

          {/* History list */}
          {entries.length > 0 && (
            <View className="mx-4 mt-4">
              <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                History
              </Text>
              <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {[...entries].reverse().map((entry, i, arr) => (
                  <View
                    key={entry.id}
                    className={`flex-row items-center px-4 py-3 ${
                      i < arr.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-gray-800">
                        {parseFloat(entry.weight_kg).toFixed(1)} kg
                      </Text>
                      <Text className="text-xs text-gray-400 mt-0.5">
                        {shortDate(entry.date)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDelete(entry.id)}
                      className="p-2"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {!loading && entries.length === 0 && (
            <View className="items-center mt-16 px-8">
              <Ionicons name="scale-outline" size={48} color={Colors.textLight} />
              <Text className="text-lg font-bold text-gray-400 mt-4 text-center">
                No entries yet
              </Text>
              <Text className="text-sm text-gray-400 mt-2 text-center leading-5">
                Log your bodyweight above to start tracking your progress.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
