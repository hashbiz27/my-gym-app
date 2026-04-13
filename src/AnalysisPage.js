import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { ALL_SESSIONS, REGIMES } from "./gymData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const shortFmt = (d) => {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

// Get all unique exercise names across all logged workouts
function getAllExerciseNames(logs) {
  const names = new Set();
  logs.forEach(([, log]) => {
    if (log.exerciseNames) {
      Object.values(log.exerciseNames).forEach(n => names.add(n));
    } else if (log.sessionId && log.regime) {
      const session = ALL_SESSIONS[log.regime]?.[log.sessionId];
      session?.exercises.forEach(ex => names.add(ex.name));
    }
  });
  return [...names].sort();
}

// For a given exercise name, get { date, maxWeight, totalVolume, avgReps } per session
function getExerciseHistory(logs, exName) {
  const points = [];
  logs.forEach(([, log]) => {
    if (!log.finishedAt) return;
    // Find the exKey that matches this exercise name
    const matchKey = log.exerciseNames
      ? Object.entries(log.exerciseNames).find(([, n]) => n === exName)?.[0]
      : null;
    if (!matchKey && log.exerciseNames) return;

    const setsToSearch = matchKey
      ? log.sets?.[matchKey]
      : Object.entries(log.sets || {}).find(([k]) => {
          const session = ALL_SESSIONS[log.regime]?.[log.sessionId];
          if (!session) return false;
          const idx = parseInt(k.split("-")[1]);
          return session.exercises[idx]?.name === exName;
        })?.[1];

    if (!setsToSearch) return;
    const doneSets = setsToSearch.filter(s => s.done && s.weight && s.reps);
    if (!doneSets.length) return;

    const maxWeight = Math.max(...doneSets.map(s => parseFloat(s.weight) || 0));
    const totalVol = doneSets.reduce((sum, s) => sum + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0);
    const avgReps = Math.round(doneSets.reduce((sum, s) => sum + (parseInt(s.reps) || 0), 0) / doneSets.length);

    points.push({ date: log.date, maxWeight, totalVolume: Math.round(totalVol), avgReps, doneSets: doneSets.length });
  });
  return points.sort((a, b) => a.date.localeCompare(b.date));
}

