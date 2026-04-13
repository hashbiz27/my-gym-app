import { useState, useEffect } from "react";
import {
  AGE_CLASSES, WEIGHT_CLASSES, DAYS_OF_WEEK,
  AGE_PROFILES, REGIMES, ALL_SESSIONS,
  MOBILITY_WARMUPS, getSessionWithAge, EXERCISE_GUIDES,
} from "./gymData";

// ─── Storage ──────────────────────────────────────────────────────────────────
const LS = {
  get: (k, fb = null) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const todayStr = () => new Date().toISOString().slice(0, 10);

// ─── Tiny components ──────────────────────────────────────────────────────────
const Pill = ({ active, onClick, children, style = {} }) => (
  <button onClick={onClick} style={{ padding: "8px 16px", border: `1px solid ${active ? "#111" : "#ddd"}`, background: active ? "#111" : "#fff", color: active ? "#fff" : "#555", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif", borderRadius: 2, fontWeight: active ? 700 : 400, transition: "all 0.15s", ...style }}>{children}</button>
);
const Btn = ({ onClick, children, variant = "primary", color, style = {}, disabled }) => {
  const bg = color || (variant === "primary" ? "#111" : variant === "danger" ? "#b91c1c" : "#fff");
  const fg = variant === "secondary" ? "#111" : "#fff";
  return <button onClick={onClick} disabled={disabled} style={{ padding: "9px 20px", background: bg, color: fg, border: `1px solid ${bg === "#fff" ? "#111" : bg}`, cursor: disabled ? "default" : "pointer", fontSize: 13, fontFamily: "Georgia, serif", fontWeight: 600, borderRadius: 2, opacity: disabled ? 0.4 : 1, ...style }}>{children}</button>;
};
const SLabel = ({ children, style = {} }) => (
  <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", margin: "22px 0 10px", ...style }}>{children}</div>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function GymRoutine() {
  // Setup state
  const [regime, setRegime] = useState(() => LS.get("gym_regime", null));
  const [ageClass, setAgeClass] = useState(() => LS.get("gym_age", null));
  const [weightClass, setWeightClass] = useState(() => LS.get("gym_wc", null));
  const [selectedDays, setSelectedDays] = useState(() => LS.get("gym_days", []));
  const [step, setStep] = useState(() => LS.get("gym_step", 1));
  // Routine state
  const [activeSession, setActiveSession] = useState(() => LS.get("gym_session", null));
  const [swaps, setSwaps] = useState(() => LS.get("gym_swaps", {}));
  const [showAlts, setShowAlts] = useState({});
  const [showGuide, setShowGuide] = useState({});
  const [showAgeInfo, setShowAgeInfo] = useState(false);
  const [showMobility, setShowMobility] = useState(false);
  // View: "routine" | "log" | "history"
  const [view, setView] = useState("routine");
  // Logging
  const [workoutLog, setWorkoutLog] = useState(() => LS.get("gym_log", {}));
  const [activeLog, setActiveLog] = useState(() => LS.get("gym_activeLog", null));
  // History
  const [expandedLog, setExpandedLog] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showLogAlts, setShowLogAlts] = useState({});
  const [showHistAlts, setShowHistAlts] = useState({});

  useEffect(() => { LS.set("gym_regime", regime); }, [regime]);
  useEffect(() => { LS.set("gym_age", ageClass); }, [ageClass]);
  useEffect(() => { LS.set("gym_wc", weightClass); }, [weightClass]);
  useEffect(() => { LS.set("gym_days", selectedDays); }, [selectedDays]);
  useEffect(() => { LS.set("gym_step", step); }, [step]);
  useEffect(() => { LS.set("gym_session", activeSession); }, [activeSession]);
  useEffect(() => { LS.set("gym_swaps", swaps); }, [swaps]);
  useEffect(() => { LS.set("gym_log", workoutLog); }, [workoutLog]);
  useEffect(() => { LS.set("gym_activeLog", activeLog); }, [activeLog]);

  const regimeCfg = regime ? REGIMES[regime] : null;
  const ageProfile = ageClass ? AGE_PROFILES[ageClass] : null;
  const assignedSessions = selectedDays.slice(0, 4).map((day, i) => ({ day, sessionId: regimeCfg?.sessionOrder[i] }));

  const toggleDay = (day) => setSelectedDays(p => p.includes(day) ? p.filter(d => d !== day) : p.length < 4 ? [...p, day] : p);

 
  // ── Log helpers ──
  const startLog = (sid) => {
    const session = getSessionWithAge(regime, sid, ageClass);
    if (!session) return;
    const sets = {};
    const exerciseNames = {};
    session.exercises.forEach((ex, i) => {
      const key = `${sid}-${i}`;
      sets[key] = Array.from({ length: parseInt(ex.sets) || 3 }, () => ({ weight: "", reps: "", done: false }));
      exerciseNames[key] = swaps[key] || ex.name;
    });
    setActiveLog({ regime, sessionId: sid, date: todayStr(), sets, exerciseNames, startedAt: new Date().toISOString() });
    setView("log");
  };

  const updateSet = (exKey, setIdx, field, val) =>
    setActiveLog(p => ({ ...p, sets: { ...p.sets, [exKey]: p.sets[exKey].map((s, i) => i === setIdx ? { ...s, [field]: val } : s) } }));

  const toggleDone = (exKey, setIdx) =>
    setActiveLog(p => ({ ...p, sets: { ...p.sets, [exKey]: p.sets[exKey].map((s, i) => i === setIdx ? { ...s, done: !s.done } : s) } }));

  const addSet = (exKey) =>
    setActiveLog(p => { const prev = p.sets[exKey] || []; const last = prev[prev.length - 1] || { weight: "", reps: "" }; return { ...p, sets: { ...p.sets, [exKey]: [...prev, { weight: last.weight, reps: last.reps, done: false }] } }; });

  const removeSet = (exKey, setIdx) =>
    setActiveLog(p => ({ ...p, sets: { ...p.sets, [exKey]: p.sets[exKey].length > 1 ? p.sets[exKey].filter((_, i) => i !== setIdx) : p.sets[exKey] } }));

  const finishWorkout = () => {
    const key = `${activeLog.sessionId}-${Date.now()}`;
    setWorkoutLog(p => ({ ...p, [key]: { ...activeLog, finishedAt: new Date().toISOString() } }));
    setActiveLog(null);
    setView("history");
  };

  // ── History edit/delete ──
  const updateLogSet = (logKey, exKey, setIdx, field, val) =>
    setWorkoutLog(p => ({ ...p, [logKey]: { ...p[logKey], sets: { ...p[logKey].sets, [exKey]: p[logKey].sets[exKey].map((s, i) => i === setIdx ? { ...s, [field]: val } : s) } } }));

  const toggleLogSetDone = (logKey, exKey, setIdx) =>
    setWorkoutLog(p => ({ ...p, [logKey]: { ...p[logKey], sets: { ...p[logKey].sets, [exKey]: p[logKey].sets[exKey].map((s, i) => i === setIdx ? { ...s, done: !s.done } : s) } } }));

  const addLogSet = (logKey, exKey) =>
    setWorkoutLog(p => { const prev = p[logKey].sets[exKey] || []; const last = prev[prev.length - 1] || { weight: "", reps: "" }; return { ...p, [logKey]: { ...p[logKey], sets: { ...p[logKey].sets, [exKey]: [...prev, { weight: last.weight, reps: last.reps, done: false }] } } }; });

  const removeLogSet = (logKey, exKey, setIdx) =>
    setWorkoutLog(p => ({ ...p, [logKey]: { ...p[logKey], sets: { ...p[logKey].sets, [exKey]: p[logKey].sets[exKey].length > 1 ? p[logKey].sets[exKey].filter((_, i) => i !== setIdx) : p[logKey].sets[exKey] } } }));

  const deleteLog = (key) => {
    setWorkoutLog(p => { const n = { ...p }; delete n[key]; return n; });
    setDeleteConfirm(null);
    setEditingLog(null);
    setExpandedLog(null);
  };

  // Swap exercise name in the active log
  const swapLogExercise = (exKey, newName) => {
    setActiveLog(p => ({
      ...p,
      exerciseNames: { ...p.exerciseNames, [exKey]: newName },
    }));
    setShowLogAlts({});
  };

  // Swap exercise name in a saved history entry
  const swapHistoryExercise = (logKey, exKey, newName) => {
    setWorkoutLog(p => ({
      ...p,
      [logKey]: {
        ...p[logKey],
        exerciseNames: { ...p[logKey].exerciseNames, [exKey]: newName },
      },
    }));
    setShowHistAlts({});
  };

  // ── Stats ──
  const pct = (log) => { const all = Object.values(log.sets || {}).flat(); return all.length ? Math.round(all.filter(s => s.done).length / all.length * 100) : 0; };
  const vol = (log) => Math.round(Object.values(log.sets || {}).flat().filter(s => s.done && s.weight && s.reps).reduce((sum, s) => sum + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0));
  const allLogs = Object.entries(workoutLog).sort((a, b) => b[1].finishedAt?.localeCompare(a[1].finishedAt));

  // ─── Shared header ────────────────────────────────────────────────────────
  const Header = () => (
    <div style={{ background: "#111", color: "#f8f7f4", padding: "22px 20px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#666", marginBottom: 4 }}>Training Platform</div>
        <h1 style={{ fontSize: "clamp(18px, 4vw, 26px)", fontWeight: 700, margin: "0 0 3px", letterSpacing: "-0.5px" }}>
          {regimeCfg ? `${regimeCfg.icon} ${regimeCfg.label}` : "Choose Your Programme"}
        </h1>
        {step >= 4 && <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 12px", fontStyle: "italic" }}>{weightClass} · {ageClass} · {selectedDays.length} days/week</p>}
        {step >= 4 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {["routine", "history"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "4px 12px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer", background: (view === v || (v === "routine" && view === "log")) ? "#fff" : "transparent", color: (view === v || (v === "routine" && view === "log")) ? "#111" : "#888", border: `1px solid ${(view === v || (v === "routine" && view === "log")) ? "#fff" : "#555"}`, borderRadius: 2 }}>{v}</button>
            ))}
            {activeLog && <span onClick={() => setView("log")} style={{ padding: "4px 10px", fontSize: 10, background: "#4caf50", color: "#fff", borderRadius: 2, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer" }}>● Active</span>}
            <button onClick={() => {
  setRegime(null);
  setAgeClass(null);
  setWeightClass(null);
  setSelectedDays([]);
  setActiveSession(null);
  setSwaps({});
  setView("routine");
  setStep(1);
  LS.set("gym_step", 1);
  LS.set("gym_session", null);
  LS.set("gym_regime", null);
  LS.set("gym_age", null);
  LS.set("gym_wc", null);
  LS.set("gym_days", []);
  LS.set("gym_swaps", {});
}} style={{ padding: "4px 12px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer", background: "transparent", color: "#666", border: "1px solid #444", borderRadius: 2 }}>Switch</button>
          </div>
        )}
      </div>
    </div>
  );

  const inner = { maxWidth: 720, margin: "0 auto", padding: "0 16px 56px" };
  const card = { background: "#fff", border: "1px solid #e5e5e5" };

  // ─── Step 1: Regime ───────────────────────────────────────────────────────
  if (step === 1) return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
      <Header />
      <div style={inner}>
        <SLabel>Step 1 of 4 — Choose your goal</SLabel>
        <p style={{ fontSize: 14, color: "#555", marginBottom: 20, lineHeight: 1.7 }}>Each programme has different exercise selection, rep ranges, rest periods and intensity. Pick the one that matches what you're training for.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 28 }}>
          {Object.values(REGIMES).map(r => {
            const isActive = regime === r.id;
            return (
              <button key={r.id} onClick={() => setRegime(r.id)} style={{ padding: "16px", border: `2px solid ${isActive ? r.color : "#e5e5e5"}`, background: isActive ? r.colorLight : "#fff", cursor: "pointer", textAlign: "left", borderRadius: 3, transition: "all 0.15s", fontFamily: "Georgia, serif" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{r.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? r.color : "#111", marginBottom: 3 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: isActive ? r.color : "#888", marginBottom: 6, fontWeight: 600 }}>{r.tagline}</div>
                <div style={{ fontSize: 11, color: "#666", lineHeight: 1.5 }}>{r.description}</div>
                <div style={{ marginTop: 8, fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>{r.split} · {r.daysMin}–{r.daysMax} days</div>
              </button>
            );
          })}
        </div>
        <Btn onClick={() => regime && setStep(2)} disabled={!regime}>Continue →</Btn>
      </div>
    </div>
  );

  // ─── Step 2: Age ──────────────────────────────────────────────────────────
  if (step === 2) return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
      <Header />
      <div style={inner}>
        <SLabel>Step 2 of 4 — Your age group</SLabel>
        <p style={{ fontSize: 14, color: "#555", marginBottom: 18, lineHeight: 1.7 }}>Exercises, reps, rest and load are adapted to your life stage. Different ages need different approaches to train safely and effectively.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {AGE_CLASSES.map(ac => {
            const p = AGE_PROFILES[ac]; const isActive = ageClass === ac;
            return (
              <button key={ac} onClick={() => setAgeClass(ac)} style={{ padding: "14px", border: `1px solid ${isActive ? "#111" : "#ddd"}`, background: isActive ? "#111" : "#fff", color: isActive ? "#fff" : "#333", cursor: "pointer", textAlign: "left", borderRadius: 2, fontFamily: "Georgia, serif", transition: "all 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{ac}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "2px 7px", background: isActive ? "rgba(255,255,255,0.15)" : p.badgeColor, color: isActive ? "#fff" : p.badgeText, borderRadius: 2 }}>{p.badge}</span>
                </div>
                <div style={{ fontSize: 12, color: isActive ? "#bbb" : "#888" }}>{p.intensityLabel}</div>
              </button>
            );
          })}
        </div>
        {ageClass && (
          <div style={{ ...card, borderLeft: `3px solid ${ageProfile.badgeText}`, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>What this means for your training</div>
            {ageProfile.notes.map((n, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}><span style={{ color: ageProfile.badgeText, flexShrink: 0 }}>→</span><span style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>{n}</span></div>)}
            <div style={{ marginTop: 10, background: "#f9f9f9", padding: "8px 12px", fontSize: 12, color: "#555", lineHeight: 1.7 }}>
              <div><strong>Weight:</strong> {ageProfile.weightNote}</div>
              <div><strong>Rest:</strong> {ageProfile.restNote}</div>
              <div><strong>Reps:</strong> {ageProfile.repsNote}</div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => setStep(1)} variant="secondary">← Back</Btn>
          <Btn onClick={() => ageClass && setStep(3)} disabled={!ageClass}>Continue →</Btn>
        </div>
      </div>
    </div>
  );

  // ─── Step 3: Weight class ─────────────────────────────────────────────────
  if (step === 3) return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
      <Header />
      <div style={inner}>
        <SLabel>Step 3 of 4 — Your weight class</SLabel>
        <p style={{ fontSize: 14, color: "#555", marginBottom: 18, lineHeight: 1.7 }}>Sets starting weight ranges for every exercise. You can always adjust up or down based on feel.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
          {WEIGHT_CLASSES.map(wc => <Pill key={wc} active={weightClass === wc} onClick={() => setWeightClass(wc)} style={{ padding: "14px", textAlign: "left", width: "100%" }}>{wc}</Pill>)}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => setStep(2)} variant="secondary">← Back</Btn>
          <Btn onClick={() => weightClass && setStep(4)} disabled={!weightClass}>Continue →</Btn>
        </div>
      </div>
    </div>
  );

  // ─── Step 4: Days ─────────────────────────────────────────────────────────
  if (step === 4 && view === "setup") {
    const count = selectedDays.length;
    const min = regimeCfg?.daysMin || 3;
    return (
      <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
        <Header />
        <div style={inner}>
          <SLabel>Step 4 of 4 — Training days</SLabel>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 18, lineHeight: 1.7 }}>Select {min}–4 days. Sessions will be assigned in order across your chosen days.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            {DAYS_OF_WEEK.map(day => <Pill key={day} active={selectedDays.includes(day)} onClick={() => toggleDay(day)}>{day}</Pill>)}
          </div>
          {count > 0 && (
            <div style={{ ...card, borderLeft: "3px solid #111", padding: "12px 16px", marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Your schedule</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 6 }}>
                {assignedSessions.map(({ day, sessionId }) => (
                  <div key={day} style={{ fontSize: 13 }}><span style={{ fontWeight: 700 }}>{day}</span><span style={{ color: "#888", marginLeft: 6 }}>{regimeCfg?.sessionLabels[sessionId]}</span></div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => setStep(3)} variant="secondary">← Back</Btn>
            <Btn onClick={() => { if (count >= min) { setActiveSession(assignedSessions[0]?.sessionId); setView("routine"); } }} disabled={count < min}>View My Programme →</Btn>
          </div>
          {count > 0 && count < min && <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>Select at least {min} days</p>}
        </div>
      </div>
    );
  }

  // Route to setup if needed
  if (step === 4 && selectedDays.length === 0 && view !== "setup") {
    setView("setup");
    return null;
  }

  // ─── Log view ─────────────────────────────────────────────────────────────
  if (view === "log" && activeLog) {
    const sid = activeLog.sessionId;
    const session = getSessionWithAge(regime, sid, ageClass);
    if (!session) return null;
    const mobility = MOBILITY_WARMUPS[ageClass]?.[sid];
    const allSets = Object.values(activeLog.sets).flat();
    const doneSets = allSets.filter(s => s.done).length;
    const totalSets = allSets.length;
    return (
      <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
        <div style={{ background: "#111", color: "#f8f7f4", padding: "20px 20px 14px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 4 }}>Logging · {activeLog.date}</div>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 2px" }}>{session.label}</h1>
                <p style={{ color: "#aaa", fontSize: 12, margin: 0, fontStyle: "italic" }}>{session.tag}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{doneSets}<span style={{ fontSize: 12, color: "#666" }}>/{totalSets}</span></div>
                <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>sets done</div>
              </div>
            </div>
            <div style={{ height: 3, background: "#333", borderRadius: 2, marginTop: 10 }}>
              <div style={{ height: 3, background: "#4caf50", borderRadius: 2, width: `${totalSets ? doneSets / totalSets * 100 : 0}%`, transition: "width 0.3s" }} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 80px" }}>
          {mobility && (
            <div style={{ ...card, borderLeft: `3px solid ${ageProfile?.badgeText || "#888"}`, marginTop: 14 }}>
              <div onClick={() => setShowMobility(p => !p)} style={{ padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Warm-up first <span style={{ fontSize: 11, color: "#aaa", fontWeight: 400 }}>· {mobility.length} exercises</span></span>
                <span style={{ color: "#ccc" }}>{showMobility ? "▲" : "▼"}</span>
              </div>
              {showMobility && <div style={{ padding: "0 14px 12px", borderTop: "1px solid #f5f5f5" }}>
                {mobility.map((m, i) => <div key={i} style={{ fontSize: 13, color: "#444", padding: "4px 0", borderBottom: i < mobility.length - 1 ? "1px solid #f9f9f9" : "none" }}><span style={{ color: ageProfile?.badgeText, fontWeight: 700, marginRight: 8 }}>{i + 1}</span>{m}</div>)}
              </div>}
            </div>
          )}
          {session.exercises.map((ex, exIdx) => {
            const exKey = `${sid}-${exIdx}`;
            const sets = activeLog.sets[exKey] || [];
            const allDone = sets.length > 0 && sets.every(s => s.done);
            const loggedName = activeLog.exerciseNames?.[exKey] || ex.name;
            return (
              <div key={exIdx} style={{ ...card, border: `1px solid ${allDone ? "#a5d6a7" : "#e5e5e5"}`, marginTop: 12 }}>
                <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid #f5f5f5", background: allDone ? "#f1f8f1" : "#fff", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                  <div>
                    <span style={{ fontSize: 10, color: "#ccc", fontFamily: "monospace", marginRight: 6 }}>{String(exIdx + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{loggedName}</span>
                    {allDone && <span style={{ marginLeft: 8, fontSize: 10, background: "#a5d6a7", color: "#1b5e20", padding: "2px 6px", borderRadius: 2, fontWeight: 700 }}>done</span>}
                    {ex.note && <div style={{ fontSize: 11, color: "#aaa", paddingLeft: 22, fontStyle: "italic" }}>{ex.note}</div>}
                    {weightClass && ex.weight?.[weightClass] && <div style={{ fontSize: 11, color: "#555", paddingLeft: 22 }}>Target: <strong>{ex.weight[weightClass]}</strong></div>}
                    <button
                      onClick={() => setShowLogAlts(p => ({ ...p, [exKey]: !p[exKey] }))}
                      style={{ marginLeft: 22, marginTop: 3, fontSize: 11, color: "#888", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
                    >
                      {showLogAlts[exKey] ? "hide" : "swap exercise"}
                    </button>
                    {showLogAlts[exKey] && (
                      <div style={{ paddingLeft: 22, marginTop: 6, display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {ALL_SESSIONS[regime]?.[sid]?.exercises[exIdx]?.alts?.map(alt => (
                          <button key={alt} onClick={() => swapLogExercise(exKey, alt)}
                            style={{ padding: "3px 8px", background: "#f0f0f0", border: "1px solid #e0e0e0", fontSize: 11, cursor: "pointer", borderRadius: 2, color: "#444" }}>
                            {alt}
                          </button>
                        ))}
                        {loggedName !== ex.name && (
                          <button onClick={() => swapLogExercise(exKey, ex.name)}
                            style={{ padding: "3px 8px", background: "#fff0f0", border: "1px solid #f5c6c6", fontSize: 11, cursor: "pointer", borderRadius: 2, color: "#a33" }}>
                            restore
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", fontSize: 12, color: "#aaa" }}>{ex.sets} × {ex.reps}<br />{ex.rest}</div>
                </div>
                <div style={{ padding: "8px 14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "20px 1fr 1fr 32px 26px", gap: 5, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: "#ccc" }}>#</span>
                    <span style={{ fontSize: 10, color: "#bbb", textTransform: "uppercase", letterSpacing: 1 }}>kg</span>
                    <span style={{ fontSize: 10, color: "#bbb", textTransform: "uppercase", letterSpacing: 1 }}>reps</span>
                    <span style={{ fontSize: 10, color: "#bbb", textTransform: "uppercase" }}>✓</span>
                    <span />
                  </div>
                  {sets.map((set, setIdx) => (
                    <div key={setIdx} style={{ display: "grid", gridTemplateColumns: "20px 1fr 1fr 32px 26px", gap: 5, alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "#bbb", fontWeight: 700 }}>{setIdx + 1}</span>
                      <input type="number" inputMode="decimal" placeholder="—" value={set.weight} onChange={e => updateSet(exKey, setIdx, "weight", e.target.value)} style={{ border: "1px solid #e0e0e0", padding: "6px 8px", fontSize: 14, fontFamily: "Georgia, serif", background: set.done ? "#f1f8f1" : "#fff", borderRadius: 2, width: "100%", boxSizing: "border-box" }} />
                      <input type="number" inputMode="numeric" placeholder="—" value={set.reps} onChange={e => updateSet(exKey, setIdx, "reps", e.target.value)} style={{ border: "1px solid #e0e0e0", padding: "6px 8px", fontSize: 14, fontFamily: "Georgia, serif", background: set.done ? "#f1f8f1" : "#fff", borderRadius: 2, width: "100%", boxSizing: "border-box" }} />
                      <button onClick={() => toggleDone(exKey, setIdx)} style={{ width: 30, height: 30, border: `2px solid ${set.done ? "#4caf50" : "#ddd"}`, background: set.done ? "#4caf50" : "#fff", cursor: "pointer", borderRadius: 2, color: "#fff", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>{set.done ? "✓" : ""}</button>
                      <button onClick={() => removeSet(exKey, setIdx)} style={{ width: 24, height: 24, border: "1px solid #eee", background: "#fff", cursor: "pointer", borderRadius: 2, fontSize: 14, color: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                  ))}
                  <button onClick={() => addSet(exKey)} style={{ marginTop: 3, fontSize: 12, color: "#888", background: "none", border: "1px dashed #ddd", cursor: "pointer", padding: "5px", borderRadius: 2, width: "100%", fontFamily: "Georgia, serif" }}>+ add set</button>
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn onClick={finishWorkout} style={{ flex: 1 }}>Finish Workout</Btn>
            <Btn onClick={() => { setActiveLog(null); setView("routine"); }} variant="secondary">Discard</Btn>
          </div>
        </div>
      </div>
    );
  }

  // ─── History view ─────────────────────────────────────────────────────────
  if (view === "history") {
    return (
      <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
        <Header />
        {/* Delete confirmation modal */}
        {deleteConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", padding: "28px 24px", maxWidth: 380, width: "100%", borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>🗑️</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Delete this workout?</div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
                This will permanently remove the workout log for <strong>{workoutLog[deleteConfirm]?.date}</strong> — <strong>{ALL_SESSIONS[workoutLog[deleteConfirm]?.regime]?.[workoutLog[deleteConfirm]?.sessionId]?.label || workoutLog[deleteConfirm]?.sessionId}</strong>. This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={() => deleteLog(deleteConfirm)} variant="danger" style={{ flex: 1 }}>Yes, delete it</Btn>
                <Btn onClick={() => setDeleteConfirm(null)} variant="secondary" style={{ flex: 1 }}>Cancel</Btn>
              </div>
            </div>
          </div>
        )}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 56px" }}>
          <SLabel>Workout history</SLabel>
          {allLogs.length === 0 ? (
            <div style={{ ...card, padding: "40px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
              <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>No workouts logged yet. Start a session from the Routine tab.</p>
            </div>
          ) : allLogs.map(([key, log]) => {
            const logRegime = log.regime || "hypertrophy";
            const session = ALL_SESSIONS[logRegime]?.[log.sessionId];
            const doneSets = Object.values(log.sets || {}).flat().filter(s => s.done).length;
            const totalSets = Object.values(log.sets || {}).flat().length;
            const p = pct(log); const v = vol(log);
            const isExpanded = expandedLog === key;
            const isEditing = editingLog === key;
            return (
              <div key={key} style={{ ...card, marginBottom: 8 }}>
                {/* Header row */}
                <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div onClick={() => setExpandedLog(isExpanded ? null : key)} style={{ cursor: "pointer", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{session?.label || log.sessionId}</span>
                      {REGIMES[logRegime] && <span style={{ fontSize: 10, padding: "2px 6px", background: REGIMES[logRegime].colorLight, color: REGIMES[logRegime].color, borderRadius: 2, fontWeight: 700 }}>{REGIMES[logRegime].label}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#999" }}>{log.date} · {log.finishedAt ? new Date(log.finishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 700 }}>{doneSets}/{totalSets} sets</div><div style={{ fontSize: 11, color: "#aaa" }}>{p}% complete</div></div>
                    {v > 0 && <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 700 }}>{v.toLocaleString()}kg</div><div style={{ fontSize: 11, color: "#aaa" }}>volume</div></div>}
                    {/* Edit / Delete buttons */}
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => { setEditingLog(isEditing ? null : key); setExpandedLog(key); }} style={{ padding: "4px 10px", fontSize: 11, fontWeight: 700, background: isEditing ? "#111" : "#f5f5f5", color: isEditing ? "#fff" : "#555", border: "1px solid #ddd", cursor: "pointer", borderRadius: 2, fontFamily: "Georgia, serif" }}>{isEditing ? "Done" : "Edit"}</button>
                      <button onClick={() => setDeleteConfirm(key)} style={{ padding: "4px 10px", fontSize: 11, fontWeight: 700, background: "#fff1f2", color: "#b91c1c", border: "1px solid #fecdd3", cursor: "pointer", borderRadius: 2, fontFamily: "Georgia, serif" }}>Delete</button>
                    </div>
                    <span onClick={() => setExpandedLog(isExpanded ? null : key)} style={{ color: "#ccc", fontSize: 14, cursor: "pointer" }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 3, background: "#f0f0f0" }}><div style={{ height: 3, background: "#4caf50", width: `${p}%` }} /></div>
                {/* Expanded content */}
                {isExpanded && !isEditing && (
                  <div style={{ padding: "12px 14px", borderTop: "1px solid #f5f5f5" }}>
                    {session?.exercises.map((ex, exIdx) => {
                      const exKey = `${log.sessionId}-${exIdx}`;
                      const done = ((log.sets || {})[exKey] || []).filter(s => s.done);
                      if (!done.length) return null;
                      const loggedName = log.exerciseNames?.[exKey] || ex.name;
                      return (
                        <div key={exIdx} style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{loggedName}</div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            {done.map((s, i) => <span key={i} style={{ fontSize: 11, background: "#f5f5f5", border: "1px solid #eee", padding: "3px 8px", borderRadius: 2, color: "#555" }}>Set {i + 1}: {s.weight || "?"}kg × {s.reps || "?"}</span>)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Edit mode */}
                {isEditing && (
                  <div style={{ padding: "12px 14px", borderTop: "1px solid #f5f5f5", background: "#fafafa" }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Edit sets — tap a field to update</div>
                    {session?.exercises.map((ex, exIdx) => {
                      const exKey = `${log.sessionId}-${exIdx}`;
                      const sets = (log.sets || {})[exKey] || [];
                      const loggedName = log.exerciseNames?.[exKey] || ex.name;
                      return (
                        <div key={exIdx} style={{ marginBottom: 14 }}>
                          <div style={{ marginBottom: 6 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{loggedName}</div>
                            <button
                              onClick={() => setShowHistAlts(p => ({ ...p, [`${key}-${exKey}`]: !p[`${key}-${exKey}`] }))}
                              style={{ fontSize: 11, color: "#888", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
                            >
                              {showHistAlts[`${key}-${exKey}`] ? "hide" : "swap exercise"}
                            </button>
                            {showHistAlts[`${key}-${exKey}`] && (
                              <div style={{ marginTop: 5, display: "flex", flexWrap: "wrap", gap: 5 }}>
                                {ALL_SESSIONS[logRegime]?.[log.sessionId]?.exercises[exIdx]?.alts?.map(alt => (
                                  <button key={alt} onClick={() => swapHistoryExercise(key, exKey, alt)}
                                    style={{ padding: "3px 8px", background: "#f0f0f0", border: "1px solid #e0e0e0", fontSize: 11, cursor: "pointer", borderRadius: 2, color: "#444" }}>
                                    {alt}
                                  </button>
                                ))}
                                {loggedName !== ex.name && (
                                  <button onClick={() => swapHistoryExercise(key, exKey, ex.name)}
                                    style={{ padding: "3px 8px", background: "#fff0f0", border: "1px solid #f5c6c6", fontSize: 11, cursor: "pointer", borderRadius: 2, color: "#a33" }}>
                                    restore
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "20px 1fr 1fr 32px 26px", gap: 5, marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: "#ccc" }}>#</span>
                            <span style={{ fontSize: 10, color: "#bbb", textTransform: "uppercase" }}>kg</span>
                            <span style={{ fontSize: 10, color: "#bbb", textTransform: "uppercase" }}>reps</span>
                            <span style={{ fontSize: 10, color: "#bbb" }}>✓</span>
                            <span />
                          </div>
                          {sets.map((set, setIdx) => (
                            <div key={setIdx} style={{ display: "grid", gridTemplateColumns: "20px 1fr 1fr 32px 26px", gap: 5, alignItems: "center", marginBottom: 5 }}>
                              <span style={{ fontSize: 12, color: "#bbb", fontWeight: 700 }}>{setIdx + 1}</span>
                              <input type="number" inputMode="decimal" value={set.weight} onChange={e => updateLogSet(key, exKey, setIdx, "weight", e.target.value)} style={{ border: "1px solid #e0e0e0", padding: "6px 8px", fontSize: 13, fontFamily: "Georgia, serif", background: set.done ? "#f1f8f1" : "#fff", borderRadius: 2, width: "100%", boxSizing: "border-box" }} />
                              <input type="number" inputMode="numeric" value={set.reps} onChange={e => updateLogSet(key, exKey, setIdx, "reps", e.target.value)} style={{ border: "1px solid #e0e0e0", padding: "6px 8px", fontSize: 13, fontFamily: "Georgia, serif", background: set.done ? "#f1f8f1" : "#fff", borderRadius: 2, width: "100%", boxSizing: "border-box" }} />
                              <button onClick={() => toggleLogSetDone(key, exKey, setIdx)} style={{ width: 30, height: 30, border: `2px solid ${set.done ? "#4caf50" : "#ddd"}`, background: set.done ? "#4caf50" : "#fff", cursor: "pointer", borderRadius: 2, color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{set.done ? "✓" : ""}</button>
                              <button onClick={() => removeLogSet(key, exKey, setIdx)} style={{ width: 24, height: 24, border: "1px solid #eee", background: "#fff", cursor: "pointer", borderRadius: 2, fontSize: 14, color: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                            </div>
                          ))}
                          <button onClick={() => addLogSet(key, exKey)} style={{ fontSize: 11, color: "#888", background: "none", border: "1px dashed #ddd", cursor: "pointer", padding: "4px", borderRadius: 2, width: "100%", fontFamily: "Georgia, serif" }}>+ add set</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Routine view ─────────────────────────────────────────────────────────
  if (!activeSession && regimeCfg) {
    const firstSid = regimeCfg.sessionOrder[0];
    LS.set("gym_session", firstSid);
    setActiveSession(firstSid);
    return null;
  }
  const currentSession = getSessionWithAge(regime, activeSession, ageClass);
  if (!currentSession) return null;
  const mobility = MOBILITY_WARMUPS[ageClass]?.[activeSession];

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
      <Header />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 56px" }}>
        {/* Age profile banner */}
        {ageProfile && (
          <div style={{ ...card, borderLeft: `3px solid ${ageProfile.badgeText}`, marginTop: 18 }}>
            <div onClick={() => setShowAgeInfo(p => !p)} style={{ padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "2px 7px", background: ageProfile.badgeColor, color: ageProfile.badgeText, borderRadius: 2 }}>{ageProfile.badge}</span>
                <span style={{ fontSize: 13, color: "#555" }}>{ageProfile.intensityLabel}</span>
              </div>
              <span style={{ color: "#ccc", fontSize: 13 }}>{showAgeInfo ? "▲" : "▼"}</span>
            </div>
            {showAgeInfo && (
              <div style={{ padding: "0 14px 12px", borderTop: "1px solid #f5f5f5" }}>
                {ageProfile.notes.map((n, i) => <div key={i} style={{ display: "flex", gap: 8, marginTop: 5 }}><span style={{ color: ageProfile.badgeText, flexShrink: 0 }}>→</span><span style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>{n}</span></div>)}
                <div style={{ marginTop: 10, background: "#f9f9f9", padding: "8px 12px", fontSize: 12, color: "#555", lineHeight: 1.7 }}>
                  <div><strong>Weight:</strong> {ageProfile.weightNote}</div>
                  <div><strong>Rest:</strong> {ageProfile.restNote}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Week bar */}
        <SLabel>Your week</SLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 18 }}>
          {DAYS_OF_WEEK.map(day => {
            const a = assignedSessions.find(s => s.day === day);
            return (
              <div key={day} onClick={() => a && setActiveSession(a.sessionId)} style={{ background: a ? "#111" : "#fff", border: "1px solid #e5e5e5", borderTop: a && activeSession === a.sessionId ? "3px solid #888" : "1px solid #e5e5e5", padding: "8px 3px", textAlign: "center", cursor: a ? "pointer" : "default" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: a ? "#aaa" : "#bbb", textTransform: "uppercase", marginBottom: 2 }}>{day}</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: a ? "#fff" : "#ddd", lineHeight: 1.3 }}>{a ? regimeCfg?.sessionLabels[a.sessionId] : "Rest"}</div>
              </div>
            );
          })}
        </div>

        {/* Session tabs */}
        <SLabel style={{ marginTop: 0 }}>Sessions</SLabel>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${regimeCfg?.sessionOrder.length || 4}, 1fr)`, gap: 5, marginBottom: 4 }}>
          {regimeCfg?.sessionOrder.map(sid => <Pill key={sid} active={activeSession === sid} onClick={() => setActiveSession(sid)} style={{ fontSize: 11, padding: "7px 4px" }}>{regimeCfg.sessionLabels[sid]}</Pill>)}
        </div>

        {/* Mobility warm-up */}
        {mobility && (
          <div style={{ ...card, borderLeft: `3px solid ${ageProfile?.badgeText || "#888"}`, marginTop: 10 }}>
            <div onClick={() => setShowMobility(p => !p)} style={{ padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Warm-up protocol <span style={{ fontSize: 11, color: "#aaa", fontWeight: 400 }}>· {mobility.length} exercises before lifting</span></span>
              <span style={{ color: "#aaa" }}>{showMobility ? "▲" : "▼"}</span>
            </div>
            {showMobility && <div style={{ padding: "0 14px 12px", borderTop: "1px solid #f5f5f5" }}>
              {mobility.map((m, i) => <div key={i} style={{ fontSize: 13, color: "#444", padding: "4px 0", borderBottom: i < mobility.length - 1 ? "1px solid #f9f9f9" : "none" }}><span style={{ color: ageProfile?.badgeText, fontWeight: 700, marginRight: 8 }}>{i + 1}</span>{m}</div>)}
            </div>}
          </div>
        )}

        {/* Exercise list */}
        <div style={{ ...card, marginTop: 10, marginBottom: 14 }}>
          <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <h2 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 700 }}>{currentSession.label}</h2>
              <p style={{ margin: 0, fontSize: 13, color: "#777", fontStyle: "italic" }}>{currentSession.focus}</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", background: "#f5f5f5", color: "#555", borderRadius: 2 }}>{currentSession.tag}</span>
          </div>
          {currentSession.exercises.map((ex, i) => {
            const key = `${activeSession}-${i}`;
            const baseName = ALL_SESSIONS[regime]?.[activeSession]?.exercises[i]?.name;
            const isSwapped = !!swaps[key];
            const displayName = swaps[key] || ex.name;
            const isAgeSwap = !swaps[key] && ex.name !== baseName;
            const guide = EXERCISE_GUIDES[displayName];
            return (
              <div key={i} style={{ borderBottom: i < currentSession.exercises.length - 1 ? "1px solid #f5f5f5" : "none", padding: "11px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 2 }}>
                      <span style={{ fontSize: 10, color: "#ccc", fontFamily: "monospace" }}>{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{displayName}</span>
                      {isAgeSwap && ageProfile && <span style={{ fontSize: 9, background: ageProfile.badgeColor, color: ageProfile.badgeText, padding: "2px 5px", borderRadius: 2, fontWeight: 700 }}>{ageProfile.badge}</span>}
                      {isSwapped && <span style={{ fontSize: 9, background: "#e8f4e8", color: "#2d6a2d", padding: "2px 5px", borderRadius: 2, fontWeight: 600 }}>swapped</span>}
                    </div>
                    {ex.note && <div style={{ fontSize: 11, color: "#999", paddingLeft: 22, fontStyle: "italic", marginBottom: 2 }}>{ex.note}</div>}
                    {weightClass && ex.weight?.[weightClass] && <div style={{ fontSize: 11, color: "#555", paddingLeft: 22, marginBottom: 3 }}><span style={{ color: "#aaa" }}>Start: </span><strong>{ex.weight[weightClass]}</strong></div>}
                    <div style={{ paddingLeft: 22, display: "flex", gap: 12, marginTop: 2 }}>
                      <button onClick={() => setShowAlts(p => ({ ...p, [key]: !p[key] }))} style={{ fontSize: 11, color: "#888", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>{showAlts[key] ? "hide" : "swap exercise"}</button>
                      {guide && <button onClick={() => setShowGuide(p => ({ ...p, [key]: !p[key] }))} style={{ fontSize: 11, color: showGuide[key] ? "#1b5e20" : "#888", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", fontWeight: showGuide[key] ? 600 : 400 }}>{showGuide[key] ? "hide guide" : "how to"}</button>}
                    </div>
                    {showAlts[key] && (
                      <div style={{ paddingLeft: 22, marginTop: 5, display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {ALL_SESSIONS[regime]?.[activeSession]?.exercises[i]?.alts?.map(alt => (
                          <button key={alt} onClick={() => { setSwaps(p => ({ ...p, [key]: alt })); setShowAlts(p => ({ ...p, [key]: false })); }} style={{ padding: "3px 8px", background: "#f0f0f0", border: "1px solid #e0e0e0", fontSize: 11, cursor: "pointer", borderRadius: 2, color: "#444" }}>{alt}</button>
                        ))}
                        {isSwapped && <button onClick={() => setSwaps(p => { const n = { ...p }; delete n[key]; return n; })} style={{ padding: "3px 8px", background: "#fff0f0", border: "1px solid #f5c6c6", fontSize: 11, cursor: "pointer", borderRadius: 2, color: "#a33" }}>restore</button>}
                      </div>
                    )}
                    {showGuide[key] && guide && (
                      <div style={{ paddingLeft: 22, marginTop: 8, background: "#f9faf7", border: "1px solid #e8f0e0", borderRadius: 3, padding: "10px 14px" }}>
                        {guide.images && (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                            <div>
                              <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginBottom: 4 }}>Start</div>
                              <img src={guide.images.start} alt={`${displayName} — start position`} style={{ width: "100%", borderRadius: 3, border: "1px solid #e0e0e0", display: "block" }} />
                            </div>
                            <div>
                              <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginBottom: 4 }}>Finish</div>
                              <img src={guide.images.finish} alt={`${displayName} — finish position`} style={{ width: "100%", borderRadius: 3, border: "1px solid #e0e0e0", display: "block" }} />
                            </div>
                          </div>
                        )}
                        <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Muscles</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                          {guide.muscles.primary.map(m => <span key={m} style={{ fontSize: 10, fontWeight: 700, background: "#e8f5e9", color: "#1b5e20", padding: "2px 7px", borderRadius: 2 }}>{m}</span>)}
                          {guide.muscles.secondary.map(m => <span key={m} style={{ fontSize: 10, fontWeight: 600, background: "#fff8e1", color: "#b45309", padding: "2px 7px", borderRadius: 2 }}>{m}</span>)}
                        </div>
                        <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginBottom: 4 }}>How to perform</div>
                        {guide.steps.map((s, si) => <div key={si} style={{ display: "flex", gap: 7, marginBottom: 3 }}><span style={{ fontSize: 11, color: "#1b5e20", fontWeight: 700, flexShrink: 0 }}>{si + 1}</span><span style={{ fontSize: 12, color: "#444", lineHeight: 1.5 }}>{s}</span></div>)}
                        {guide.cues.length > 0 && <>
                          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginTop: 8, marginBottom: 4 }}>Key cues</div>
                          {guide.cues.map((c, ci) => <div key={ci} style={{ display: "flex", gap: 7, marginBottom: 2 }}><span style={{ fontSize: 11, color: "#1b5e20", flexShrink: 0 }}>+</span><span style={{ fontSize: 12, color: "#444", lineHeight: 1.5 }}>{c}</span></div>)}
                        </>}
                        {guide.mistakes.length > 0 && <>
                          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginTop: 8, marginBottom: 4 }}>Common mistakes</div>
                          {guide.mistakes.map((m, mi) => <div key={mi} style={{ display: "flex", gap: 7, marginBottom: 2 }}><span style={{ fontSize: 11, color: "#b91c1c", flexShrink: 0 }}>−</span><span style={{ fontSize: 12, color: "#444", lineHeight: 1.5 }}>{m}</span></div>)}
                        </>}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{ex.sets} × {ex.reps}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{ex.rest}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Btn onClick={() => startLog(activeSession)} style={{ width: "100%", padding: "13px", fontSize: 13 }} color={regimeCfg?.color}>
          Start {regimeCfg?.sessionLabels[activeSession]} →
        </Btn>

        <div style={{ marginTop: 12, padding: "12px 14px", background: "#111", color: "#f8f7f4", fontSize: 13, lineHeight: 1.7 }}>
          <strong>{regimeCfg?.label} tip:</strong> {
            { hypertrophy: "Progressive overload is the key — add weight or reps every 1–2 weeks.", strength: "Every working set should feel heavy. If it's easy, add weight.", power: "Speed is the stimulus. Move every rep as fast as possible.", endurance: "Rest as little as possible between exercises. Chase the burn.", stability: "Slow and controlled. Feel every muscle working. Quality over quantity.", flexibility: "Never bounce or force range. Breathe into each stretch." }[regime]
          }
        </div>
      </div>
    </div>
  );
}