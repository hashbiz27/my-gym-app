import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AGE_CLASSES, WEIGHT_CLASSES, REGIMES } from "../data/gymData";
import { useGymData } from "../hooks/useGymData";
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

function StepHeader({ step, total, title, subtitle }) {
  return (
    <View className="px-6 pt-8 pb-4">
      <Text className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">
        Step {step} of {total}
      </Text>
      <Text className="text-2xl font-bold text-gray-900">{title}</Text>
      {subtitle ? (
        <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
      ) : null}
    </View>
  );
}

function PillPicker({ options, value, onSelect }) {
  return (
    <View className="flex-row flex-wrap px-6 gap-2">
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
            <Text className={`text-sm font-medium ${active ? "text-white" : "text-gray-600"}`}>
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
    <View className="px-6 gap-3">
      {chunk(REGIME_LIST, 2).map((row, rowIdx) => (
        <View key={rowIdx} className="flex-row gap-3">
          {row.map((regime) => {
            const active = regime.id === value;
            return (
              <TouchableOpacity
                key={regime.id}
                onPress={() => onSelect(regime.id)}
                className={`flex-1 rounded-xl border p-3 ${
                  active ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white"
                }`}
                activeOpacity={0.75}
              >
                <Text className="text-xl mb-1">{regime.icon}</Text>
                <Text className={`text-sm font-semibold ${active ? "text-indigo-700" : "text-gray-800"}`}>
                  {regime.label}
                </Text>
                <Text className={`text-xs mt-0.5 leading-4 ${active ? "text-indigo-500" : "text-gray-400"}`}>
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

export default function OnboardingScreen({ onComplete }) {
  const { saveProfile } = useGymData();

  const [step, setStep] = useState(1);
  const [regime, setRegime] = useState(null);
  const [ageClass, setAgeClass] = useState(null);
  const [weightClass, setWeightClass] = useState(null);
  const [sex, setSex] = useState("male");
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    if (!regime || !ageClass || !weightClass) return;
    setSaving(true);
    await saveProfile({ regime, age_class: ageClass, weight_class: weightClass, sex });
    setSaving(false);
    onComplete();
  }

  const canAdvance = step === 1 ? !!regime : step === 2 ? !!ageClass && !!weightClass : true;

  function advance() {
    if (step < 3) setStep((s) => s + 1);
    else handleFinish();
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {step === 1 && (
          <>
            <StepHeader
              step={1}
              total={3}
              title="Choose your programme"
              subtitle="Pick the training style that matches your goal."
            />
            <RegimeGrid value={regime} onSelect={setRegime} />
          </>
        )}

        {step === 2 && (
          <>
            <StepHeader
              step={2}
              total={3}
              title="Your body profile"
              subtitle="Used to set the right starting weights."
            />
            <Text className="px-6 pt-4 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Age class
            </Text>
            <PillPicker options={AGE_CLASSES} value={ageClass} onSelect={setAgeClass} />
            <Text className="px-6 pt-6 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Weight class
            </Text>
            <PillPicker options={WEIGHT_CLASSES} value={weightClass} onSelect={setWeightClass} />
            <Text className="px-6 pt-6 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Sex
            </Text>
            <PillPicker options={SEX_OPTIONS} value={sex} onSelect={setSex} />
          </>
        )}

        {step === 3 && (
          <>
            <StepHeader
              step={3}
              total={3}
              title="You're all set!"
              subtitle={`${REGIMES[regime]?.label} · ${ageClass} · ${weightClass}`}
            />
            <View className="px-6 mt-2">
              <Text className="text-sm text-gray-600 leading-6">
                {REGIMES[regime]?.description}
              </Text>
              <Text className="text-sm text-gray-500 mt-4">
                You can change any of these at any time from the Settings tab.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <View className="px-6 pb-4 gap-3">
        <TouchableOpacity
          className={`rounded-xl py-4 items-center ${canAdvance ? "bg-indigo-600" : "bg-gray-200"}`}
          onPress={advance}
          disabled={!canAdvance || saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text className={`font-semibold text-base ${canAdvance ? "text-white" : "text-gray-400"}`}>
              {step < 3 ? "Continue" : "Start training"}
            </Text>
          )}
        </TouchableOpacity>

        {step > 1 && (
          <TouchableOpacity onPress={() => setStep((s) => s - 1)} activeOpacity={0.7}>
            <Text className="text-center text-sm text-gray-500">Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