// Volume per session (total kg moved, all exercises)
function getVolumeHistory(logs) {
  return logs
    .filter(([, l]) => l.finishedAt)
    .map(([, log]) => {
      const v = Math.round(
        Object.values(log.sets || {}).flat()
          .filter(s => s.done && s.weight && s.reps)
          .reduce((sum, s) => sum + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0)
      );
      const regimeCfg = REGIMES[log.regime];
      return { date: log.date, volume: v, regime: regimeCfg?.label || log.regime };
    })
    .filter(d => d.volume > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Personal bests: { exerciseName: { weight, date, reps } }
function getPersonalBests(logs) {
  const bests = {};
  logs.forEach(([, log]) => {
    if (!log.finishedAt) return;
    const exNames = log.exerciseNames || {};
    Object.entries(log.sets || {}).forEach(([exKey, sets]) => {
      const name = exNames[exKey] || (() => {
        const session = ALL_SESSIONS[log.regime]?.[log.sessionId];
        const idx = parseInt(exKey.split("-")[1]);
        return session?.exercises[idx]?.name;
      })();
      if (!name) return;
      sets.filter(s => s.done && s.weight && s.reps).forEach(s => {
        const w = parseFloat(s.weight) || 0;
        if (!bests[name] || w > bests[name].weight) {
          bests[name] = { weight: w, reps: parseInt(s.reps) || 0, date: log.date };
        }
      });
    });
  });
  return Object.entries(bests).sort((a, b) => b[1].weight - a[1].weight);
}

// Avg reps per set per exercise across all sessions
function getAvgReps(logs) {
  const data = {};
  logs.forEach(([, log]) => {
    if (!log.finishedAt) return;
    const exNames = log.exerciseNames || {};
    Object.entries(log.sets || {}).forEach(([exKey, sets]) => {
      const name = exNames[exKey] || (() => {
        const session = ALL_SESSIONS[log.regime]?.[log.sessionId];
        const idx = parseInt(exKey.split("-")[1]);
        return session?.exercises[idx]?.name;
      })();
      if (!name) return;
      const done = sets.filter(s => s.done && s.reps);
      if (!done.length) return;
      if (!data[name]) data[name] = { total: 0, count: 0 };
      done.forEach(s => { data[name].total += parseInt(s.reps) || 0; data[name].count++; });
    });
  });
  return Object.entries(data)
    .map(([name, d]) => ({ name, avgReps: Math.round(d.total / d.count), sessions: d.count }))
    .sort((a, b) => b.sessions - a.sessions);
}

// Session durations in minutes
function getSessionDurations(logs) {
  return logs
    .filter(([, l]) => l.finishedAt && l.startedAt)
    .map(([, log]) => {
      const mins = Math.round((new Date(log.finishedAt) - new Date(log.startedAt)) / 60000);
      if (mins <= 0 || mins > 300) return null;
      const regimeCfg = REGIMES[log.regime];
      const session = ALL_SESSIONS[log.regime]?.[log.sessionId];
      return { date: log.date, duration: mins, label: session?.label || log.sessionId, regime: regimeCfg?.label || "" };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Calendar heatmap: last 16 weeks of dates
function buildCalendar(logs) {
  const trainedDates = new Set(logs.filter(([, l]) => l.finishedAt).map(([, l]) => l.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weeks = [];
  // Start from 15 weeks ago Monday
  const start = new Date(today);
  start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1) - 15 * 7);
  for (let w = 0; w < 16; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start);
      dt.setDate(start.getDate() + w * 7 + d);
      const str = dt.toISOString().slice(0, 10);
      week.push({ date: str, trained: trainedDates.has(str), future: dt > today });
    }
    weeks.push(week);
  }
  return weeks;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SL = ({ children, style = {} }) => (
  <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", margin: "28px 0 12px", ...style }}>{children}</div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", border: "1px solid #e5e5e5", padding: "16px", marginBottom: 12, ...style }}>{children}</div>
);

const MetricCard = ({ label, value, sub }) => (
  <div style={{ background: "#f8f7f4", border: "1px solid #e5e5e5", padding: "14px 16px", flex: 1, minWidth: 100 }}>
    <div style={{ fontSize: 11, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{sub}</div>}
  </div>
);

const EmptyState = ({ text }) => (
  <div style={{ textAlign: "center", padding: "32px 16px", color: "#bbb", fontSize: 13 }}>{text}</div>
);

const tooltipStyle = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 3,
  fontSize: 12,
  fontFamily: "Georgia, serif",
  padding: "8px 12px",
  color: "#111",
};

// ─── Main Analysis component ──────────────────────────────────────────────────

export default function AnalysisPage({ workoutLog }) {
  const logs = useMemo(() =>
    Object.entries(workoutLog).sort((a, b) => a[1].finishedAt?.localeCompare(b[1].finishedAt)),
    [workoutLog]
  );

  const [selectedExercise, setSelectedExercise] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const allExercises = useMemo(() => getAllExerciseNames(logs), [logs]);
  const exerciseHistory = useMemo(() => selectedExercise ? getExerciseHistory(logs, selectedExercise) : [], [logs, selectedExercise]);
  const volumeHistory = useMemo(() => getVolumeHistory(logs), [logs]);
  const personalBests = useMemo(() => getPersonalBests(logs), [logs]);
  const avgRepsData = useMemo(() => getAvgReps(logs), [logs]);
  const durations = useMemo(() => getSessionDurations(logs), [logs]);
  const calendar = useMemo(() => buildCalendar(logs), [logs]);

  const totalSessions = logs.filter(([, l]) => l.finishedAt).length;
  const totalVolume = volumeHistory.reduce((s, d) => s + d.volume, 0);
  const avgDuration = durations.length ? Math.round(durations.reduce((s, d) => s + d.duration, 0) / durations.length) : 0;
  const streak = (() => {
    const dates = [...new Set(logs.filter(([, l]) => l.finishedAt).map(([, l]) => l.date))].sort().reverse();
    if (!dates.length) return 0;
    let s = 0; let prev = null;
    for (const d of dates) {
      if (!prev) { s = 1; prev = d; continue; }
      const diff = (new Date(prev) - new Date(d)) / 86400000;
      if (diff <= 7) { s++; prev = d; } else break;
    }
    return s;
  })();

  const sections = ["overview", "progression", "volume", "personal bests", "avg reps", "duration"];

  if (logs.length === 0) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 56px" }}>
        <SL>Analysis</SL>
        <Card>
          <EmptyState text="Log at least one workout to see your analysis." />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 56px", fontFamily: "Georgia, serif" }}>

      {/* Section nav */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", margin: "18px 0 4px" }}>
        {sections.map(s => (
          <button key={s} onClick={() => setActiveSection(s)} style={{
            padding: "5px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 1,
            textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer",
            background: activeSection === s ? "#111" : "#fff",
            color: activeSection === s ? "#fff" : "#888",
            border: `1px solid ${activeSection === s ? "#111" : "#ddd"}`, borderRadius: 2,
          }}>{s}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeSection === "overview" && (<>
        <SL>Summary</SL>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <MetricCard label="Sessions" value={totalSessions} sub="total logged" />
          <MetricCard label="Total volume" value={totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : "—"} sub="kg lifted" />
          <MetricCard label="Avg duration" value={avgDuration > 0 ? `${avgDuration}m` : "—"} sub="per session" />
          <MetricCard label="Consistency" value={`${streak}w`} sub="active weeks" />
        </div>

        <SL>Training frequency — last 16 weeks</SL>
        <Card style={{ padding: "16px 12px" }}>
          {/* Day labels */}
          <div style={{ display: "flex", gap: 4, marginBottom: 4, paddingLeft: 2 }}>
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} style={{ width: 14, fontSize: 9, color: "#ccc", textAlign: "center", letterSpacing: 0 }}>{d}</div>
            ))}
          </div>
          {/* Calendar grid — columns = weeks, rows = days */}
          <div style={{ display: "flex", gap: 3 }}>
            {calendar.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={day.trained ? `Trained: ${shortFmt(day.date)}` : day.date}
                    style={{
                      width: 14, height: 14, borderRadius: 2,
                      background: day.future ? "transparent" : day.trained ? "#111" : "#f0f0f0",
                      border: day.future ? "none" : "1px solid #e8e8e8",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <div style={{ width: 12, height: 12, background: "#f0f0f0", borderRadius: 2, border: "1px solid #e8e8e8" }} />
            <span style={{ fontSize: 11, color: "#aaa" }}>rest</span>
            <div style={{ width: 12, height: 12, background: "#111", borderRadius: 2, marginLeft: 8 }} />
            <span style={{ fontSize: 11, color: "#aaa" }}>trained</span>
          </div>
        </Card>
      </>)}

      {/* ── PROGRESSION ── */}
      {activeSection === "progression" && (<>
        <SL>Progressive overload tracker</SL>
        <Card>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Select exercise</label>
            <select
              value={selectedExercise}
              onChange={e => setSelectedExercise(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #e0e0e0", borderRadius: 2, fontSize: 13, fontFamily: "Georgia, serif", background: "#fff", color: "#111" }}
            >
              <option value="">— choose an exercise —</option>
              {allExercises.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {!selectedExercise && <EmptyState text="Pick an exercise to see your weight progression over time." />}

          {selectedExercise && exerciseHistory.length === 0 && (
            <EmptyState text="No completed sets found for this exercise yet." />
          )}

          {selectedExercise && exerciseHistory.length >= 1 && (<>
            {/* Max weight chart */}
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Heaviest set per session (kg)</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={exerciseHistory} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={shortFmt} tick={{ fontSize: 10, fontFamily: "Georgia, serif" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fontFamily: "Georgia, serif" }} tickLine={false} axisLine={false} width={36} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => [`${v}kg`, "Max weight"]}
                  labelFormatter={shortFmt}
                />
                {exerciseHistory.length > 1 && (
                  <ReferenceLine y={Math.max(...exerciseHistory.map(d => d.maxWeight))} stroke="#4caf50" strokeDasharray="4 2" label={{ value: "PB", fill: "#4caf50", fontSize: 10 }} />
                )}
                <Line type="monotone" dataKey="maxWeight" stroke="#111" strokeWidth={2} dot={{ r: 3, fill: "#111" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <MetricCard label="Best weight" value={`${Math.max(...exerciseHistory.map(d => d.maxWeight))}kg`} sub="all time" />
              <MetricCard label="Sessions" value={exerciseHistory.length} sub="with this exercise" />
              <MetricCard label="Latest" value={`${exerciseHistory[exerciseHistory.length - 1]?.maxWeight}kg`} sub={shortFmt(exerciseHistory[exerciseHistory.length - 1]?.date)} />
              {exerciseHistory.length >= 2 && (() => {
                const first = exerciseHistory[0].maxWeight;
                const last = exerciseHistory[exerciseHistory.length - 1].maxWeight;
                const diff = last - first;
                return <MetricCard label="Progress" value={`${diff >= 0 ? "+" : ""}${diff}kg`} sub="first vs latest" />;
              })()}
            </div>
          </>)}
        </Card>
      </>)}

      {/* ── VOLUME ── */}
      {activeSection === "volume" && (<>
        <SL>Volume over time</SL>
        <Card>
          {volumeHistory.length === 0
            ? <EmptyState text="No volume data yet. Log some sets with weights to see this chart." />
            : (<>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Total volume per session (kg × reps)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={volumeHistory} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={shortFmt} tick={{ fontSize: 10, fontFamily: "Georgia, serif" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fontFamily: "Georgia, serif" }} tickLine={false} axisLine={false} width={44} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}t` : v} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => [`${v.toLocaleString()}kg`, "Volume"]}
                    labelFormatter={shortFmt}
                  />
                  <Bar dataKey="volume" fill="#111" radius={[2, 2, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>

              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <MetricCard label="Total volume" value={`${(totalVolume / 1000).toFixed(1)}t`} sub="all sessions" />
                <MetricCard label="Best session" value={`${Math.max(...volumeHistory.map(d => d.volume)).toLocaleString()}kg`} sub="single session" />
                <MetricCard label="Avg/session" value={`${Math.round(totalVolume / volumeHistory.length).toLocaleString()}kg`} sub="mean volume" />
              </div>
            </>)
          }
        </Card>
      </>)}

      {/* ── PERSONAL BESTS ── */}
      {activeSection === "personal bests" && (<>
        <SL>Personal bests — heaviest logged set</SL>
        {personalBests.length === 0
          ? <Card><EmptyState text="No personal bests yet." /></Card>
          : (<>
            <Card style={{ padding: 0 }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0", display: "grid", gridTemplateColumns: "1fr 60px 60px 80px", gap: 8 }}>
                <span style={{ fontSize: 10, color: "#aaa", letterSpacing: 1, textTransform: "uppercase" }}>Exercise</span>
                <span style={{ fontSize: 10, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", textAlign: "right" }}>Weight</span>
                <span style={{ fontSize: 10, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", textAlign: "right" }}>Reps</span>
                <span style={{ fontSize: 10, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", textAlign: "right" }}>Date</span>
              </div>
              {personalBests.map(([name, pb], i) => (
                <div key={name} style={{ padding: "10px 14px", borderBottom: i < personalBests.length - 1 ? "1px solid #f9f9f9" : "none", display: "grid", gridTemplateColumns: "1fr 60px 60px 80px", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 400, color: "#111" }}>
                    {i === 0 && <span style={{ fontSize: 10, background: "#fff8e1", color: "#b45309", padding: "1px 5px", borderRadius: 2, fontWeight: 700, marginRight: 6 }}>PB</span>}
                    {name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111", textAlign: "right" }}>{pb.weight}kg</span>
                  <span style={{ fontSize: 13, color: "#555", textAlign: "right" }}>{pb.reps}</span>
                  <span style={{ fontSize: 11, color: "#aaa", textAlign: "right" }}>{shortFmt(pb.date)}</span>
                </div>
              ))}
            </Card>
          </>)
        }
      </>)}

      {/* ── AVG REPS ── */}
      {activeSection === "avg reps" && (<>
        <SL>Average reps per set — by exercise</SL>
        <Card>
          {avgRepsData.length === 0
            ? <EmptyState text="No rep data yet." />
            : (<>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Average reps per set across all logged sessions</div>
              <ResponsiveContainer width="100%" height={Math.max(200, avgRepsData.slice(0, 12).length * 32)}>
                <BarChart
                  data={avgRepsData.slice(0, 12)}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fontFamily: "Georgia, serif" }} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={160}
                    tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: "#555" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={n => n.length > 22 ? n.slice(0, 22) + "…" : n}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v, _, props) => [`${v} reps avg · ${props.payload.sessions} sessions`, ""]}
                  />
                  <Bar dataKey="avgReps" fill="#111" radius={[0, 2, 2, 0]} maxBarSize={20} label={{ position: "right", fontSize: 11, fill: "#888", fontFamily: "Georgia, serif" }} />
                </BarChart>
              </ResponsiveContainer>
            </>)
          }
        </Card>
      </>)}

      {/* ── DURATION ── */}
      {activeSection === "duration" && (<>
        <SL>Session duration over time</SL>
        <Card>
          {durations.length === 0
            ? <EmptyState text="No duration data yet. Finish a workout using the Finish button to record duration." />
            : (<>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Minutes per session</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={durations} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={shortFmt} tick={{ fontSize: 10, fontFamily: "Georgia, serif" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fontFamily: "Georgia, serif" }} tickLine={false} axisLine={false} width={36} tickFormatter={v => `${v}m`} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v, _, props) => [`${v} min`, props.payload.label]}
                    labelFormatter={shortFmt}
                  />
                  {durations.length > 1 && (
                    <ReferenceLine y={avgDuration} stroke="#aaa" strokeDasharray="4 2" label={{ value: `avg ${avgDuration}m`, fill: "#aaa", fontSize: 10 }} />
                  )}
                  <Line type="monotone" dataKey="duration" stroke="#111" strokeWidth={2} dot={{ r: 3, fill: "#111" }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>

              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <MetricCard label="Avg duration" value={`${avgDuration}m`} sub="per session" />
                <MetricCard label="Longest" value={`${Math.max(...durations.map(d => d.duration))}m`} sub="single session" />
                <MetricCard label="Shortest" value={`${Math.min(...durations.map(d => d.duration))}m`} sub="single session" />
              </div>
            </>)
          }
        </Card>
      </>)}

    </div>
  );
}