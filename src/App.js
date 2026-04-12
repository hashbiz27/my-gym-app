import { useState } from "react";

const days = [
  {
    id: "upper-a",
    label: "Upper A",
    tag: "Strength Focus",
    tagColor: "#e8f4fd",
    tagText: "#1a6fa8",
    accent: "#1a6fa8",
    focus: "Compound-heavy. Heavier loads, lower reps.",
    exercises: [
      { name: "Barbell Bench Press", sets: "4", reps: "6–8", rest: "2–3 min", note: "Primary chest driver" },
      { name: "Barbell Bent-Over Row", sets: "4", reps: "6–8", rest: "2–3 min", note: "Upper back thickness" },
      { name: "Overhead Press (BB or DB)", sets: "3", reps: "8–10", rest: "2 min", note: "Front delt + upper chest" },
      { name: "Weighted Pull-Up / Lat Pulldown", sets: "3", reps: "8–10", rest: "2 min", note: "Lat width" },
      { name: "Incline DB Press", sets: "3", reps: "10–12", rest: "90s", note: "Upper chest isolation" },
      { name: "Cable Face Pull", sets: "3", reps: "15–20", rest: "60s", note: "Rear delt + rotator cuff health" },
    ],
  },
  {
    id: "lower-a",
    label: "Lower A",
    tag: "Quad Focus",
    tagColor: "#fef3e2",
    tagText: "#b45309",
    accent: "#b45309",
    focus: "Quad-dominant. Build strength in the squat pattern.",
    exercises: [
      { name: "Barbell Back Squat", sets: "4", reps: "6–8", rest: "3 min", note: "King of leg exercises" },
      { name: "Romanian Deadlift", sets: "3", reps: "10–12", rest: "2 min", note: "Hamstring stretch + glute" },
      { name: "Leg Press", sets: "3", reps: "12–15", rest: "90s", note: "Quad volume top-up" },
      { name: "Walking Lunges", sets: "3", reps: "12/leg", rest: "90s", note: "Quad + glute balance" },
      { name: "Seated Leg Curl", sets: "3", reps: "12–15", rest: "60s", note: "Hamstring isolation" },
      { name: "Standing Calf Raise", sets: "4", reps: "15–20", rest: "60s", note: "Gastrocnemius" },
    ],
  },
  {
    id: "upper-b",
    label: "Upper B",
    tag: "Hypertrophy Focus",
    tagColor: "#f0fdf4",
    tagText: "#166534",
    accent: "#166534",
    focus: "Higher volume, moderate loads. More isolation work.",
    exercises: [
      { name: "Incline DB Press", sets: "4", reps: "10–12", rest: "90s", note: "Upper chest emphasis" },
      { name: "Chest-Supported DB Row", sets: "4", reps: "10–12", rest: "90s", note: "Eliminates lower back fatigue" },
      { name: "Cable Lateral Raise", sets: "4", reps: "15–20", rest: "60s", note: "Medial delt width" },
      { name: "Seated Cable Row (wide grip)", sets: "3", reps: "12–15", rest: "90s", note: "Mid-back + rear delt" },
      { name: "Tricep Rope Pushdown", sets: "3", reps: "12–15", rest: "60s", note: "" },
      { name: "Incline DB Curl", sets: "3", reps: "12–15", rest: "60s", note: "Long head stretch" },
      { name: "Rear Delt Fly (cable or DB)", sets: "3", reps: "15–20", rest: "60s", note: "Rear delt + posture" },
    ],
  },
  {
    id: "lower-b",
    label: "Lower B",
    tag: "Posterior Focus",
    tagColor: "#fdf2f8",
    tagText: "#86198f",
    accent: "#86198f",
    focus: "Hip-dominant. Deadlift pattern + hamstring volume.",
    exercises: [
      { name: "Conventional Deadlift", sets: "4", reps: "5–6", rest: "3 min", note: "Full posterior chain" },
      { name: "Hack Squat / Leg Press", sets: "3", reps: "12–15", rest: "90s", note: "Quad volume" },
      { name: "Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "2 min", note: "Unilateral balance + glutes" },
      { name: "Lying Leg Curl", sets: "4", reps: "12–15", rest: "60s", note: "Hamstring isolation" },
      { name: "Hip Thrust (BB or machine)", sets: "3", reps: "12–15", rest: "90s", note: "Glute peak contraction" },
      { name: "Seated Calf Raise", sets: "4", reps: "15–20", rest: "60s", note: "Soleus focus" },
    ],
  },
];

const schedule = [
  { day: "Mon", session: "Upper A", color: "#1a6fa8" },
  { day: "Tue", session: "Lower A", color: "#b45309" },
  { day: "Wed", session: "Rest", color: "#9ca3af" },
  { day: "Thu", session: "Upper B", color: "#166534" },
  { day: "Fri", session: "Lower B", color: "#86198f" },
  { day: "Sat", session: "Rest", color: "#9ca3af" },
  { day: "Sun", session: "Rest", color: "#9ca3af" },
];

const principles = [
  { icon: "📈", title: "Progressive Overload", desc: "Add weight or reps every 1–2 weeks. Track everything." },
  { icon: "🥩", title: "Protein Intake", desc: "You're at 100–120g/day. Push toward 148g (2g/kg) for optimal hypertrophy." },
  { icon: "😴", title: "Sleep", desc: "8h minimum. Muscle is built at rest, not in the gym." },
  { icon: "📅", title: "Deload", desc: "Every 6–8 weeks, reduce volume by 40–50% for one week." },
];

export default function GymRoutine() {
  const [activeDay, setActiveDay] = useState("upper-a");
  const currentDay = days.find((d) => d.id === activeDay);

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#f8f7f4",
      minHeight: "100vh",
      padding: "0",
      color: "#1a1a1a",
    }}>
      {/* Header */}
      <div style={{
        background: "#111",
        color: "#f8f7f4",
        padding: "48px 32px 36px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 80px)",
        }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#888", marginBottom: 12 }}>
            Hypertrophy Program · 4 Days/Week
          </div>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 44px)", fontWeight: 700, margin: "0 0 8px", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Upper / Lower Split
          </h1>
          <p style={{ color: "#aaa", fontSize: 15, margin: 0, fontStyle: "italic", fontFamily: "Georgia, serif" }}>
            Designed for 74kg · 27y · Full gym access
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 16px 48px" }}>

        {/* Why this split */}
        <div style={{
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderLeft: "4px solid #111",
          padding: "20px 24px",
          margin: "32px 0 24px",
        }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>Why this split?</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#333" }}>
            Upper/Lower hits each muscle group <strong>twice per week</strong> — the single biggest driver of hypertrophy vs. your current once-per-week bro split. Each session alternates a strength-focused day (heavier, lower reps) with a hypertrophy day (higher volume, moderate load), giving you both mechanical tension and metabolic stress.
          </p>
        </div>

        {/* Weekly Schedule */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 14 }}>Weekly Schedule</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {schedule.map((s) => (
              <div key={s.day} style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderTop: `3px solid ${s.color}`,
                padding: "10px 6px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#999", textTransform: "uppercase", marginBottom: 4 }}>{s.day}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: s.session === "Rest" ? "#bbb" : "#111", lineHeight: 1.3 }}>{s.session}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Day Tabs */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 14 }}>Training Sessions</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 0 }}>
            {days.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                style={{
                  background: activeDay === d.id ? "#111" : "#fff",
                  color: activeDay === d.id ? "#fff" : "#555",
                  border: `1px solid ${activeDay === d.id ? "#111" : "#e5e5e5"}`,
                  padding: "12px 8px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  transition: "all 0.15s",
                  fontFamily: "Georgia, serif",
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Session */}
        {currentDay && (
          <div style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            marginBottom: 28,
          }}>
            {/* Session Header */}
            <div style={{
              padding: "20px 24px 16px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 8,
            }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>{currentDay.label}</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#666", fontStyle: "italic" }}>{currentDay.focus}</p>
              </div>
              <span style={{
                background: currentDay.tagColor,
                color: currentDay.tagText,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: 2,
              }}>
                {currentDay.tag}
              </span>
            </div>

            {/* Exercises */}
            <div>
              {currentDay.exercises.map((ex, i) => (
                <div key={i} style={{
                  padding: "16px 24px",
                  borderBottom: i < currentDay.exercises.length - 1 ? "1px solid #f5f5f5" : "none",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 12,
                  alignItems: "center",
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#bbb",
                        fontFamily: "monospace",
                        minWidth: 20,
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{ex.name}</span>
                    </div>
                    {ex.note && (
                      <div style={{ fontSize: 12, color: "#999", paddingLeft: 30, fontStyle: "italic" }}>{ex.note}</div>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{ex.sets} × {ex.reps}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>rest {ex.rest}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Principles */}
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 14 }}>Key Principles</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {principles.map((p, i) => (
              <div key={i} style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                padding: "16px 18px",
              }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{p.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#111" }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progression note */}
        <div style={{
          marginTop: 24,
          padding: "16px 20px",
          background: "#111",
          color: "#f8f7f4",
          fontSize: 13,
          lineHeight: 1.7,
        }}>
          <strong style={{ letterSpacing: 0.5 }}>Progression model:</strong> Use double progression — stay in the rep range until you hit the top end for all sets, then add 2.5–5kg. Log every session. Expect visible changes in 8–12 weeks.
        </div>

      </div>
    </div>
  );
}
