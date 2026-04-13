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

const localDateStr = (dt) => {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function getAllExerciseNames(logs) {
  const names = new Set();
  logs.forEach(([, log]) => {
    if (log.exerciseNames) {
      Object.values(log.exerciseNames).forEach(n => names.add(n));
    } else if (log.sessionId && log.regime) {
      ALL_SESSIONS[log.regime]?.[log.sessionId]?.exercises.forEach(ex => names.add(ex.name));
    }
  });
  return [...names].sort();
}

function getExName(log, exKey) {
  if (log.exerciseNames?.[exKey]) return log.exerciseNames[exKey];
  const session = ALL_SESSIONS[log.regime]?.[log.sessionId];
  if (!session) return null;
  const parts = exKey.split("-");
  return session.exercises[parseInt(parts[parts.length - 1])]?.name || null;
}

function getExerciseHistory(logs, exName) {
  const points = [];
  logs.forEach(([, log]) => {
    if (!log.finishedAt) return;
    const matchKey = Object.entries(log.sets || {}).find(([k]) => getExName(log, k) === exName)?.[0];
    if (!matchKey) return;
    const doneSets = (log.sets[matchKey] || []).filter(s => s.done && s.weight && s.reps);
    if (!doneSets.length) return;
    const maxWeight = Math.max(...doneSets.map(s => parseFloat(s.weight) || 0));
    const bestOrm = Math.max(...doneSets.map(s => {
      const w = parseFloat(s.weight) || 0;
      const r = parseInt(s.reps) || 0;
      return w && r ? Math.round(w * (1 + r / 30)) : 0;
    }));
    const avgReps = Math.round(doneSets.reduce((sum, s) => sum + (parseInt(s.reps) || 0), 0) / doneSets.length);
    points.push({ date: log.date, maxWeight, bestOrm, avgReps });
  });
  return points.sort((a, b) => a.date.localeCompare(b.date));
}

function getVolumeHistory(logs) {
  return logs
    .filter(([, l]) => l.finishedAt)
    .map(([, log]) => {
      const v = Math.round(
        Object.values(log.sets || {}).flat()
          .filter(s => s.done && s.weight && s.reps)
          .reduce((sum, s) => sum + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0)
      );
      return { date: log.date, volume: v, regime: REGIMES[log.regime]?.label || log.regime };
    })
    .filter(d => d.volume > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getPersonalBests(logs) {
  const bests = {};
  logs.forEach(([, log]) => {
    if (!log.finishedAt) return;
    Object.entries(log.sets || {}).forEach(([exKey, sets]) => {
      const name = getExName(log, exKey);
      if (!name) return;
      sets.filter(s => s.done && s.weight && s.reps).forEach(s => {
        const w = parseFloat(s.weight) || 0;
        const r = parseInt(s.reps) || 0;
        const orm = w && r ? Math.round(w * (1 + r / 30)) : 0;
        if (!bests[name] || w > bests[name].weight) {
          bests[name] = { weight: w, reps: r, date: log.date, orm };
        }
      });
    });
  });
  return Object.entries(bests).sort((a, b) => b[1].weight - a[1].weight);
}

function getAvgReps(logs) {
  const data = {};
  logs.forEach(([, log]) => {
    if (!log.finishedAt) return;
    Object.entries(log.sets || {}).forEach(([exKey, sets]) => {
      const name = getExName(log, exKey);
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

function getSessionDurations(logs) {
  return logs
    .filter(([, l]) => l.finishedAt && l.startedAt)
    .map(([, log]) => {
      const mins = Math.round((new Date(log.finishedAt) - new Date(log.startedAt)) / 60000);
      if (mins <= 0 || mins > 300) return null;
      return { date: log.date, duration: mins, label: ALL_SESSIONS[log.regime]?.[log.sessionId]?.label || log.sessionId };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function buildCalendar(logs) {
  const trainedDates = new Set(logs.filter(([, l]) => l.finishedAt).map(([, l]) => l.date));
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AnalysisPage({ workoutLog, bwLog = {}, dark = false, T = {} }) {
  const C = {
    bg:          T.bg          || "#f8f7f4",
    card:        T.card        || "#fff",
    border:      T.cardBorder  || "#e5e5e5",
    text:        T.text        || "#1a1a1a",
    textSec:     T.textSec     || "#555",
    muted:       T.textMuted   || "#aaa",
    altBg:       T.altBg       || "#f8f7f4",
    altBorder:   T.altBorder   || "#efefef",
    input:       T.input       || "#fff",
    inputBorder: T.inputBorder || "#e0e0e0",
  };

  const logs = useMemo(() =>
    Object.entries(workoutLog).sort((a, b) => a[1].finishedAt?.localeCompare(b[1].finishedAt)),
    [workoutLog]
  );

  const [selectedExercise, setSelectedExercise] = useState("");
  const [showOrm, setShowOrm] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const allExercises    = useMemo(() => getAllExerciseNames(logs), [logs]);
  const exerciseHistory = useMemo(() => selectedExercise ? getExerciseHistory(logs, selectedExercise) : [], [logs, selectedExercise]);
  const volumeHistory   = useMemo(() => getVolumeHistory(logs), [logs]);
  const personalBests   = useMemo(() => getPersonalBests(logs), [logs]);
  const avgRepsData     = useMemo(() => getAvgReps(logs), [logs]);
  const durations       = useMemo(() => getSessionDurations(logs), [logs]);
  const calendar        = useMemo(() => buildCalendar(logs), [logs]);

  const bwEntries   = useMemo(() => Object.entries(bwLog).sort((a, b) => a[0].localeCompare(b[0])), [bwLog]);
  const bwChartData = bwEntries.map(([date, weight]) => ({ date, weight }));

  const totalSessions = logs.filter(([, l]) => l.finishedAt).length;
  const totalVolume   = volumeHistory.reduce((s, d) => s + d.volume, 0);
  const avgDuration   = durations.length ? Math.round(durations.reduce((s, d) => s + d.duration, 0) / durations.length) : 0;
  const streak = (() => {
    const dates = [...new Set(logs.filter(([, l]) => l.finishedAt).map(([, l]) => l.date))].sort().reverse();
    if (!dates.length) return 0;
    let s = 0; let prev = null;
    for (const d of dates) {
      if (!prev) { s = 1; prev = d; continue; }
      if ((new Date(prev) - new Date(d)) / 86400000 <= 7) { s++; prev = d; } else break;
    }
    return s;
  })();

  const sections = ["overview", "progression", "volume", "personal bests", "avg reps", "duration"];

  // ── Themed sub-components ──
  const SL = ({ children, style = {} }) => (
    <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.muted, margin: "24px 0 10px", ...style }}>{children}</div>
  );
  const Cd = ({ children, style = {} }) => (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "16px", marginBottom: 12, ...style }}>{children}</div>
  );
  const MC = ({ label, value, sub, color }) => (
    <div style={{ background: C.altBg, border: `1px solid ${C.border}`, padding: "14px 16px", flex: 1, minWidth: 100 }}>
      <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || C.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
  const Empty = ({ text }) => (
    <div style={{ textAlign: "center", padding: "32px 16px", color: C.muted, fontSize: 13 }}>{text}</div>
  );
  const tt = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 3, fontSize: 12, fontFamily: "Georgia, serif", padding: "8px 12px", color: C.text };

  if (logs.length === 0) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 56px" }}>
        <SL>Analysis</SL>
        <Cd><Empty text="Log at least one workout to see your analysis." /></Cd>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 56px", fontFamily: "Georgia, serif", color: C.text }}>

      {/* Section nav */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", margin: "18px 0 4px" }}>
        {sections.map(s => (
          <button key={s} onClick={() => setActiveSection(s)} style={{
            padding: "5px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 1,
            textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer",
            background: activeSection === s ? C.text : C.card,
            color: activeSection === s ? C.bg : C.muted,
            border: `1px solid ${activeSection === s ? C.text : C.border}`, borderRadius: 2,
          }}>{s}</button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────────── */}
      {activeSection === "overview" && (
        <div>
          <SL>Summary</SL>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <MC label="Sessions" value={totalSessions} sub="total logged" />
            <MC label="Total volume" value={totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : "—"} sub="kg lifted" />
            <MC label="Avg duration" value={avgDuration > 0 ? `${avgDuration}m` : "—"} sub="per session" />
            <MC label="Consistency" value={`${streak}w`} sub="active weeks" />
          </div>

          <SL>Training frequency — last 16 weeks</SL>
          <Cd style={{ padding: "16px 12px" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 1 }}>
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div key={i} style={{ width: 10, height: 14, fontSize: 9, color: C.muted, display: "flex", alignItems: "center" }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 14px)", gridTemplateRows: "repeat(7, 14px)", gridAutoFlow: "column", gap: 3 }}>
                {calendar.flat().map((day, idx) => (
                  <div key={idx} title={day.trained ? `Trained: ${shortFmt(day.date)}` : day.date} style={{
                    width: 14, height: 14, borderRadius: 2,
                    background: day.future ? "transparent" : day.trained ? C.text : (dark ? "#2a2a2a" : "#f0f0f0"),
                    border: day.future ? "none" : `1px solid ${dark ? "#333" : "#e8e8e8"}`,
                  }} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
              <div style={{ width: 12, height: 12, background: dark ? "#2a2a2a" : "#f0f0f0", borderRadius: 2, border: `1px solid ${dark ? "#333" : "#e8e8e8"}` }} />
              <span style={{ fontSize: 11, color: C.muted }}>rest</span>
              <div style={{ width: 12, height: 12, background: C.text, borderRadius: 2, marginLeft: 8 }} />
              <span style={{ fontSize: 11, color: C.muted }}>trained</span>
            </div>
          </Cd>

          {/* Bodyweight in overview */}
          {bwEntries.length > 1 && (
            <>
              <SL>Bodyweight trend</SL>
              <Cd>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>kg — {bwEntries.length} entries</div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={bwChartData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#2a2a2a" : "#f0f0f0"} />
                    <XAxis dataKey="date" tickFormatter={shortFmt} tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: C.muted }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: C.muted }} tickLine={false} axisLine={false} width={36} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={tt} formatter={v => [`${v}kg`, "Weight"]} labelFormatter={shortFmt} />
                    <Line type="monotone" dataKey="weight" stroke={C.text} strokeWidth={2} dot={{ r: 3, fill: C.text }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Cd>
            </>
          )}
        </div>
      )}

      {/* ── PROGRESSION ──────────────────────────────────────────────────────── */}
      {activeSection === "progression" && (
        <div>
          <SL>Progressive overload tracker</SL>
          <Cd>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Select exercise</label>
              <select value={selectedExercise} onChange={e => setSelectedExercise(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${C.inputBorder}`, borderRadius: 2, fontSize: 13, fontFamily: "Georgia, serif", background: C.input, color: C.text }}>
                <option value="">— choose an exercise —</option>
                {allExercises.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {selectedExercise && exerciseHistory.length > 0 && (
              <div style={{ marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: C.muted }}>Show:</span>
                <button onClick={() => setShowOrm(false)} style={{ padding: "3px 10px", fontSize: 11, fontWeight: 700, background: !showOrm ? C.text : C.card, color: !showOrm ? C.bg : C.muted, border: `1px solid ${C.border}`, borderRadius: 2, cursor: "pointer" }}>Max weight</button>
                <button onClick={() => setShowOrm(true)} style={{ padding: "3px 10px", fontSize: 11, fontWeight: 700, background: showOrm ? C.text : C.card, color: showOrm ? C.bg : C.muted, border: `1px solid ${C.border}`, borderRadius: 2, cursor: "pointer" }}>Est. 1RM</button>
              </div>
            )}

            {!selectedExercise && <Empty text="Pick an exercise to see your weight progression over time." />}
            {selectedExercise && exerciseHistory.length === 0 && <Empty text="No completed sets found for this exercise yet." />}

            {selectedExercise && exerciseHistory.length >= 1 && (
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>
                  {showOrm ? "Estimated 1RM per session (Epley formula)" : "Heaviest set per session (kg)"}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={exerciseHistory} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#2a2a2a" : "#f0f0f0"} />
                    <XAxis dataKey="date" tickFormatter={shortFmt} tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: C.muted }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: C.muted }} tickLine={false} axisLine={false} width={36} />
                    <Tooltip contentStyle={tt} formatter={v => [`${v}kg`, showOrm ? "Est. 1RM" : "Max weight"]} labelFormatter={shortFmt} />
                    {exerciseHistory.length > 1 && (
                      <ReferenceLine
                        y={Math.max(...exerciseHistory.map(d => showOrm ? d.bestOrm : d.maxWeight))}
                        stroke="#4caf50" strokeDasharray="4 2"
                        label={{ value: "PB", fill: "#4caf50", fontSize: 10 }}
                      />
                    )}
                    <Line type="monotone" dataKey={showOrm ? "bestOrm" : "maxWeight"} stroke={C.text} strokeWidth={2} dot={{ r: 3, fill: C.text }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <MC label="Best weight" value={`${Math.max(...exerciseHistory.map(d => d.maxWeight))}kg`} sub="heaviest set" />
                  <MC label="Est. 1RM" value={`${Math.max(...exerciseHistory.map(d => d.bestOrm))}kg`} sub="Epley formula" color="#4caf50" />
                  <MC label="Sessions" value={exerciseHistory.length} sub="logged" />
                  {exerciseHistory.length >= 2 && (
                    <MC
                      label="Progress"
                      value={`${exerciseHistory[exerciseHistory.length - 1].maxWeight - exerciseHistory[0].maxWeight >= 0 ? "+" : ""}${exerciseHistory[exerciseHistory.length - 1].maxWeight - exerciseHistory[0].maxWeight}kg`}
                      sub="first vs latest"
                    />
                  )}
                </div>
              </div>
            )}
          </Cd>
        </div>
      )}

      {/* ── VOLUME ───────────────────────────────────────────────────────────── */}
      {activeSection === "volume" && (
        <div>
          <SL>Volume over time</SL>
          <Cd>
            {volumeHistory.length === 0 ? <Empty text="No volume data yet." /> : (
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Total volume per session (kg × reps)</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={volumeHistory} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#2a2a2a" : "#f0f0f0"} vertical={false} />
                    <XAxis dataKey="date" tickFormatter={shortFmt} tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: C.muted }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: C.muted }} tickLine={false} axisLine={false} width={44} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}t` : v} />
                    <Tooltip contentStyle={tt} formatter={v => [`${v.toLocaleString()}kg`, "Volume"]} labelFormatter={shortFmt} />
                    <Bar dataKey="volume" fill={C.text} radius={[2, 2, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <MC label="Total" value={`${(totalVolume / 1000).toFixed(1)}t`} sub="all sessions" />
                  <MC label="Best session" value={`${Math.max(...volumeHistory.map(d => d.volume)).toLocaleString()}kg`} sub="single session" />
                  <MC label="Avg/session" value={`${Math.round(totalVolume / volumeHistory.length).toLocaleString()}kg`} sub="mean volume" />
                </div>
              </div>
            )}
          </Cd>
        </div>
      )}

      {/* ── PERSONAL BESTS ───────────────────────────────────────────────────── */}
      {activeSection === "personal bests" && (
        <div>
          <SL>Personal bests — heaviest logged set per exercise</SL>
          {personalBests.length === 0 ? <Cd><Empty text="No personal bests yet." /></Cd> : (
            <Cd style={{ padding: 0 }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 54px 40px 60px 60px", gap: 6 }}>
                {["Exercise", "Weight", "Reps", "Est. 1RM", "Date"].map(h => (
                  <span key={h} style={{ fontSize: 10, color: C.muted, letterSpacing: 1, textTransform: "uppercase", textAlign: h !== "Exercise" ? "right" : "left" }}>{h}</span>
                ))}
              </div>
              {personalBests.map(([name, pb], i) => (
                <div key={name} style={{ padding: "10px 14px", borderBottom: i < personalBests.length - 1 ? `1px solid ${dark ? "#1e1e1e" : "#f9f9f9"}` : "none", display: "grid", gridTemplateColumns: "1fr 54px 40px 60px 60px", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 400, color: C.text }}>
                    <span style={{ fontSize: 10, background: i === 0 ? "#fff8e1" : (dark ? "#222" : "#f5f5f5"), color: i === 0 ? "#b45309" : C.muted, padding: "1px 5px", borderRadius: 2, fontWeight: 700, marginRight: 6 }}>PB</span>
                    {name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text, textAlign: "right" }}>{pb.weight}kg</span>
                  <span style={{ fontSize: 13, color: C.textSec, textAlign: "right" }}>{pb.reps}</span>
                  <span style={{ fontSize: 13, color: "#4caf50", fontWeight: 700, textAlign: "right" }}>{pb.orm > 0 ? `${pb.orm}kg` : "—"}</span>
                  <span style={{ fontSize: 11, color: C.muted, textAlign: "right" }}>{shortFmt(pb.date)}</span>
                </div>
              ))}
            </Cd>
          )}
        </div>
      )}

      {/* ── AVG REPS ─────────────────────────────────────────────────────────── */}
      {activeSection === "avg reps" && (
        <div>
          <SL>Average reps per set — by exercise</SL>
          <Cd>
            {avgRepsData.length === 0 ? <Empty text="No rep data yet." /> : (
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Average reps per set across all logged sessions</div>
                <ResponsiveContainer width="100%" height={Math.max(200, avgRepsData.slice(0, 12).length * 32)}>
                  <BarChart data={avgRepsData.slice(0, 12)} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#2a2a2a" : "#f0f0f0"} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: C.muted }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: C.muted }} tickLine={false} axisLine={false} tickFormatter={n => n.length > 22 ? n.slice(0, 22) + "…" : n} />
                    <Tooltip contentStyle={tt} formatter={(v, _, props) => [`${v} reps avg · ${props.payload.sessions} sessions`, ""]} />
                    <Bar dataKey="avgReps" fill={C.text} radius={[0, 2, 2, 0]} maxBarSize={20} label={{ position: "right", fontSize: 11, fill: C.muted, fontFamily: "Georgia, serif" }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Cd>
        </div>
      )}

      {/* ── DURATION ─────────────────────────────────────────────────────────── */}
      {activeSection === "duration" && (
        <div>
          <SL>Session duration over time</SL>
          <Cd>
            {durations.length === 0 ? <Empty text="No duration data yet. Finish a workout using the Finish button to record duration." /> : (
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Minutes per session</div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={durations} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#2a2a2a" : "#f0f0f0"} />
                    <XAxis dataKey="date" tickFormatter={shortFmt} tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: C.muted }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fontFamily: "Georgia, serif", fill: C.muted }} tickLine={false} axisLine={false} width={36} tickFormatter={v => `${v}m`} />
                    <Tooltip contentStyle={tt} formatter={(v, _, props) => [`${v} min`, props.payload.label]} labelFormatter={shortFmt} />
                    {durations.length > 1 && <ReferenceLine y={avgDuration} stroke={C.muted} strokeDasharray="4 2" label={{ value: `avg ${avgDuration}m`, fill: C.muted, fontSize: 10 }} />}
                    <Line type="monotone" dataKey="duration" stroke={C.text} strokeWidth={2} dot={{ r: 3, fill: C.text }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <MC label="Avg duration" value={`${avgDuration}m`} sub="per session" />
                  <MC label="Longest" value={`${Math.max(...durations.map(d => d.duration))}m`} sub="single session" />
                  <MC label="Shortest" value={`${Math.min(...durations.map(d => d.duration))}m`} sub="single session" />
                </div>
              </div>
            )}
          </Cd>
        </div>
      )}

    </div>
  );
}