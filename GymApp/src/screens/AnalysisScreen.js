import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useGymData } from "../hooks/useGymData";

// Chart is full-width minus 32px horizontal page padding, minus internal card padding
const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - 32 - 32; // page margins + card padding

const INDIGO = "#4f46e5";
const GRAY_400 = "#9ca3af";
const GRID_COLOR = "#f3f4f6";

const SECTIONS = ["Overview", "Lifting", "Volume", "PRs", "Duration"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shortDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function localDateStr(dt) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getAllExerciseNames(sessions) {
  const names = new Set();
  sessions.forEach((s) => {
    s.session_logs?.forEach((l) => {
      if (l.exercise_name) names.add(l.exercise_name);
    });
  });
  return [...names].sort();
}

function getExerciseHistory(sessions, exName) {
  return sessions
    .filter((s) => s.finished_at)
    .map((s) => {
      const logs = (s.session_logs ?? []).filter(
        (l) => l.exercise_name === exName && l.weight != null && l.reps != null
      );
      if (!logs.length) return null;
      const maxWeight = Math.max(...logs.map((l) => parseFloat(l.weight) || 0));
      const bestOrm = Math.max(
        ...logs.map((l) => {
          const w = parseFloat(l.weight) || 0;
          const r = parseInt(l.reps) || 0;
          return w && r ? Math.round(w * (1 + r / 30)) : 0;
        })
      );
      return { date: s.date, maxWeight, bestOrm };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getVolumeHistory(sessions) {
  return sessions
    .filter((s) => s.finished_at)
    .map((s) => {
      const v = Math.round(
        (s.session_logs ?? [])
          .filter((l) => l.weight != null && l.reps != null)
          .reduce(
            (sum, l) =>
              sum + (parseFloat(l.weight) || 0) * (parseInt(l.reps) || 0),
            0
          )
      );
      return { date: s.date, volume: v };
    })
    .filter((d) => d.volume > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getPersonalBests(sessions) {
  const bests = {};
  sessions
    .filter((s) => s.finished_at)
    .forEach((s) => {
      (s.session_logs ?? [])
        .filter((l) => l.weight != null && l.reps != null)
        .forEach((l) => {
          const name = l.exercise_name;
          const w = parseFloat(l.weight) || 0;
          const r = parseInt(l.reps) || 0;
          const orm = w && r ? Math.round(w * (1 + r / 30)) : 0;
          if (!bests[name] || w > bests[name].weight) {
            bests[name] = { weight: w, reps: r, date: s.date, orm };
          }
        });
    });
  return Object.entries(bests).sort((a, b) => b[1].weight - a[1].weight);
}

function getSessionDurations(sessions) {
  return sessions
    .filter((s) => s.finished_at && s.started_at)
    .map((s) => {
      const mins = Math.round(
        (new Date(s.finished_at) - new Date(s.started_at)) / 60000
      );
      if (mins <= 0 || mins > 300) return null;
      return { date: s.date, duration: mins };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function buildCalendar(sessions) {
  const trainedDates = new Set(
    sessions.filter((s) => s.finished_at).map((s) => s.date)
  );
  const now = new Date();
  const todayStr = localDateStr(now);
  const todayDay = now.getDay();
  const daysToMonday = todayDay === 0 ? 6 : todayDay - 1;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - daysToMonday);
  thisMonday.setHours(0, 0, 0, 0);
  const start = new Date(thisMonday);
  start.setDate(thisMonday.getDate() - 15 * 7);
  const weeks = [];
  for (let w = 0; w < 16; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start);
      dt.setDate(start.getDate() + w * 7 + d);
      dt.setHours(0, 0, 0, 0);
      const str = localDateStr(dt);
      week.push({ date: str, trained: trainedDates.has(str), future: str > todayStr });
    }
    weeks.push(week);
  }
  return weeks;
}

// ─── Shared UI pieces ─────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, highlight = false }) {
  return (
    <View className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-3">
      <Text className="text-xs text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </Text>
      <Text
        className={`text-xl font-bold ${highlight ? "text-indigo-600" : "text-gray-900"}`}
      >
        {value}
      </Text>
      {sub ? <Text className="text-xs text-gray-400 mt-0.5">{sub}</Text> : null}
    </View>
  );
}

function Card({ children }) {
  return (
    <View className="mx-4 mb-4 rounded-xl border border-gray-200 bg-white overflow-hidden p-4">
      {children}
    </View>
  );
}

function SectionLabel({ children }) {
  return (
    <Text className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
      {children}
    </Text>
  );
}

function EmptyChart({ text }) {
  return (
    <Text className="text-center text-sm text-gray-400 py-8 italic">{text}</Text>
  );
}

// Shared axis styles for Victory charts
const depAxisStyle = {
  axis: { stroke: "none" },
  grid: { stroke: GRID_COLOR, strokeDasharray: "4 3" },
  tickLabels: { fontSize: 9, fill: GRAY_400, padding: 4, fontFamily: "System" },
};
const indepAxisStyle = {
  axis: { stroke: "none" },
  grid: { stroke: "none" },
  tickLabels: { fontSize: 9, fill: GRAY_400, padding: 4, fontFamily: "System" },
};

// ─── Section: Overview ────────────────────────────────────────────────────────

function OverviewSection({ totalSessions, totalVolume, avgDuration, streak, calendar }) {
  return (
    <View>
      <SectionLabel>Summary</SectionLabel>
      <View className="flex-row mx-4 gap-3 mb-3">
        <MetricCard
          label="Sessions"
          value={String(totalSessions)}
          sub="total logged"
        />
        <MetricCard
          label="Total volume"
          value={totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : "—"}
          sub="kg lifted"
        />
      </View>
      <View className="flex-row mx-4 gap-3 mb-4">
        <MetricCard
          label="Avg duration"
          value={avgDuration > 0 ? `${avgDuration}m` : "—"}
          sub="per session"
        />
        <MetricCard label="Consistency" value={`${streak}w`} sub="active weeks" />
      </View>

      <SectionLabel>Frequency — last 16 weeks</SectionLabel>
      <Card>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          {/* Day labels */}
          <View style={{ marginRight: 4 }}>
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <View
                key={i}
                style={{ width: 10, height: 14, marginBottom: 3, justifyContent: "center" }}
              >
                <Text style={{ fontSize: 8, color: GRAY_400 }}>{day}</Text>
              </View>
            ))}
          </View>
          {/* Week columns */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 3 }}>
              {calendar.map((week, wIdx) => (
                <View key={wIdx} style={{ flexDirection: "column", gap: 3 }}>
                  {week.map((day, dIdx) => (
                    <View
                      key={dIdx}
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 2,
                        backgroundColor: day.future
                          ? "transparent"
                          : day.trained
                          ? INDIGO
                          : "#f0f0f0",
                      }}
                    />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        <View className="flex-row items-center mt-3 gap-x-2">
          <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: "#f0f0f0" }} />
          <Text className="text-xs text-gray-400">rest</Text>
          <View
            style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: INDIGO, marginLeft: 8 }}
          />
          <Text className="text-xs text-gray-400">trained</Text>
        </View>
      </Card>
    </View>
  );
}

// ─── Section: Lifting (progression) ──────────────────────────────────────────

function LiftingSection({ sessions, allExercises }) {
  const [selected, setSelected] = useState(allExercises[0] ?? "");
  const [showOrm, setShowOrm] = useState(false);

  const history = useMemo(
    () => (selected ? getExerciseHistory(sessions, selected) : []),
    [sessions, selected]
  );

  const chartData = history.map((d) => ({
    x: d.date,
    y: showOrm ? d.bestOrm : d.maxWeight,
  }));

  const bestWeight = history.length
    ? Math.max(...history.map((d) => d.maxWeight))
    : 0;
  const bestOrm = history.length ? Math.max(...history.map((d) => d.bestOrm)) : 0;
  const progress =
    history.length >= 2
      ? history[history.length - 1].maxWeight - history[0].maxWeight
      : null;

  if (allExercises.length === 0) {
    return (
      <View>
        <SectionLabel>Progressive overload tracker</SectionLabel>
        <Card>
          <EmptyChart text="Log at least one workout to track progression." />
        </Card>
      </View>
    );
  }

  return (
    <View>
      <SectionLabel>Progressive overload tracker</SectionLabel>

      {/* Exercise picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}
      >
        {allExercises.map((name) => {
          const active = name === selected;
          return (
            <TouchableOpacity
              key={name}
              onPress={() => setSelected(name)}
              className={`px-3 py-1.5 rounded-full border ${
                active ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-200"
              }`}
              activeOpacity={0.75}
            >
              <Text
                className={`text-xs font-medium ${active ? "text-white" : "text-gray-600"}`}
              >
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Card>
        {history.length === 0 ? (
          <EmptyChart text="No completed sets found for this exercise." />
        ) : (
          <>
            {/* Max weight / Est. 1RM toggle */}
            <View className="flex-row gap-x-2 mb-3">
              {[
                { label: "Max weight", val: false },
                { label: "Est. 1RM", val: true },
              ].map(({ label, val }) => {
                const active = showOrm === val;
                return (
                  <TouchableOpacity
                    key={label}
                    onPress={() => setShowOrm(val)}
                    className={`px-3 py-1.5 rounded-full border ${
                      active ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200"
                    }`}
                    activeOpacity={0.75}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        active ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-xs text-gray-400 mb-1">
              {showOrm
                ? "Estimated 1RM per session (Epley formula)"
                : "Heaviest set per session (kg)"}
            </Text>

            <VictoryChart
              width={CHART_WIDTH}
              height={200}
              theme={VictoryTheme.material}
              padding={{ top: 16, bottom: 36, left: 44, right: 16 }}
            >
              <VictoryAxis
                tickFormat={(t) => shortDate(t)}
                tickCount={Math.min(chartData.length, 4)}
                style={indepAxisStyle}
              />
              <VictoryAxis dependentAxis tickFormat={(v) => `${v}kg`} style={depAxisStyle} />
              <VictoryLine
                data={chartData}
                style={{ data: { stroke: INDIGO, strokeWidth: 2 } }}
              />
            </VictoryChart>

            <View className="flex-row gap-x-3 mt-2 flex-wrap gap-y-3">
              <MetricCard label="Best weight" value={`${bestWeight}kg`} sub="heaviest set" />
              <MetricCard
                label="Est. 1RM"
                value={`${bestOrm}kg`}
                sub="Epley formula"
                highlight
              />
              {progress !== null && (
                <MetricCard
                  label="Progress"
                  value={`${progress >= 0 ? "+" : ""}${progress}kg`}
                  sub="first vs latest"
                />
              )}
            </View>
          </>
        )}
      </Card>
    </View>
  );
}

// ─── Section: Volume ──────────────────────────────────────────────────────────

function VolumeSection({ volumeHistory, totalVolume }) {
  const chartData = volumeHistory.map((d) => ({ x: d.date, y: d.volume }));
  const barWidth = Math.max(
    6,
    Math.min(20, Math.round((CHART_WIDTH - 60) / Math.max(chartData.length, 1) - 4))
  );

  return (
    <View>
      <SectionLabel>Volume over time</SectionLabel>
      <Card>
        {volumeHistory.length === 0 ? (
          <EmptyChart text="No volume data yet." />
        ) : (
          <>
            <Text className="text-xs text-gray-400 mb-1">
              Total volume per session (kg × reps)
            </Text>
            <VictoryChart
              width={CHART_WIDTH}
              height={200}
              theme={VictoryTheme.material}
              padding={{ top: 16, bottom: 36, left: 52, right: 16 }}
            >
              <VictoryAxis
                tickFormat={(t) => shortDate(t)}
                tickCount={Math.min(chartData.length, 4)}
                style={indepAxisStyle}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}t` : String(v)
                }
                style={depAxisStyle}
              />
              <VictoryBar
                data={chartData}
                style={{ data: { fill: INDIGO } }}
                barWidth={barWidth}
                cornerRadius={{ top: 2 }}
              />
            </VictoryChart>
            <View className="flex-row gap-x-3 mt-2">
              <MetricCard
                label="Total"
                value={`${(totalVolume / 1000).toFixed(1)}t`}
                sub="all sessions"
              />
              <MetricCard
                label="Best session"
                value={`${Math.max(...volumeHistory.map((d) => d.volume)).toLocaleString()}kg`}
                sub="single session"
              />
              <MetricCard
                label="Avg/session"
                value={`${Math.round(totalVolume / volumeHistory.length).toLocaleString()}kg`}
                sub="mean volume"
              />
            </View>
          </>
        )}
      </Card>
    </View>
  );
}

// ─── Section: Personal Bests ──────────────────────────────────────────────────

function PRsSection({ personalBests }) {
  return (
    <View>
      <SectionLabel>Personal bests — heaviest logged set</SectionLabel>
      {personalBests.length === 0 ? (
        <Card>
          <EmptyChart text="No personal bests yet." />
        </Card>
      ) : (
        <View className="mx-4 mb-4 rounded-xl border border-gray-200 bg-white overflow-hidden">
          {personalBests.map(([name, pb], i) => (
            <View
              key={name}
              className={`px-4 py-3.5 flex-row items-center ${
                i < personalBests.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <View className="flex-1 mr-3">
                <View className="flex-row items-center gap-x-2 mb-0.5">
                  {i === 0 && (
                    <View className="bg-amber-100 rounded px-1.5 py-0.5">
                      <Text className="text-amber-700 text-xs font-bold">PB</Text>
                    </View>
                  )}
                  <Text
                    className="text-sm font-semibold text-gray-800 flex-shrink"
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400">{shortDate(pb.date)}</Text>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold text-gray-900">
                  {pb.weight}kg × {pb.reps}
                </Text>
                {pb.orm > 0 && (
                  <Text className="text-xs text-indigo-600 font-semibold">
                    {pb.orm}kg 1RM
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Section: Duration ────────────────────────────────────────────────────────

function DurationSection({ durations, avgDuration }) {
  const chartData = durations.map((d) => ({ x: d.date, y: d.duration }));

  return (
    <View>
      <SectionLabel>Session duration over time</SectionLabel>
      <Card>
        {durations.length === 0 ? (
          <EmptyChart text="No duration data yet. Finish a workout to record duration." />
        ) : (
          <>
            <Text className="text-xs text-gray-400 mb-1">Minutes per session</Text>
            <VictoryChart
              width={CHART_WIDTH}
              height={200}
              theme={VictoryTheme.material}
              padding={{ top: 16, bottom: 36, left: 44, right: 16 }}
            >
              <VictoryAxis
                tickFormat={(t) => shortDate(t)}
                tickCount={Math.min(chartData.length, 4)}
                style={indepAxisStyle}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(v) => `${v}m`}
                style={depAxisStyle}
              />
              <VictoryLine
                data={chartData}
                style={{ data: { stroke: INDIGO, strokeWidth: 2 } }}
              />
            </VictoryChart>
            <View className="flex-row gap-x-3 mt-2">
              <MetricCard
                label="Avg duration"
                value={`${avgDuration}m`}
                sub="per session"
              />
              <MetricCard
                label="Longest"
                value={`${Math.max(...durations.map((d) => d.duration))}m`}
                sub="single session"
              />
              <MetricCard
                label="Shortest"
                value={`${Math.min(...durations.map((d) => d.duration))}m`}
                sub="single session"
              />
            </View>
          </>
        )}
      </Card>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AnalysisScreen() {
  const { fetchSessionHistory, sessionHistory, loading } = useGymData();
  const [activeSection, setActiveSection] = useState("Overview");

  useFocusEffect(
    useCallback(() => {
      fetchSessionHistory(100);
    }, [fetchSessionHistory])
  );

  const sessions = sessionHistory;

  const allExercises = useMemo(() => getAllExerciseNames(sessions), [sessions]);
  const volumeHistory = useMemo(() => getVolumeHistory(sessions), [sessions]);
  const personalBests = useMemo(() => getPersonalBests(sessions), [sessions]);
  const durations = useMemo(() => getSessionDurations(sessions), [sessions]);
  const calendar = useMemo(() => buildCalendar(sessions), [sessions]);

  const totalSessions = sessions.filter((s) => s.finished_at).length;
  const totalVolume = volumeHistory.reduce((s, d) => s + d.volume, 0);
  const avgDuration = durations.length
    ? Math.round(durations.reduce((s, d) => s + d.duration, 0) / durations.length)
    : 0;
  const streak = (() => {
    const dates = [
      ...new Set(sessions.filter((s) => s.finished_at).map((s) => s.date)),
    ]
      .sort()
      .reverse();
    if (!dates.length) return 0;
    let count = 0;
    let prev = null;
    for (const d of dates) {
      if (!prev) { count = 1; prev = d; continue; }
      if ((new Date(prev) - new Date(d)) / 86400000 <= 7) { count++; prev = d; } else break;
    }
    return count;
  })();

  if (loading && !sessions.length) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={["top"]}>
        <ActivityIndicator size="large" color={INDIGO} />
      </SafeAreaView>
    );
  }

  if (!loading && !sessions.length) {
    return (
      <SafeAreaView
        className="flex-1 bg-white items-center justify-center px-8"
        edges={["top"]}
      >
        <Ionicons name="stats-chart-outline" size={48} color="#d1d5db" />
        <Text className="text-lg font-bold text-gray-400 mt-4 text-center">
          No data yet
        </Text>
        <Text className="text-sm text-gray-400 mt-2 text-center leading-5">
          Complete your first workout to see analysis here.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Section tab bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-100 grow-0 shrink-0"
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}
      >
        {SECTIONS.map((s) => {
          const active = s === activeSection;
          return (
            <TouchableOpacity
              key={s}
              onPress={() => setActiveSection(s)}
              className={`px-3 py-1.5 rounded-full border ${
                active ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-200"
              }`}
              activeOpacity={0.75}
            >
              <Text
                className={`text-xs font-semibold uppercase tracking-wider ${
                  active ? "text-white" : "text-gray-500"
                }`}
              >
                {s}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingTop: 4, paddingBottom: 40 }}>
        {activeSection === "Overview" && (
          <OverviewSection
            totalSessions={totalSessions}
            totalVolume={totalVolume}
            avgDuration={avgDuration}
            streak={streak}
            calendar={calendar}
          />
        )}
        {activeSection === "Lifting" && (
          <LiftingSection sessions={sessions} allExercises={allExercises} />
        )}
        {activeSection === "Volume" && (
          <VolumeSection volumeHistory={volumeHistory} totalVolume={totalVolume} />
        )}
        {activeSection === "PRs" && <PRsSection personalBests={personalBests} />}
        {activeSection === "Duration" && (
          <DurationSection durations={durations} avgDuration={avgDuration} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
