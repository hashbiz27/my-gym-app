import { useState, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const WEIGHT_CLASSES = [
  { label: "Under 60kg" }, { label: "60–74kg" },
  { label: "75–89kg" }, { label: "90kg+" },
];
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SESSION_ORDER = ["upper-a", "lower-a", "upper-b", "lower-b"];
const SESSION_LABELS = { "upper-a": "Upper A", "lower-a": "Lower A", "upper-b": "Upper B", "lower-b": "Lower B" };

const exerciseData = {
  "upper-a": {
    label: "Upper A", tag: "Strength Focus", focus: "Compound-heavy. Heavier loads, lower reps.",
    exercises: [
      { name: "Barbell Bench Press", note: "Primary chest driver", alternatives: ["Dumbbell Bench Press", "Smith Machine Bench Press"], sets: "4", reps: "6–8", rest: "2–3 min", weight: { "Under 60kg": "40–60kg", "60–74kg": "60–80kg", "75–89kg": "80–100kg", "90kg+": "100–120kg" } },
      { name: "Barbell Bent-Over Row", note: "Upper back thickness", alternatives: ["Dumbbell Row", "Cable Row"], sets: "4", reps: "6–8", rest: "2–3 min", weight: { "Under 60kg": "35–55kg", "60–74kg": "55–75kg", "75–89kg": "75–95kg", "90kg+": "95–115kg" } },
      { name: "Overhead Press", note: "Front delt + upper chest", alternatives: ["Arnold Press", "Seated DB Shoulder Press"], sets: "3", reps: "8–10", rest: "2 min", weight: { "Under 60kg": "25–40kg", "60–74kg": "40–55kg", "75–89kg": "55–70kg", "90kg+": "70–90kg" } },
      { name: "Weighted Pull-Up", note: "Lat width", alternatives: ["Lat Pulldown", "Assisted Pull-Up"], sets: "3", reps: "8–10", rest: "2 min", weight: { "Under 60kg": "Bodyweight", "60–74kg": "BW or +5kg", "75–89kg": "+5–10kg", "90kg+": "+10–15kg" } },
      { name: "Incline DB Press", note: "Upper chest isolation", alternatives: ["Incline Cable Fly", "Incline Machine Press"], sets: "3", reps: "10–12", rest: "90s", weight: { "Under 60kg": "14–18kg ea", "60–74kg": "18–24kg ea", "75–89kg": "24–30kg ea", "90kg+": "30–36kg ea" } },
      { name: "Cable Face Pull", note: "Rear delt + rotator cuff", alternatives: ["Band Face Pull", "Rear Delt Fly"], sets: "3", reps: "15–20", rest: "60s", weight: { "Under 60kg": "10–15kg", "60–74kg": "15–20kg", "75–89kg": "20–25kg", "90kg+": "25–30kg" } },
    ],
  },
  "lower-a": {
    label: "Lower A", tag: "Quad Focus", focus: "Quad-dominant. Build strength in the squat pattern.",
    exercises: [
      { name: "Barbell Back Squat", note: "King of leg exercises", alternatives: ["Goblet Squat", "Hack Squat Machine"], sets: "4", reps: "6–8", rest: "3 min", weight: { "Under 60kg": "40–60kg", "60–74kg": "60–90kg", "75–89kg": "90–120kg", "90kg+": "120–150kg" } },
      { name: "Romanian Deadlift", note: "Hamstring stretch + glute", alternatives: ["Dumbbell RDL", "Cable Pull-Through"], sets: "3", reps: "10–12", rest: "2 min", weight: { "Under 60kg": "40–60kg", "60–74kg": "60–80kg", "75–89kg": "80–100kg", "90kg+": "100–130kg" } },
      { name: "Leg Press", note: "Quad volume top-up", alternatives: ["Front Squat", "Belt Squat"], sets: "3", reps: "12–15", rest: "90s", weight: { "Under 60kg": "80–120kg", "60–74kg": "120–160kg", "75–89kg": "160–200kg", "90kg+": "200–260kg" } },
      { name: "Walking Lunges", note: "Quad + glute balance", alternatives: ["Reverse Lunge", "Step-Ups"], sets: "3", reps: "12/leg", rest: "90s", weight: { "Under 60kg": "BW–10kg DBs", "60–74kg": "10–16kg DBs", "75–89kg": "16–22kg DBs", "90kg+": "22–28kg DBs" } },
      { name: "Seated Leg Curl", note: "Hamstring isolation", alternatives: ["Lying Leg Curl", "Nordic Curl"], sets: "3", reps: "12–15", rest: "60s", weight: { "Under 60kg": "25–40kg", "60–74kg": "40–55kg", "75–89kg": "55–70kg", "90kg+": "70–85kg" } },
      { name: "Standing Calf Raise", note: "Gastrocnemius", alternatives: ["Leg Press Calf Raise", "Donkey Calf Raise"], sets: "4", reps: "15–20", rest: "60s", weight: { "Under 60kg": "BW–20kg", "60–74kg": "20–40kg", "75–89kg": "40–60kg", "90kg+": "60–80kg" } },
    ],
  },
  "upper-b": {
    label: "Upper B", tag: "Hypertrophy Focus", focus: "Higher volume, moderate loads. More isolation work.",
    exercises: [
      { name: "Incline DB Press", note: "Upper chest emphasis", alternatives: ["Incline Barbell Press", "Cable Incline Fly"], sets: "4", reps: "10–12", rest: "90s", weight: { "Under 60kg": "14–18kg ea", "60–74kg": "18–24kg ea", "75–89kg": "24–30kg ea", "90kg+": "30–36kg ea" } },
      { name: "Chest-Supported DB Row", note: "Eliminates lower back fatigue", alternatives: ["Seated Cable Row", "T-Bar Row"], sets: "4", reps: "10–12", rest: "90s", weight: { "Under 60kg": "14–20kg ea", "60–74kg": "20–26kg ea", "75–89kg": "26–34kg ea", "90kg+": "34–42kg ea" } },
      { name: "Cable Lateral Raise", note: "Medial delt width", alternatives: ["DB Lateral Raise", "Machine Lateral Raise"], sets: "4", reps: "15–20", rest: "60s", weight: { "Under 60kg": "5–8kg", "60–74kg": "8–12kg", "75–89kg": "12–16kg", "90kg+": "16–20kg" } },
      { name: "Seated Cable Row (wide grip)", note: "Mid-back + rear delt", alternatives: ["Wide Grip Lat Pulldown", "Straight Arm Pulldown"], sets: "3", reps: "12–15", rest: "90s", weight: { "Under 60kg": "30–45kg", "60–74kg": "45–60kg", "75–89kg": "60–75kg", "90kg+": "75–90kg" } },
      { name: "Tricep Rope Pushdown", note: "Tricep isolation", alternatives: ["Overhead Tricep Extension", "Close-Grip Bench Press"], sets: "3", reps: "12–15", rest: "60s", weight: { "Under 60kg": "15–25kg", "60–74kg": "25–35kg", "75–89kg": "35–45kg", "90kg+": "45–55kg" } },
      { name: "Incline DB Curl", note: "Long head stretch", alternatives: ["Preacher Curl", "Cable Curl"], sets: "3", reps: "12–15", rest: "60s", weight: { "Under 60kg": "8–12kg ea", "60–74kg": "12–16kg ea", "75–89kg": "16–20kg ea", "90kg+": "20–24kg ea" } },
      { name: "Rear Delt Fly", note: "Rear delt + posture", alternatives: ["Reverse Pec Deck", "Band Pull-Apart"], sets: "3", reps: "15–20", rest: "60s", weight: { "Under 60kg": "6–10kg ea", "60–74kg": "10–14kg ea", "75–89kg": "14–18kg ea", "90kg+": "18–22kg ea" } },
    ],
  },
  "lower-b": {
    label: "Lower B", tag: "Posterior Focus", focus: "Hip-dominant. Deadlift pattern + hamstring volume.",
    exercises: [
      { name: "Conventional Deadlift", note: "Full posterior chain", alternatives: ["Trap Bar Deadlift", "Sumo Deadlift"], sets: "4", reps: "5–6", rest: "3 min", weight: { "Under 60kg": "60–80kg", "60–74kg": "80–110kg", "75–89kg": "110–140kg", "90kg+": "140–180kg" } },
      { name: "Hack Squat", note: "Quad volume", alternatives: ["Leg Press", "Front Squat"], sets: "3", reps: "12–15", rest: "90s", weight: { "Under 60kg": "40–70kg", "60–74kg": "70–100kg", "75–89kg": "100–140kg", "90kg+": "140–180kg" } },
      { name: "Bulgarian Split Squat", note: "Unilateral balance + glutes", alternatives: ["Reverse Lunge", "Single-Leg Leg Press"], sets: "3", reps: "10/leg", rest: "2 min", weight: { "Under 60kg": "BW–8kg DBs", "60–74kg": "8–16kg DBs", "75–89kg": "16–24kg DBs", "90kg+": "24–32kg DBs" } },
      { name: "Lying Leg Curl", note: "Hamstring isolation", alternatives: ["Seated Leg Curl", "Nordic Curl"], sets: "4", reps: "12–15", rest: "60s", weight: { "Under 60kg": "25–40kg", "60–74kg": "40–55kg", "75–89kg": "55–70kg", "90kg+": "70–85kg" } },
      { name: "Hip Thrust", note: "Glute peak contraction", alternatives: ["Glute Bridge", "Cable Kickback"], sets: "3", reps: "12–15", rest: "90s", weight: { "Under 60kg": "40–60kg", "60–74kg": "60–80kg", "75–89kg": "80–100kg", "90kg+": "100–130kg" } },
      { name: "Seated Calf Raise", note: "Soleus focus", alternatives: ["Standing Calf Raise", "Leg Press Calf Raise"], sets: "4", reps: "15–20", rest: "60s", weight: { "Under 60kg": "20–35kg", "60–74kg": "35–50kg", "75–89kg": "50–65kg", "90kg+": "65–80kg" } },
    ],
  },
};

// ─── Storage ──────────────────────────────────────────────────────────────────

const LS = {
  get: (k, fb = null) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const todayStr = () => new Date().toISOString().slice(0, 10);

// ─── Small components ─────────────────────────────────────────────────────────

const Pill = ({ active, onClick, children, style = {} }) => (
  <button onClick={onClick} style={{ padding: "8px 16px", border: `1px solid ${active ? "#111" : "#ddd"}`, background: active ? "#111" : "#fff", color: active ? "#fff" : "#555", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif", borderRadius: 2, fontWeight: active ? 700 : 400, ...style }}>
    {children}
  </button>
);

const Btn = ({ onClick, children, variant = "primary", style = {}, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "10px 22px", background: variant === "primary" ? "#111" : "#fff", color: variant === "primary" ? "#fff" : "#111", border: "1px solid #111", cursor: disabled ? "default" : "pointer", fontSize: 13, fontFamily: "Georgia, serif", fontWeight: 600, borderRadius: 2, opacity: disabled ? 0.4 : 1, ...style }}>
    {children}
  </button>
);

const Label = ({ children, style = {} }) => (
  <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", margin: "24px 0 10px", ...style }}>{children}</div>
);

// ─── App ──────────────────────────────────────────────────────────────────────

export default function GymRoutine() {
  const [step, setStep] = useState(() => LS.get("gym_step", 1));
  const [weightClass, setWeightClass] = useState(() => LS.get("gym_wc", null));
  const [selectedDays, setSelectedDays] = useState(() => LS.get("gym_days", []));
  const [activeSession, setActiveSession] = useState(() => LS.get("gym_session", "upper-a"));
  const [swaps, setSwaps] = useState(() => LS.get("gym_swaps", {}));
  const [showAlts, setShowAlts] = useState({});
  const [view, setView] = useState("routine"); // routine | log | history
  const [workoutLog, setWorkoutLog] = useState(() => LS.get("gym_log", {}));
  const [activeLog, setActiveLog] = useState(() => LS.get("gym_activeLog", null));
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => { LS.set("gym_step", step); }, [step]);
  useEffect(() => { LS.set("gym_wc", weightClass); }, [weightClass]);
  useEffect(() => { LS.set("gym_days", selectedDays); }, [selectedDays]);
  useEffect(() => { LS.set("gym_session", activeSession); }, [activeSession]);
  useEffect(() => { LS.set("gym_swaps", swaps); }, [swaps]);
  useEffect(() => { LS.set("gym_log", workoutLog); }, [workoutLog]);
  useEffect(() => { LS.set("gym_activeLog", activeLog); }, [activeLog]);

  const assignedSessions = selectedDays.slice(0, 4).map((day, i) => ({ day, sessionId: SESSION_ORDER[i] }));
  const getExName = (sid, idx) => swaps[`${sid}-${idx}`] || exerciseData[sid].exercises[idx].name;
  const toggleDay = (day) => setSelectedDays(p => p.includes(day) ? p.filter(d => d !== day) : p.length < 4 ? [...p, day] : p);

  // ── Log helpers ──

  const startLog = (sid) => {
    const sets = {};
    exerciseData[sid].exercises.forEach((ex, i) => {
      sets[`${sid}-${i}`] = Array.from({ length: parseInt(ex.sets) || 3 }, () => ({ weight: "", reps: "", done: false }));
    });
    setActiveLog({ sessionId: sid, date: todayStr(), sets, startedAt: new Date().toISOString() });
    setView("log");
  };

  const updateSet = (exKey, setIdx, field, val) =>
    setActiveLog(p => ({ ...p, sets: { ...p.sets, [exKey]: p.sets[exKey].map((s, i) => i === setIdx ? { ...s, [field]: val } : s) } }));

  const toggleDone = (exKey, setIdx) =>
    setActiveLog(p => ({ ...p, sets: { ...p.sets, [exKey]: p.sets[exKey].map((s, i) => i === setIdx ? { ...s, done: !s.done } : s) } }));

  const addSet = (exKey, sid, exIdx) => {
    setActiveLog(p => {
      const prev = p.sets[exKey] || [];
      const last = prev[prev.length - 1] || { weight: "", reps: "" };
      return { ...p, sets: { ...p.sets, [exKey]: [...prev, { weight: last.weight, reps: last.reps, done: false }] } };
    });
  };

  const removeSet = (exKey, setIdx) =>
    setActiveLog(p => ({ ...p, sets: { ...p.sets, [exKey]: p.sets[exKey].length > 1 ? p.sets[exKey].filter((_, i) => i !== setIdx) : p.sets[exKey] } }));

  const finishWorkout = () => {
    const key = `${activeLog.sessionId}-${Date.now()}`;
    setWorkoutLog(p => ({ ...p, [key]: { ...activeLog, finishedAt: new Date().toISOString() } }));
    setActiveLog(null);
    setView("history");
  };

  const discardLog = () => { setActiveLog(null); setView("routine"); };

  const allLogs = Object.entries(workoutLog).sort((a, b) => b[1].finishedAt.localeCompare(a[1].finishedAt));
  const pct = (log) => { const all = Object.values(log.sets || {}).flat(); return all.length ? Math.round(all.filter(s => s.done).length / all.length * 100) : 0; };
  const vol = (log) => Math.round(Object.values(log.sets || {}).flat().filter(s => s.done && s.weight && s.reps).reduce((sum, s) => sum + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0));

  // ── Shared header ──

  const Header = () => (
    <div style={{ background: "#111", color: "#f8f7f4", padding: "28px 24px 20px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Hypertrophy Program</div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 32px)", fontWeight: 700, margin: "0 0 3px", letterSpacing: "-0.5px" }}>Upper / Lower Split</h1>
        {step === 3 && <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 14px", fontStyle: "italic" }}>{weightClass} · {selectedDays.length} days/week</p>}
        {step === 3 && (
          <div style={{ display: "flex", gap: 6 }}>
            {["routine", "history"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "5px 14px", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "Georgia, serif", cursor: "pointer", background: view === v || (v === "routine" && view === "log") ? "#fff" : "transparent", color: view === v || (v === "routine" && view === "log") ? "#111" : "#aaa", border: `1px solid ${view === v || (v === "routine" && view === "log") ? "#fff" : "#555"}`, borderRadius: 2 }}>{v}</button>
            ))}
            {activeLog && <span style={{ padding: "5px 10px", fontSize: 11, background: "#4caf50", color: "#fff", borderRadius: 2, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }} onClick={() => setView("log")}>● Active</span>}
          </div>
        )}
      </div>
    </div>
  );

  // ── Step 1 ──

  if (step === 1) return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
      <Header />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 48px" }}>
        <Label>Step 1 of 2 — Your weight class</Label>
        <p style={{ fontSize: 14, color: "#555", marginBottom: 18, lineHeight: 1.7 }}>This determines starting weight ranges for each exercise.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
          {WEIGHT_CLASSES.map(wc => <Pill key={wc.label} active={weightClass === wc.label} onClick={() => setWeightClass(wc.label)} style={{ padding: "14px 16px", textAlign: "left", width: "100%" }}>{wc.label}</Pill>)}
        </div>
        <Btn onClick={() => weightClass && setStep(2)} disabled={!weightClass}>Continue →</Btn>
      </div>
    </div>
  );

  // ── Step 2 ──

  if (step === 2) {
    const count = selectedDays.length;
    return (
      <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
        <Header />
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 48px" }}>
          <Label>Step 2 of 2 — Pick your training days</Label>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 18, lineHeight: 1.7 }}>Select 3 or 4 days. Sessions assigned: Upper A → Lower A → Upper B → Lower B.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {DAYS_OF_WEEK.map(day => <Pill key={day} active={selectedDays.includes(day)} onClick={() => toggleDay(day)}>{day}</Pill>)}
          </div>
          {count > 0 && (
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderLeft: "3px solid #111", padding: "14px 18px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Your schedule</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 6 }}>
                {assignedSessions.map(({ day, sessionId }) => (
                  <div key={day} style={{ fontSize: 13 }}><span style={{ fontWeight: 700 }}>{day}</span><span style={{ color: "#888", marginLeft: 6 }}>{SESSION_LABELS[sessionId]}</span></div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setStep(1)} variant="secondary">← Back</Btn>
            <Btn onClick={() => { if (count >= 3) { setActiveSession(assignedSessions[0]?.sessionId || "upper-a"); setStep(3); setView("routine"); } }} disabled={count < 3}>View My Routine →</Btn>
          </div>
          {count > 0 && count < 3 && <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>Select at least 3 days</p>}
        </div>
      </div>
    );
  }

  // ── Log view ──

  if (view === "log" && activeLog) {
    const sid = activeLog.sessionId;
    const session = exerciseData[sid];
    const allSets = Object.values(activeLog.sets).flat();
    const doneSets = allSets.filter(s => s.done).length;
    const totalSets = allSets.length;

    return (
      <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
        <div style={{ background: "#111", color: "#f8f7f4", padding: "24px 24px 16px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 4 }}>Logging · {activeLog.date}</div>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 2px", letterSpacing: "-0.5px" }}>{session.label}</h1>
                <p style={{ color: "#aaa", fontSize: 13, margin: 0, fontStyle: "italic" }}>{session.tag}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 26, fontWeight: 700 }}>{doneSets}<span style={{ fontSize: 14, color: "#666" }}>/{totalSets}</span></div>
                <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>sets done</div>
              </div>
            </div>
            <div style={{ height: 3, background: "#333", borderRadius: 2, marginTop: 14 }}>
              <div style={{ height: 3, background: "#4caf50", borderRadius: 2, width: `${totalSets ? doneSets / totalSets * 100 : 0}%`, transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 80px" }}>
          {session.exercises.map((ex, exIdx) => {
            const exKey = `${sid}-${exIdx}`;
            const exName = getExName(sid, exIdx);
            const sets = activeLog.sets[exKey] || [];
            const allDone = sets.length > 0 && sets.every(s => s.done);
            return (
              <div key={exIdx} style={{ background: "#fff", border: `1px solid ${allDone ? "#a5d6a7" : "#e5e5e5"}`, marginTop: 14, transition: "border-color 0.2s" }}>
                <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #f5f5f5", background: allDone ? "#f1f8f1" : "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                  <div>
                    <span style={{ fontSize: 10, color: "#ccc", fontFamily: "monospace", marginRight: 6 }}>{String(exIdx + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{exName}</span>
                    {allDone && <span style={{ marginLeft: 8, fontSize: 10, background: "#a5d6a7", color: "#1b5e20", padding: "2px 6px", borderRadius: 2, fontWeight: 700 }}>done</span>}
                    {weightClass && <div style={{ fontSize: 11, color: "#aaa", marginTop: 2, paddingLeft: 22 }}>Target: {ex.weight[weightClass]}</div>}
                  </div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{ex.sets} × {ex.reps}</div>
                </div>
                <div style={{ padding: "10px 16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 1fr 34px 28px", gap: 5, marginBottom: 5, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "#ccc", textTransform: "uppercase", letterSpacing: 1 }}>#</span>
                    <span style={{ fontSize: 10, color: "#bbb", textTransform: "uppercase", letterSpacing: 1 }}>kg</span>
                    <span style={{ fontSize: 10, color: "#bbb", textTransform: "uppercase", letterSpacing: 1 }}>reps</span>
                    <span style={{ fontSize: 10, color: "#bbb", textTransform: "uppercase", letterSpacing: 1 }}>✓</span>
                    <span />
                  </div>
                  {sets.map((set, setIdx) => (
                    <div key={setIdx} style={{ display: "grid", gridTemplateColumns: "24px 1fr 1fr 34px 28px", gap: 5, alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "#aaa", fontWeight: 700 }}>{setIdx + 1}</span>
                      <input type="number" inputMode="decimal" placeholder="—" value={set.weight} onChange={e => updateSet(exKey, setIdx, "weight", e.target.value)}
                        style={{ border: "1px solid #e0e0e0", padding: "7px 8px", fontSize: 14, fontFamily: "Georgia, serif", background: set.done ? "#f1f8f1" : "#fff", borderRadius: 2, width: "100%", boxSizing: "border-box" }} />
                      <input type="number" inputMode="numeric" placeholder="—" value={set.reps} onChange={e => updateSet(exKey, setIdx, "reps", e.target.value)}
                        style={{ border: "1px solid #e0e0e0", padding: "7px 8px", fontSize: 14, fontFamily: "Georgia, serif", background: set.done ? "#f1f8f1" : "#fff", borderRadius: 2, width: "100%", boxSizing: "border-box" }} />
                      <button onClick={() => toggleDone(exKey, setIdx)} style={{ width: 32, height: 32, border: `2px solid ${set.done ? "#4caf50" : "#ddd"}`, background: set.done ? "#4caf50" : "#fff", cursor: "pointer", borderRadius: 2, fontSize: 14, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                        {set.done ? "✓" : ""}
                      </button>
                      <button onClick={() => removeSet(exKey, setIdx)} style={{ width: 26, height: 26, border: "1px solid #eee", background: "#fff", cursor: "pointer", borderRadius: 2, fontSize: 15, color: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                  ))}
                  <button onClick={() => addSet(exKey, sid, exIdx)} style={{ marginTop: 4, fontSize: 12, color: "#888", background: "none", border: "1px dashed #ddd", cursor: "pointer", padding: "5px 12px", borderRadius: 2, width: "100%", fontFamily: "Georgia, serif" }}>+ add set</button>
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn onClick={finishWorkout} style={{ flex: 1 }}>Finish Workout</Btn>
            <Btn onClick={discardLog} variant="secondary">Discard</Btn>
          </div>
        </div>
      </div>
    );
  }

  // ── History view ──

  if (view === "history") {
    return (
      <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
        <Header />
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 48px" }}>
          <Label>Workout history</Label>
          {allLogs.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", padding: "40px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
              <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>No workouts logged yet. Hit "Start Workout" from the Routine tab.</p>
            </div>
          ) : allLogs.map(([key, log]) => {
            const session = exerciseData[log.sessionId];
            const doneSets = Object.values(log.sets || {}).flat().filter(s => s.done).length;
            const totalSets = Object.values(log.sets || {}).flat().length;
            const p = pct(log);
            const v = vol(log);
            const isExpanded = expandedLog === key;
            return (
              <div key={key} style={{ background: "#fff", border: "1px solid #e5e5e5", marginBottom: 8 }}>
                <div onClick={() => setExpandedLog(isExpanded ? null : key)} style={{ padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{session?.label}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>{log.date} · {new Date(log.finishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{doneSets}/{totalSets} sets</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{p}% complete</div>
                    </div>
                    {v > 0 && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{v.toLocaleString()}kg</div>
                        <div style={{ fontSize: 11, color: "#aaa" }}>volume</div>
                      </div>
                    )}
                    <span style={{ color: "#ccc", fontSize: 18 }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>
                <div style={{ height: 3, background: "#f0f0f0" }}>
                  <div style={{ height: 3, background: "#4caf50", width: `${p}%` }} />
                </div>
                {isExpanded && (
                  <div style={{ padding: "12px 18px", borderTop: "1px solid #f5f5f5" }}>
                    {session?.exercises.map((ex, exIdx) => {
                      const exKey = `${log.sessionId}-${exIdx}`;
                      const sets = (log.sets || {})[exKey] || [];
                      const done = sets.filter(s => s.done);
                      if (!done.length) return null;
                      return (
                        <div key={exIdx} style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{ex.name}</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {done.map((s, i) => (
                              <span key={i} style={{ fontSize: 11, background: "#f5f5f5", border: "1px solid #eee", padding: "3px 8px", borderRadius: 2, color: "#555" }}>
                                Set {i + 1}: {s.weight || "?"}kg × {s.reps || "?"}
                              </span>
                            ))}
                          </div>
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

  // ── Routine view ──

  const currentSession = exerciseData[activeSession];
  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
      <Header />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 48px" }}>
        <Label>Your week</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginBottom: 22 }}>
          {DAYS_OF_WEEK.map(day => {
            const a = assignedSessions.find(s => s.day === day);
            return (
              <div key={day} onClick={() => a && setActiveSession(a.sessionId)} style={{ background: a ? "#111" : "#fff", border: "1px solid #e5e5e5", borderTop: a && activeSession === a.sessionId ? "3px solid #888" : "1px solid #e5e5e5", padding: "10px 4px", textAlign: "center", cursor: a ? "pointer" : "default" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: a ? "#aaa" : "#bbb", textTransform: "uppercase", marginBottom: 3 }}>{day}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: a ? "#fff" : "#ddd", lineHeight: 1.3 }}>{a ? SESSION_LABELS[a.sessionId] : "Rest"}</div>
              </div>
            );
          })}
        </div>

        <Label style={{ marginTop: 0 }}>Sessions</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 2 }}>
          {SESSION_ORDER.map(sid => <Pill key={sid} active={activeSession === sid} onClick={() => setActiveSession(sid)}>{SESSION_LABELS[sid]}</Pill>)}
        </div>

        {currentSession && (
          <div style={{ background: "#fff", border: "1px solid #e5e5e5", marginBottom: 14 }}>
            <div style={{ padding: "14px 18px 10px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
              <div>
                <h2 style={{ margin: "0 0 3px", fontSize: 17, fontWeight: 700 }}>{currentSession.label}</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#777", fontStyle: "italic" }}>{currentSession.focus}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 10px", background: "#f5f5f5", color: "#555", borderRadius: 2 }}>{currentSession.tag}</span>
            </div>
            {currentSession.exercises.map((ex, i) => {
              const key = `${activeSession}-${i}`;
              const displayName = getExName(activeSession, i);
              const isSwapped = !!swaps[key];
              return (
                <div key={i} style={{ borderBottom: i < currentSession.exercises.length - 1 ? "1px solid #f5f5f5" : "none", padding: "12px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#ccc", fontFamily: "monospace" }}>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{displayName}</span>
                        {isSwapped && <span style={{ fontSize: 10, background: "#e8f4e8", color: "#2d6a2d", padding: "2px 6px", borderRadius: 2, fontWeight: 600 }}>swapped</span>}
                      </div>
                      {ex.note && <div style={{ fontSize: 12, color: "#999", paddingLeft: 26, fontStyle: "italic", marginBottom: 2 }}>{ex.note}</div>}
                      {weightClass && <div style={{ fontSize: 12, color: "#555", paddingLeft: 26, marginBottom: 3 }}><span style={{ color: "#aaa" }}>Start: </span><strong>{ex.weight[weightClass]}</strong></div>}
                      <button onClick={() => setShowAlts(p => ({ ...p, [key]: !p[key] }))} style={{ marginLeft: 26, fontSize: 11, color: "#888", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>
                        {showAlts[key] ? "hide" : "swap exercise"}
                      </button>
                      {showAlts[key] && (
                        <div style={{ paddingLeft: 26, marginTop: 6, display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {ex.alternatives.map(alt => (
                            <button key={alt} onClick={() => { setSwaps(p => ({ ...p, [key]: alt })); setShowAlts(p => ({ ...p, [key]: false })); }}
                              style={{ padding: "4px 10px", background: "#f0f0f0", border: "1px solid #e0e0e0", fontSize: 12, cursor: "pointer", borderRadius: 2, color: "#444" }}>{alt}</button>
                          ))}
                          {isSwapped && <button onClick={() => setSwaps(p => { const n = { ...p }; delete n[key]; return n; })}
                            style={{ padding: "4px 10px", background: "#fff0f0", border: "1px solid #f5c6c6", fontSize: 12, cursor: "pointer", borderRadius: 2, color: "#a33" }}>restore original</button>}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{ex.sets} × {ex.reps}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>rest {ex.rest}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Btn onClick={() => startLog(activeSession)} style={{ width: "100%", padding: "14px", fontSize: 14, letterSpacing: 0.5 }}>
          Start {SESSION_LABELS[activeSession]} Workout →
        </Btn>

        <div style={{ marginTop: 14, padding: "13px 16px", background: "#111", color: "#f8f7f4", fontSize: 13, lineHeight: 1.7 }}>
          <strong>Progression:</strong> Add weight or reps every 1–2 weeks. Log every session to track progress.
        </div>

        <button onClick={() => setStep(2)} style={{ marginTop: 12, fontSize: 12, color: "#999", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "Georgia, serif" }}>
          ← Change days or weight class
        </button>
      </div>
    </div>
  );
}