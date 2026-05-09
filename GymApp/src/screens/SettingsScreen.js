import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Share,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useGymData } from "../hooks/useGymData";
import { useAppTheme } from "../context/ThemeContext";
import { AGE_CLASSES, WEIGHT_CLASSES, REGIMES } from "../data/gymData";
import { Colors } from "../theme";

const REGIME_LIST = Object.values(REGIMES);
const SEX_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

function encodeRoutine(regime, schedule) {
  const payload = JSON.stringify({ regime, schedule: schedule ?? {} });
  return "LO:" + btoa(unescape(encodeURIComponent(payload)));
}

function decodeRoutine(code) {
  try {
    if (!code.startsWith("LO:")) return null;
    const payload = JSON.parse(decodeURIComponent(escape(atob(code.slice(3)))));
    if (!payload.regime || !REGIMES[payload.regime]) return null;
    return payload;
  } catch {
    return null;
  }
}

function ImportModal({ visible, onClose, onImport }) {
  const [code, setCode] = useState("");
  const inputRef = useRef(null);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={() => setTimeout(() => inputRef.current?.focus(), 100)}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-5 w-full">
          <Text className="text-base font-semibold text-gray-800 mb-1">Import Routine</Text>
          <Text className="text-xs text-gray-400 mb-3">Paste the routine code shared by another LiftOff user.</Text>
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={setCode}
            placeholder="Paste code here…"
            placeholderTextColor="#9ca3af"
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 mb-4"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => { setCode(""); onClose(); }}
              className="flex-1 py-3 rounded-xl border border-gray-200 items-center"
              activeOpacity={0.75}
            >
              <Text className="text-sm text-gray-600 font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { onImport(code.trim()); setCode(""); }}
              className="flex-1 py-3 rounded-xl bg-indigo-600 items-center"
              activeOpacity={0.75}
            >
              <Text className="text-sm text-white font-semibold">Import</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SectionHeader({ title }) {
  return (
    <Text className="px-4 pt-6 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
      {title}
    </Text>
  );
}

function PillPicker({ options, value, onSelect }) {
  return (
    <View className="flex-row flex-wrap px-4 gap-2">
      {options.map((opt) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const val = typeof opt === "string" ? opt : opt.value;
        const active = val === value;
        return (
          <TouchableOpacity
            key={val}
            onPress={() => onSelect(val)}
            className={`px-4 py-2 rounded-full border ${
              active ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-200"
            }`}
            activeOpacity={0.75}
          >
            <Text
              className={`text-sm font-medium ${active ? "text-white" : "text-gray-600"}`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SchedulePicker({ regime, schedule, onSelect, customSessions }) {
  const baseCfg = regime ? REGIMES[regime] : null;
  const cfg =
    regime === "custom" && customSessions?.length
      ? {
          ...baseCfg,
          sessionOrder: customSessions.map((s) => s.id),
          sessionLabels: Object.fromEntries(customSessions.map((s) => [s.id, s.label])),
        }
      : baseCfg;
  const options = cfg?.sessionOrder?.length
    ? [
        { id: "rest", label: "Rest" },
        ...cfg.sessionOrder.map((id) => ({ id, label: cfg.sessionLabels[id] })),
      ]
    : [{ id: "rest", label: "Rest" }];

  return (
    <View className="mx-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
      {DAYS.map((day, idx) => {
        const value = schedule?.[String(idx)] ?? "rest";
        return (
          <View
            key={day}
            className={`flex-row items-center px-4 py-2.5 ${idx < 6 ? "border-b border-gray-100" : ""}`}
          >
            <Text className="w-9 text-sm font-semibold text-gray-500">{day}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
              <View className="flex-row gap-2 pr-2">
                {options.map((opt) => {
                  const active = opt.id === value;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => onSelect(String(idx), opt.id)}
                      className={`px-3 py-1 rounded-full border ${
                        active ? "bg-indigo-600 border-indigo-600" : "bg-gray-50 border-gray-200"
                      }`}
                      activeOpacity={0.75}
                    >
                      <Text className={`text-xs font-medium ${active ? "text-white" : "text-gray-600"}`}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
}

function CustomSessionsEditor({ sessions, onAdd, onRemove }) {
  const [draft, setDraft] = useState("");

  function add() {
    const label = draft.trim();
    if (!label) return;
    onAdd({ id: `custom-${Date.now()}`, label });
    setDraft("");
  }

  return (
    <View className="mx-4">
      {sessions.length > 0 && (
        <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-3">
          {sessions.map((s, idx) => (
            <View
              key={s.id}
              className={`flex-row items-center px-4 py-3 ${idx < sessions.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""}`}
            >
              <Text className="flex-1 text-sm text-gray-800 dark:text-gray-200">{s.label}</Text>
              <TouchableOpacity
                onPress={() => onRemove(s.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle-outline" size={20} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <View className="flex-row gap-2">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="e.g. Push Day, Legs, Upper…"
          placeholderTextColor="#9ca3af"
          className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-gray-200"
          returnKeyType="done"
          onSubmitEditing={add}
        />
        <TouchableOpacity
          onPress={add}
          className="px-4 rounded-xl bg-indigo-600 items-center justify-center"
          activeOpacity={0.75}
        >
          <Text className="text-sm text-white font-semibold">Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RegimeGrid({ value, onSelect }) {
  return (
    <View className="px-4 gap-3">
      {chunk(REGIME_LIST, 2).map((row, rowIdx) => (
        <View key={rowIdx} className="flex-row gap-3">
          {row.map((regime) => {
            const active = regime.id === value;
            return (
              <TouchableOpacity
                key={regime.id}
                onPress={() => onSelect(regime.id)}
                className={`flex-1 rounded-xl border p-3 ${
                  active
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 bg-white"
                }`}
                activeOpacity={0.75}
              >
                <Text className="text-xl mb-1">{regime.icon}</Text>
                <Text
                  className={`text-sm font-semibold ${
                    active ? "text-indigo-700" : "text-gray-800"
                  }`}
                >
                  {regime.label}
                </Text>
                <Text
                  className={`text-xs mt-0.5 leading-4 ${
                    active ? "text-indigo-500" : "text-gray-400"
                  }`}
                >
                  {regime.tagline}
                </Text>
              </TouchableOpacity>
            );
          })}
          {row.length === 1 && <View className="flex-1" />}
        </View>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const { fetchProfile, saveProfile } = useGymData();
  const { isDark, toggleTheme } = useAppTheme();

  const [email, setEmail] = useState(null);
  const [regime, setRegime] = useState(null);
  const [ageClass, setAgeClass] = useState(null);
  const [weightClass, setWeightClass] = useState(null);
  const [sex, setSex] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [customSessions, setCustomSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importModalVisible, setImportModalVisible] = useState(false);

  useEffect(() => {
    async function load() {
      const [profile, { data: { user } }] = await Promise.all([
        fetchProfile(),
        supabase.auth.getUser(),
      ]);
      if (user) setEmail(user.email);
      if (profile) {
        setRegime(profile.regime ?? null);
        setAgeClass(profile.age_class ?? null);
        setWeightClass(profile.weight_class ?? null);
        setSex(profile.sex ?? null);
        setSchedule(profile.schedule ?? null);
        setCustomSessions(Array.isArray(profile.custom_sessions) ? profile.custom_sessions : []);
      }
      setLoading(false);
    }
    load();
  }, [fetchProfile]);

  const handleSelect = useCallback(
    async (field, value) => {
      switch (field) {
        case "regime":       setRegime(value);      break;
        case "age_class":    setAgeClass(value);    break;
        case "weight_class": setWeightClass(value); break;
        case "sex":          setSex(value);         break;
      }
      await saveProfile({ [field]: value });
    },
    [saveProfile]
  );

  const handleScheduleSelect = useCallback(
    async (dayIndex, sessionId) => {
      const next = { ...(schedule ?? {}), [dayIndex]: sessionId };
      setSchedule(next);
      await saveProfile({ schedule: next });
    },
    [schedule, saveProfile]
  );

  const handleAddCustomSession = useCallback(
    async (session) => {
      const next = [...customSessions, session];
      setCustomSessions(next);
      await saveProfile({ custom_sessions: next });
    },
    [customSessions, saveProfile]
  );

  const handleRemoveCustomSession = useCallback(
    async (id) => {
      const next = customSessions.filter((s) => s.id !== id);
      setCustomSessions(next);
      await saveProfile({ custom_sessions: next });
    },
    [customSessions, saveProfile]
  );

  async function handleShareRoutine() {
    if (!regime) {
      Alert.alert("No routine set", "Please select a training regime first.");
      return;
    }
    const code = encodeRoutine(regime, schedule);
    try {
      await Share.share({
        message: `Follow my training routine on LiftOff!\n\nRoutine code:\n${code}`,
      });
    } catch (_) {}
  }

  async function handleImportRoutine(code) {
    const decoded = decodeRoutine(code);
    if (!decoded) {
      Alert.alert("Invalid code", "That doesn't look like a valid LiftOff routine code. Check the code and try again.");
      return;
    }
    setImportModalVisible(false);
    setRegime(decoded.regime);
    setSchedule(decoded.schedule ?? null);
    await saveProfile({ regime: decoded.regime, schedule: decoded.schedule ?? null });
    Alert.alert("Routine imported!", `You're now following the ${REGIMES[decoded.regime].label} routine.`);
  }

  async function handleSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) Alert.alert("Error", error.message);
          // onAuthStateChange in App.js handles the redirect to Login
        },
      },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950 items-center justify-center" edges={["top"]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Account */}
        <SectionHeader title="Account" />
        <View className="mx-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <View className="flex-row items-center px-4 py-3.5">
            <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
            <Text className="ml-3 text-sm text-gray-700 dark:text-gray-300 flex-1" numberOfLines={1}>
              {email ?? "—"}
            </Text>
          </View>
        </View>

        {/* Training regime */}
        <SectionHeader title="Training Regime" />
        <RegimeGrid value={regime} onSelect={(v) => handleSelect("regime", v)} />

        {/* Custom session names — shown only when Custom regime is active */}
        {regime === "custom" && (
          <>
            <SectionHeader title="Your Sessions" />
            <CustomSessionsEditor
              sessions={customSessions}
              onAdd={handleAddCustomSession}
              onRemove={handleRemoveCustomSession}
            />
          </>
        )}

        {/* Weekly schedule */}
        <SectionHeader title="Weekly Schedule" />
        <SchedulePicker
          regime={regime}
          schedule={schedule}
          onSelect={handleScheduleSelect}
          customSessions={customSessions}
        />

        {/* Sex */}
        <SectionHeader title="Sex" />
        <PillPicker
          options={SEX_OPTIONS}
          value={sex}
          onSelect={(v) => handleSelect("sex", v)}
        />

        {/* Age class */}
        <SectionHeader title="Age Class" />
        <PillPicker
          options={AGE_CLASSES}
          value={ageClass}
          onSelect={(v) => handleSelect("age_class", v)}
        />

        {/* Weight class */}
        <SectionHeader title="Weight Class" />
        <PillPicker
          options={WEIGHT_CLASSES}
          value={weightClass}
          onSelect={(v) => handleSelect("weight_class", v)}
        />

        {/* Display */}
        <SectionHeader title="Display" />
        <View className="mx-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <View className="flex-row items-center px-4 py-3.5">
            <Ionicons
              name={isDark ? "moon" : "sunny-outline"}
              size={18}
              color={Colors.textMuted}
            />
            <Text className="ml-3 text-sm text-gray-700 dark:text-gray-300 flex-1">Dark mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: Colors.gray200, true: Colors.primaryMid }}
              thumbColor={isDark ? Colors.primary : Colors.gray50}
            />
          </View>
        </View>

        {/* Routine sharing */}
        <SectionHeader title="Routine Sharing" />
        <View className="mx-4 gap-3">
          <TouchableOpacity
            className="flex-row items-center justify-center gap-x-2 rounded-xl bg-indigo-600 py-3.5"
            onPress={handleShareRoutine}
            activeOpacity={0.75}
          >
            <Ionicons name="share-outline" size={18} color="white" />
            <Text className="text-white font-semibold text-sm">Share my routine</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-center gap-x-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3.5"
            onPress={() => setImportModalVisible(true)}
            activeOpacity={0.75}
          >
            <Ionicons name="download-outline" size={18} color={Colors.textMuted} />
            <Text className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Import a routine</Text>
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <View className="mt-6 mx-4">
          <TouchableOpacity
            className="flex-row items-center justify-center gap-x-2 rounded-xl border border-red-200 py-3.5"
            onPress={handleSignOut}
            activeOpacity={0.75}
          >
            <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
            <Text className="text-red-600 font-semibold text-sm">Sign out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <ImportModal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onImport={handleImportRoutine}
      />
    </SafeAreaView>
  );
}
