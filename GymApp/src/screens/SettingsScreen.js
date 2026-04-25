import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
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

function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

function SectionHeader({ title }) {
  return (
    <Text className="px-4 pt-6 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
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
  const [loading, setLoading] = useState(true);

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
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center" edges={["top"]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Account */}
        <SectionHeader title="Account" />
        <View className="mx-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <View className="flex-row items-center px-4 py-3.5">
            <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
            <Text className="ml-3 text-sm text-gray-700 flex-1" numberOfLines={1}>
              {email ?? "—"}
            </Text>
          </View>
        </View>

        {/* Training regime */}
        <SectionHeader title="Training Regime" />
        <RegimeGrid value={regime} onSelect={(v) => handleSelect("regime", v)} />

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

        {/* Sex */}
        <SectionHeader title="Sex" />
        <PillPicker
          options={SEX_OPTIONS}
          value={sex}
          onSelect={(v) => handleSelect("sex", v)}
        />

        {/* Display */}
        <SectionHeader title="Display" />
        <View className="mx-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <View className="flex-row items-center px-4 py-3.5">
            <Ionicons
              name={isDark ? "moon" : "sunny-outline"}
              size={18}
              color={Colors.textMuted}
            />
            <Text className="ml-3 text-sm text-gray-700 flex-1">Dark mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: Colors.gray200, true: Colors.primaryMid }}
              thumbColor={isDark ? Colors.primary : Colors.gray50}
            />
          </View>
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
    </SafeAreaView>
  );
}
