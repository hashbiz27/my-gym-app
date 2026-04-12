import { useState } from "react";

const WEIGHT_CLASSES = [
  { label: "Under 60kg", min: 0, max: 59 },
  { label: "60–74kg", min: 60, max: 74 },
  { label: "75–89kg", min: 75, max: 89 },
  { label: "90kg+", min: 90, max: 999 },
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const exerciseData = {
  "upper-a": {
    label: "Upper A",
    tag: "Strength Focus",
    focus: "Compound-heavy. Heavier loads, lower reps.",
    exercises: [
      {
        name: "Barbell Bench Press",
        note: "Primary chest driver",
        alternatives: ["Dumbbell Bench Press", "Smith Machine Bench Press"],
        sets: "4",
        reps: { default: "6–8", light: "8–10", heavy: "5–6" },
        rest: "2–3 min",
        weight: {
          "Under 60kg": "40–60kg",
          "60–74kg": "60–80kg",
          "75–89kg": "80–100kg",
          "90kg+": "100–120kg",
        },
      },
      {
        name: "Barbell Bent-Over Row",
        note: "Upper back thickness",
        alternatives: ["Dumbbell Row", "Cable Row"],
        sets: "4",
        reps: { default: "6–8", light: "8–10", heavy: "5–6" },
        rest: "2–3 min",
        weight: {
          "Under 60kg": "35–55kg",
          "60–74kg": "55–75kg",
          "75–89kg": "75–95kg",
          "90kg+": "95–115kg",
        },
      },
      {
        name: "Overhead Press",
        note: "Front delt + upper chest",
        alternatives: ["Arnold Press", "Seated DB Shoulder Press"],
        sets: "3",
        reps: { default: "8–10", light: "10–12", heavy: "6–8" },
        rest: "2 min",
        weight: {
          "Under 60kg": "25–40kg",
          "60–74kg": "40–55kg",
          "75–89kg": "55–70kg",
          "90kg+": "70–90kg",
        },
      },
      {
        name: "Weighted Pull-Up",
        note: "Lat width",
        alternatives: ["Lat Pulldown", "Assisted Pull-Up"],
        sets: "3",
        reps: { default: "8–10", light: "10–12", heavy: "6–8" },
        rest: "2 min",
        weight: {
          "Under 60kg": "Bodyweight",
          "60–74kg": "BW or +5kg",
          "75–89kg": "+5–10kg",
          "90kg+": "+10–15kg",
        },
      },
      {
        name: "Incline DB Press",
        note: "Upper chest isolation",
        alternatives: ["Incline Cable Fly", "Incline Machine Press"],
        sets: "3",
        reps: { default: "10–12", light: "12–15", heavy: "8–10" },
        rest: "90s",
        weight: {
          "Under 60kg": "14–18kg each",
          "60–74kg": "18–24kg each",
          "75–89kg": "24–30kg each",
          "90kg+": "30–36kg each",
        },
      },
      {
        name: "Cable Face Pull",
        note: "Rear delt + rotator cuff health",
        alternatives: ["Band Face Pull", "Rear Delt Fly"],
        sets: "3",
        reps: { default: "15–20", light: "20–25", heavy: "12–15" },
        rest: "60s",
        weight: {
          "Under 60kg": "10–15kg",
          "60–74kg": "15–20kg",
          "75–89kg": "20–25kg",
          "90kg+": "25–30kg",
        },
      },
    ],
  },
  "lower-a": {
    label: "Lower A",
    tag: "Quad Focus",
    focus: "Quad-dominant. Build strength in the squat pattern.",
    exercises: [
      {
        name: "Barbell Back Squat",
        note: "King of leg exercises",
        alternatives: ["Goblet Squat", "Hack Squat Machine"],
        sets: "4",
        reps: { default: "6–8", light: "8–10", heavy: "5–6" },
        rest: "3 min",
        weight: {
          "Under 60kg": "40–60kg",
          "60–74kg": "60–90kg",
          "75–89kg": "90–120kg",
          "90kg+": "120–150kg",
        },
      },
      {
        name: "Romanian Deadlift",
        note: "Hamstring stretch + glute",
        alternatives: ["Dumbbell RDL", "Cable Pull-Through"],
        sets: "3",
        reps: { default: "10–12", light: "12–15", heavy: "8–10" },
        rest: "2 min",
        weight: {
          "Under 60kg": "40–60kg",
          "60–74kg": "60–80kg",
          "75–89kg": "80–100kg",
          "90kg+": "100–130kg",
        },
      },
      {
        name: "Leg Press",
        note: "Quad volume top-up",
        alternatives: ["Front Squat", "Belt Squat"],
        sets: "3",
        reps: { default: "12–15", light: "15–20", heavy: "10–12" },
        rest: "90s",
        weight: {
          "Under 60kg": "80–120kg",
          "60–74kg": "120–160kg",
          "75–89kg": "160–200kg",
          "90kg+": "200–260kg",
        },
      },
      {
        name: "Walking Lunges",
        note: "Quad + glute balance",
        alternatives: ["Reverse Lunge", "Step-Ups"],
        sets: "3",
        reps: { default: "12/leg", light: "15/leg", heavy: "10/leg" },
        rest: "90s",
        weight: {
          "Under 60kg": "Bodyweight–10kg DBs",
          "60–74kg": "10–16kg DBs",
          "75–89kg": "16–22kg DBs",
          "90kg+": "22–28kg DBs",
        },
      },
      {
        name: "Seated Leg Curl",
        note: "Hamstring isolation",
        alternatives: ["Lying Leg Curl", "Nordic Curl"],
        sets: "3",
        reps: { default: "12–15", light: "15–20", heavy: "10–12" },
        rest: "60s",
        weight: {
          "Under 60kg": "25–40kg",
          "60–74kg": "40–55kg",
          "75–89kg": "55–70kg",
          "90kg+": "70–85kg",
        },
      },
      {
        name: "Standing Calf Raise",
        note: "Gastrocnemius",
        alternatives: ["Leg Press Calf Raise", "Donkey Calf Raise"],
        sets: "4",
        reps: { default: "15–20", light: "20–25", heavy: "12–15" },
        rest: "60s",
        weight: {
          "Under 60kg": "Bodyweight–20kg",
          "60–74kg": "20–40kg",
          "75–89kg": "40–60kg",
          "90kg+": "60–80kg",
        },
      },
    ],
  },
  "upper-b": {
    label: "Upper B",
    tag: "Hypertrophy Focus",
    focus: "Higher volume, moderate loads. More isolation work.",
    exercises: [
      {
        name: "Incline DB Press",
        note: "Upper chest emphasis",
        alternatives: ["Incline Barbell Press", "Cable Incline Fly"],
        sets: "4",
        reps: { default: "10–12", light: "12–15", heavy: "8–10" },
        rest: "90s",
        weight: {
          "Under 60kg": "14–18kg each",
          "60–74kg": "18–24kg each",
          "75–89kg": "24–30kg each",
          "90kg+": "30–36kg each",
        },
      },
      {
        name: "Chest-Supported DB Row",
        note: "Eliminates lower back fatigue",
        alternatives: ["Seated Cable Row", "T-Bar Row"],
        sets: "4",
        reps: { default: "10–12", light: "12–15", heavy: "8–10" },
        rest: "90s",
        weight: {
          "Under 60kg": "14–20kg each",
          "60–74kg": "20–26kg each",
          "75–89kg": "26–34kg each",
          "90kg+": "34–42kg each",
        },
      },
      {
        name: "Cable Lateral Raise",
        note: "Medial delt width",
        alternatives: ["DB Lateral Raise", "Machine Lateral Raise"],
        sets: "4",
        reps: { default: "15–20", light: "20–25", heavy: "12–15" },
        rest: "60s",
        weight: {
          "Under 60kg": "5–8kg",
          "60–74kg": "8–12kg",
          "75–89kg": "12–16kg",
          "90kg+": "16–20kg",
        },
      },
      {
        name: "Seated Cable Row (wide grip)",
        note: "Mid-back + rear delt",
        alternatives: ["Wide Grip Lat Pulldown", "Straight Arm Pulldown"],
        sets: "3",
        reps: { default: "12–15", light: "15–18", heavy: "10–12" },
        rest: "90s",
        weight: {
          "Under 60kg": "30–45kg",
          "60–74kg": "45–60kg",
          "75–89kg": "60–75kg",
          "90kg+": "75–90kg",
        },
      },
      {
        name: "Tricep Rope Pushdown",
        note: "Tricep isolation",
        alternatives: ["Overhead Tricep Extension", "Close-Grip Bench Press"],
        sets: "3",
        reps: { default: "12–15", light: "15–20", heavy: "10–12" },
        rest: "60s",
        weight: {
          "Under 60kg": "15–25kg",
          "60–74kg": "25–35kg",
          "75–89kg": "35–45kg",
          "90kg+": "45–55kg",
        },
      },
      {
        name: "Incline DB Curl",
        note: "Long head stretch",
        alternatives: ["Preacher Curl", "Cable Curl"],
        sets: "3",
        reps: { default: "12–15", light: "15–18", heavy: "10–12" },
        rest: "60s",
        weight: {
          "Under 60kg": "8–12kg each",
          "60–74kg": "12–16kg each",
          "75–89kg": "16–20kg each",
          "90kg+": "20–24kg each",
        },
      },
      {
        name: "Rear Delt Fly",
        note: "Rear delt + posture",
        alternatives: ["Reverse Pec Deck", "Band Pull-Apart"],
        sets: "3",
        reps: { default: "15–20", light: "20–25", heavy: "12–15" },
        rest: "60s",
        weight: {
          "Under 60kg": "6–10kg each",
          "60–74kg": "10–14kg each",
          "75–89kg": "14–18kg each",
          "90kg+": "18–22kg each",
        },
      },
    ],
  },
  "lower-b": {
    label: "Lower B",
    tag: "Posterior Focus",
    focus: "Hip-dominant. Deadlift pattern + hamstring volume.",
    exercises: [
      {
        name: "Conventional Deadlift",
        note: "Full posterior chain",
        alternatives: ["Trap Bar Deadlift", "Sumo Deadlift"],
        sets: "4",
        reps: { default: "5–6", light: "6–8", heavy: "4–5" },
        rest: "3 min",
        weight: {
          "Under 60kg": "60–80kg",
          "60–74kg": "80–110kg",
          "75–89kg": "110–140kg",
          "90kg+": "140–180kg",
        },
      },
      {
        name: "Hack Squat",
        note: "Quad volume",
        alternatives: ["Leg Press", "Front Squat"],
        sets: "3",
        reps: { default: "12–15", light: "15–20", heavy: "10–12" },
        rest: "90s",
        weight: {
          "Under 60kg": "40–70kg",
          "60–74kg": "70–100kg",
          "75–89kg": "100–140kg",
          "90kg+": "140–180kg",
        },
      },
      {
        name: "Bulgarian Split Squat",
        note: "Unilateral balance + glutes",
        alternatives: ["Reverse Lunge", "Single-Leg Leg Press"],
        sets: "3",
        reps: { default: "10/leg", light: "12/leg", heavy: "8/leg" },
        rest: "2 min",
        weight: {
          "Under 60kg": "Bodyweight–8kg DBs",
          "60–74kg": "8–16kg DBs",
          "75–89kg": "16–24kg DBs",
          "90kg+": "24–32kg DBs",
        },
      },
      {
        name: "Lying Leg Curl",
        note: "Hamstring isolation",
        alternatives: ["Seated Leg Curl", "Nordic Curl"],
        sets: "4",
        reps: { default: "12–15", light: "15–20", heavy: "10–12" },
        rest: "60s",
        weight: {
          "Under 60kg": "25–40kg",
          "60–74kg": "40–55kg",
          "75–89kg": "55–70kg",
          "90kg+": "70–85kg",
        },
      },
      {
        name: "Hip Thrust",
        note: "Glute peak contraction",
        alternatives: ["Glute Bridge", "Cable Kickback"],
        sets: "3",
        reps: { default: "12–15", light: "15–18", heavy: "10–12" },
        rest: "90s",
        weight: {
          "Under 60kg": "40–60kg",
          "60–74kg": "60–80kg",
          "75–89kg": "80–100kg",
          "90kg+": "100–130kg",
        },
      },
      {
        name: "Seated Calf Raise",
        note: "Soleus focus",
        alternatives: ["Standing Calf Raise", "Leg Press Calf Raise"],
        sets: "4",
        reps: { default: "15–20", light: "20–25", heavy: "12–15" },
        rest: "60s",
        weight: {
          "Under 60kg": "20–35kg",
          "60–74kg": "35–50kg",
          "75–89kg": "50–65kg",
          "90kg+": "65–80kg",
        },
      },
    ],
  },
};

const SESSION_ORDER = ["upper-a", "lower-a", "upper-b", "lower-b"];
const SESSION_LABELS = {
  "upper-a": "Upper A",
  "lower-a": "Lower A",
  "upper-b": "Upper B",
  "lower-b": "Lower B",
};

export default function GymRoutine() {
  const [weightClass, setWeightClass] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [swappedExercises, setSwappedExercises] = useState({});
  const [showAlts, setShowAlts] = useState({});
  const [step, setStep] = useState(1); // 1=weight, 2=days, 3=routine

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const assignedSessions = selectedDays.slice(0, 4).map((day, i) => ({
    day,
    sessionId: SESSION_ORDER[i % SESSION_ORDER.length],
  }));

  const toggleAlt = (sessionId, exIdx) => {
    const key = `${sessionId}-${exIdx}`;
    setShowAlts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const swapExercise = (sessionId, exIdx, altName) => {
    const key = `${sessionId}-${exIdx}`;
    setSwappedExercises((prev) => ({ ...prev, [key]: altName }));
    setShowAlts((prev) => ({ ...prev, [key]: false }));
  };

  const getExerciseName = (sessionId, exIdx, original) => {
    const key = `${sessionId}-${exIdx}`;
    return swappedExercises[key] || original;
  };

  const currentSession = activeSession ? exerciseData[activeSession] : null;

  const styles = {
    container: {
      fontFamily: "'Georgia', serif",
      background: "#f8f7f4",
      minHeight: "100vh",
      color: "#1a1a1a",
    },
    header: {
      background: "#111",
      color: "#f8f7f4",
      padding: "36px 24px 28px",
    },
    eyebrow: {
      fontSize: 11,
      letterSpacing: 4,
      textTransform: "uppercase",
      color: "#888",
      marginBottom: 10,
    },
    h1: {
      fontSize: "clamp(24px, 5vw, 38px)",
      fontWeight: 700,
      margin: "0 0 6px",
      letterSpacing: "-1px",
    },
    sub: { color: "#aaa", fontSize: 14, margin: 0, fontStyle: "italic" },
    inner: { maxWidth: 680, margin: "0 auto", padding: "0 16px 48px" },
    sectionLabel: {
      fontSize: 11,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: "#888",
      margin: "28px 0 12px",
    },
    card: {
      background: "#fff",
      border: "1px solid #e5e5e5",
      padding: "18px 20px",
      marginBottom: 10,
    },
    pill: (active) => ({
      padding: "8px 16px",
      border: `1px solid ${active ? "#111" : "#ddd"}`,
      background: active ? "#111" : "#fff",
      color: active ? "#fff" : "#555",
      cursor: "pointer",
      fontSize: 13,
      fontFamily: "Georgia, serif",
      borderRadius: 2,
      fontWeight: active ? 700 : 400,
      transition: "all 0.15s",
    }),
    btn: (variant = "primary") => ({
      padding: "10px 22px",
      background: variant === "primary" ? "#111" : "#fff",
      color: variant === "primary" ? "#fff" : "#111",
      border: "1px solid #111",
      cursor: "pointer",
      fontSize: 13,
      fontFamily: "Georgia, serif",
      fontWeight: 600,
      letterSpacing: 0.5,
      borderRadius: 2,
    }),
    exRow: {
      padding: "14px 20px",
      borderBottom: "1px solid #f5f5f5",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 10,
      alignItems: "start",
    },
    altChip: {
      display: "inline-block",
      padding: "4px 10px",
      background: "#f0f0f0",
      border: "1px solid #e0e0e0",
      fontSize: 12,
      cursor: "pointer",
      borderRadius: 2,
      marginRight: 6,
      marginTop: 4,
      color: "#444",
    },
  };

  // Step 1 — Weight class
  if (step === 1) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={styles.eyebrow}>Hypertrophy Program · Setup</div>
            <h1 style={styles.h1}>Upper / Lower Split</h1>
            <p style={styles.sub}>Let's personalise it for you</p>
          </div>
        </div>
        <div style={styles.inner}>
          <div style={styles.sectionLabel}>Step 1 of 2 — Your weight class</div>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 20, lineHeight: 1.7 }}>
            This determines your starting weight ranges for each exercise. You can always adjust up or down.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 28 }}>
            {WEIGHT_CLASSES.map((wc) => (
              <button
                key={wc.label}
                onClick={() => setWeightClass(wc.label)}
                style={{
                  ...styles.pill(weightClass === wc.label),
                  padding: "14px 16px",
                  textAlign: "left",
                  display: "block",
                  width: "100%",
                }}
              >
                {wc.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => weightClass && setStep(2)}
            style={{
              ...styles.btn(),
              opacity: weightClass ? 1 : 0.4,
              cursor: weightClass ? "pointer" : "default",
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // Step 2 — Day selector
  if (step === 2) {
    const count = selectedDays.length;
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={styles.eyebrow}>Hypertrophy Program · Setup</div>
            <h1 style={styles.h1}>Upper / Lower Split</h1>
            <p style={styles.sub}>{weightClass} · Personalised</p>
          </div>
        </div>
        <div style={styles.inner}>
          <div style={styles.sectionLabel}>Step 2 of 2 — Pick your training days</div>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 20, lineHeight: 1.7 }}>
            Select 3 or 4 days. Sessions will be assigned in order: Upper A → Lower A → Upper B → Lower B.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                onClick={() => {
                  if (selectedDays.includes(day)) toggleDay(day);
                  else if (selectedDays.length < 4) toggleDay(day);
                }}
                style={styles.pill(selectedDays.includes(day))}
              >
                {day}
              </button>
            ))}
          </div>

          {count > 0 && (
            <div style={{ ...styles.card, marginBottom: 24, borderLeft: "3px solid #111" }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Your schedule</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
                {assignedSessions.map(({ day, sessionId }) => (
                  <div key={day} style={{ fontSize: 13 }}>
                    <span style={{ fontWeight: 700 }}>{day}</span>
                    <span style={{ color: "#888", marginLeft: 6 }}>{SESSION_LABELS[sessionId]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={styles.btn("secondary")}>← Back</button>
            <button
              onClick={() => {
                if (count >= 3) {
                  setActiveSession(assignedSessions[0]?.sessionId || "upper-a");
                  setStep(3);
                }
              }}
              style={{
                ...styles.btn(),
                opacity: count >= 3 ? 1 : 0.4,
                cursor: count >= 3 ? "pointer" : "default",
              }}
            >
              View My Routine →
            </button>
          </div>
          {count < 3 && count > 0 && (
            <p style={{ fontSize: 12, color: "#999", marginTop: 10 }}>Select at least 3 days</p>
          )}
        </div>
      </div>
    );
  }

  // Step 3 — Routine view
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={styles.eyebrow}>Hypertrophy Program · {weightClass}</div>
          <h1 style={styles.h1}>Upper / Lower Split</h1>
          <p style={styles.sub}>{selectedDays.length} days/week · {weightClass}</p>
        </div>
      </div>

      <div style={styles.inner}>
        {/* Weekly schedule bar */}
        <div style={styles.sectionLabel}>Your week</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginBottom: 24 }}>
          {DAYS_OF_WEEK.map((day) => {
            const assignment = assignedSessions.find((a) => a.day === day);
            return (
              <div
                key={day}
                onClick={() => assignment && setActiveSession(assignment.sessionId)}
                style={{
                  background: assignment ? "#111" : "#fff",
                  border: "1px solid #e5e5e5",
                  padding: "10px 4px",
                  textAlign: "center",
                  cursor: assignment ? "pointer" : "default",
                  borderTop: assignment && activeSession === assignment.sessionId ? "3px solid #666" : "1px solid #e5e5e5",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: assignment ? "#aaa" : "#bbb", textTransform: "uppercase", marginBottom: 3 }}>{day}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: assignment ? "#fff" : "#ddd", lineHeight: 1.3 }}>
                  {assignment ? SESSION_LABELS[assignment.sessionId] : "Rest"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Session tabs */}
        <div style={styles.sectionLabel}>Sessions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 2 }}>
          {SESSION_ORDER.map((sid) => (
            <button
              key={sid}
              onClick={() => setActiveSession(sid)}
              style={styles.pill(activeSession === sid)}
            >
              {SESSION_LABELS[sid]}
            </button>
          ))}
        </div>

        {/* Exercise list */}
        {currentSession && (
          <div style={{ background: "#fff", border: "1px solid #e5e5e5", marginBottom: 24 }}>
            <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <h2 style={{ margin: "0 0 3px", fontSize: 18, fontWeight: 700 }}>{currentSession.label}</h2>
                  <p style={{ margin: 0, fontSize: 13, color: "#777", fontStyle: "italic" }}>{currentSession.focus}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 10px", background: "#f5f5f5", color: "#555", borderRadius: 2 }}>
                  {currentSession.tag}
                </span>
              </div>
            </div>

            {currentSession.exercises.map((ex, i) => {
              const key = `${activeSession}-${i}`;
              const displayName = getExerciseName(activeSession, i, ex.name);
              const isSwapped = swappedExercises[key];
              return (
                <div key={i} style={{ borderBottom: i < currentSession.exercises.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                  <div style={styles.exRow}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#ccc", fontFamily: "monospace" }}>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{displayName}</span>
                        {isSwapped && (
                          <span style={{ fontSize: 10, background: "#e8f4e8", color: "#2d6a2d", padding: "2px 6px", borderRadius: 2, fontWeight: 600 }}>swapped</span>
                        )}
                      </div>
                      {ex.note && <div style={{ fontSize: 12, color: "#999", paddingLeft: 26, fontStyle: "italic", marginBottom: 4 }}>{ex.note}</div>}
                      {weightClass && (
                        <div style={{ fontSize: 12, color: "#555", paddingLeft: 26, marginBottom: 4 }}>
                          <span style={{ color: "#aaa" }}>Starting weight: </span>
                          <strong>{ex.weight[weightClass]}</strong>
                        </div>
                      )}
                      <button
                        onClick={() => toggleAlt(activeSession, i)}
                        style={{ marginLeft: 26, fontSize: 11, color: "#888", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
                      >
                        {showAlts[key] ? "hide alternatives" : "swap exercise"}
                      </button>
                      {showAlts[key] && (
                        <div style={{ paddingLeft: 26, marginTop: 6 }}>
                          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Choose an alternative:</div>
                          {ex.alternatives.map((alt) => (
                            <button key={alt} onClick={() => swapExercise(activeSession, i, alt)} style={styles.altChip}>
                              {alt}
                            </button>
                          ))}
                          {isSwapped && (
                            <button onClick={() => { swapExercise(activeSession, i, null); setSwappedExercises(p => { const n = {...p}; delete n[key]; return n; }); }} style={{ ...styles.altChip, color: "#a33" }}>
                              restore original
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{ex.sets} × {ex.reps.default}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>rest {ex.rest}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Progression note */}
        <div style={{ padding: "14px 18px", background: "#111", color: "#f8f7f4", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          <strong>Progression:</strong> Use double progression — stay in the rep range until you hit the top end for all sets, then add 2.5–5kg. Log every session.
        </div>

        <button onClick={() => setStep(2)} style={{ ...styles.btn("secondary"), fontSize: 12 }}>
          ← Change days or weight class
        </button>
      </div>
    </div>
  );
}