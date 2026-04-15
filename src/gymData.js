// ─── Constants ────────────────────────────────────────────────────────────────

export const AGE_CLASSES = ["Under 18", "18–35", "36–49", "50+"];
export const WEIGHT_CLASSES = ["Under 60kg", "60–74kg", "75–89kg", "90kg+"];
export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const AGE_PROFILES = {
  "Under 18": { badge: "Youth", badgeColor: "#e3f2fd", badgeText: "#1565c0", intensityLabel: "Moderate intensity · Technique first", notes: ["Focus on form over weight — technique built now pays dividends for life", "No heavy axial loading: replaced with joint-safe alternatives", "Longer rest periods to allow full nervous system recovery", "Higher rep ranges build work capacity and motor patterns"], weightNote: "50–60% of the weight ranges shown", restNote: "Add 30–60s to all rest periods", repsNote: "+2–4 reps per set" },
  "18–35":    { badge: "Prime",   badgeColor: "#e8f5e9", badgeText: "#1b5e20", intensityLabel: "Full intensity · Standard program",    notes: ["Peak hormonal environment — push hard", "Progressive overload is your main lever: add weight or reps every 1–2 weeks", "Recovery is fast — train at full intensity every session"], weightNote: "Use standard weight ranges shown", restNote: "Standard rest periods apply", repsNote: "Standard rep ranges" },
  "36–49":    { badge: "Masters", badgeColor: "#fff8e1", badgeText: "#b45309", intensityLabel: "Smart intensity · Recovery aware",      notes: ["Recovery takes longer — rest is part of the programme", "Add 1–2 warm-up sets before working sets", "Some high-load moves swapped for joint-friendly alternatives", "Keep 1–2 reps in reserve — avoid true failure"], weightNote: "80–90% of standard weight ranges", restNote: "Add 30s to all rest periods", repsNote: "+1–2 reps per set, stop short of failure" },
  "50+":      { badge: "Veteran", badgeColor: "#fce4ec", badgeText: "#880e4f", intensityLabel: "Joint-friendly · Longevity focused",    notes: ["Heavy axial loading replaced throughout", "Tempo: 3s down · 1s pause · 1s up — slow and controlled", "Mandatory mobility warm-up before every session", "Never go to failure — always leave 3+ reps in the tank"], weightNote: "60–75% of standard weight ranges", restNote: "Add 60–90s to all rest periods", repsNote: "+4–6 reps per set, never to failure" },
};

// ─── Regime definitions ───────────────────────────────────────────────────────

export const REGIMES = {
  hypertrophy: {
    id: "hypertrophy",
    label: "Hypertrophy",
    icon: "💪",
    tagline: "Build muscle size",
    description: "Moderate-heavy loads, 8–15 reps, controlled tempo. Maximises muscle cross-sectional growth through mechanical tension and metabolic stress.",
    split: "Upper / Lower",
    daysMin: 3, daysMax: 4,
    color: "#1b5e20", colorLight: "#e8f5e9",
    sessionOrder: ["upper-a", "lower-a", "upper-b", "lower-b"],
    sessionLabels: { "upper-a": "Upper A", "lower-a": "Lower A", "upper-b": "Upper B", "lower-b": "Lower B" },
  },
  strength: {
    id: "strength",
    label: "Strength",
    icon: "🏋️",
    tagline: "Build raw power",
    description: "Heavy loads, 1–6 reps, full recovery between sets. Develops maximal force production through neural adaptations and myofibrillar growth.",
    split: "Push / Pull / Legs",
    daysMin: 3, daysMax: 4,
    color: "#7f1d1d", colorLight: "#fee2e2",
    sessionOrder: ["push", "pull", "legs-a", "legs-b"],
    sessionLabels: { push: "Push", pull: "Pull", "legs-a": "Legs A", "legs-b": "Legs B" },
  },
  power: {
    id: "power",
    label: "Power",
    icon: "⚡",
    tagline: "Train explosive speed",
    description: "Explosive movements at 30–70% of max, 2–5 reps with full recovery. Trains the rate of force development — how fast you can apply strength.",
    split: "Upper / Lower",
    daysMin: 3, daysMax: 4,
    color: "#1e3a5f", colorLight: "#dbeafe",
    sessionOrder: ["upper-power", "lower-power", "upper-power-b", "lower-power-b"],
    sessionLabels: { "upper-power": "Upper Power A", "lower-power": "Lower Power A", "upper-power-b": "Upper Power B", "lower-power-b": "Lower Power B" },
  },
  endurance: {
    id: "endurance",
    label: "Endurance",
    icon: "🔁",
    tagline: "Build muscular stamina",
    description: "Light–moderate loads, 15–30 reps, short rest. Trains slow-twitch fibres, lactate threshold, and work capacity. Great for sport and general fitness.",
    split: "Full Body",
    daysMin: 3, daysMax: 4,
    color: "#065f46", colorLight: "#d1fae5",
    sessionOrder: ["fb-a", "fb-b", "fb-c", "fb-d"],
    sessionLabels: { "fb-a": "Full Body A", "fb-b": "Full Body B", "fb-c": "Full Body C", "fb-d": "Full Body D" },
  },
  stability: {
    id: "stability",
    label: "Stability",
    icon: "🎯",
    tagline: "Build control & balance",
    description: "Unilateral and anti-rotation movements, 10–15 reps, moderate rest. Builds joint stability, proprioception, and core control. Excellent for injury prevention.",
    split: "Full Body",
    daysMin: 3, daysMax: 4,
    color: "#4c1d95", colorLight: "#ede9fe",
    sessionOrder: ["stab-a", "stab-b", "stab-c", "stab-d"],
    sessionLabels: { "stab-a": "Session A", "stab-b": "Session B", "stab-c": "Session C", "stab-d": "Session D" },
  },
  flexibility: {
    id: "flexibility",
    label: "Flexibility",
    icon: "🧘",
    tagline: "Improve range of motion",
    description: "Static and dynamic stretching, yoga-inspired flows, and mobility drills. No weights. 30–90s holds. Improves joint range, reduces injury risk, and aids recovery.",
    split: "Full Body",
    daysMin: 3, daysMax: 4,
    color: "#7c3aed", colorLight: "#f5f3ff",
    sessionOrder: ["flex-a", "flex-b", "flex-c", "flex-d"],
    sessionLabels: { "flex-a": "Flow A", "flex-b": "Flow B", "flex-c": "Flow C", "flex-d": "Flow D" },
  },
  custom: {
    id: "custom",
    label: "Custom",
    icon: "✏️",
    tagline: "Build your own routine",
    description: "Create your own sessions with any exercises you choose. Perfect if you already have a routine and want to track it, or want to build something completely personal.",
    split: "Your choice",
    daysMin: 1, daysMax: 7,
    color: "#0f766e", colorLight: "#ccfbf1",
    sessionOrder: [],
    sessionLabels: {},
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const w = (u60, w6074, w7589, w90) => ({ "Under 60kg": u60, "60–74kg": w6074, "75–89kg": w7589, "90kg+": w90 });

// ─── HYPERTROPHY sessions ─────────────────────────────────────────────────────

export const HYPERTROPHY_SESSIONS = {
  "upper-a": {
    label: "Upper A", tag: "Strength Focus", focus: "Compound-heavy. Heavier loads, lower reps.",
    exercises: [
      { name: "Barbell Bench Press",       note: "Primary chest driver",             alts: ["Dumbbell Bench Press","Smith Machine Bench Press"], sets:"4", reps:"6–8",   rest:"2–3 min", weight: w("40–60kg","60–80kg","80–100kg","100–120kg") },
      { name: "Barbell Bent-Over Row",     note: "Upper back thickness",             alts: ["Dumbbell Row","Cable Row"],                         sets:"4", reps:"6–8",   rest:"2–3 min", weight: w("35–55kg","55–75kg","75–95kg","95–115kg") },
      { name: "Overhead Press",            note: "Front delt + upper chest",         alts: ["Arnold Press","Seated DB Shoulder Press"],          sets:"3", reps:"8–10",  rest:"2 min",   weight: w("25–40kg","40–55kg","55–70kg","70–90kg") },
      { name: "Weighted Pull-Up",          note: "Lat width",                        alts: ["Lat Pulldown","Assisted Pull-Up"],                  sets:"3", reps:"8–10",  rest:"2 min",   weight: w("Bodyweight","BW or +5kg","+5–10kg","+10–15kg") },
      { name: "Incline DB Press",          note: "Upper chest isolation",            alts: ["Incline Cable Fly","Incline Machine Press"],        sets:"3", reps:"10–12", rest:"90s",     weight: w("14–18kg ea","18–24kg ea","24–30kg ea","30–36kg ea") },
      { name: "Cable Face Pull",           note: "Rear delt + rotator cuff",         alts: ["Band Face Pull","Rear Delt Fly"],                   sets:"3", reps:"15–20", rest:"60s",     weight: w("10–15kg","15–20kg","20–25kg","25–30kg") },
    ],
  },
  "lower-a": {
    label: "Lower A", tag: "Quad Focus", focus: "Quad-dominant. Build strength in the squat pattern.",
    exercises: [
      { name: "Barbell Back Squat",  note: "King of leg exercises",       alts: ["Goblet Squat","Hack Squat Machine"],          sets:"4", reps:"6–8",   rest:"3 min", weight: w("40–60kg","60–90kg","90–120kg","120–150kg") },
      { name: "Romanian Deadlift",   note: "Hamstring stretch + glute",   alts: ["Dumbbell RDL","Cable Pull-Through"],          sets:"3", reps:"10–12", rest:"2 min", weight: w("40–60kg","60–80kg","80–100kg","100–130kg") },
      { name: "Leg Press",           note: "Quad volume top-up",          alts: ["Front Squat","Belt Squat"],                   sets:"3", reps:"12–15", rest:"90s",   weight: w("80–120kg","120–160kg","160–200kg","200–260kg") },
      { name: "Walking Lunges",      note: "Quad + glute balance",        alts: ["Reverse Lunge","Step-Ups"],                   sets:"3", reps:"12/leg",rest:"90s",   weight: w("BW–10kg DBs","10–16kg DBs","16–22kg DBs","22–28kg DBs") },
      { name: "Seated Leg Curl",     note: "Hamstring isolation",         alts: ["Lying Leg Curl","Nordic Curl"],               sets:"3", reps:"12–15", rest:"60s",   weight: w("25–40kg","40–55kg","55–70kg","70–85kg") },
      { name: "Standing Calf Raise", note: "Gastrocnemius",               alts: ["Leg Press Calf Raise","Donkey Calf Raise"],   sets:"4", reps:"15–20", rest:"60s",   weight: w("BW–20kg","20–40kg","40–60kg","60–80kg") },
    ],
  },
  "upper-b": {
    label: "Upper B", tag: "Hypertrophy Focus", focus: "Higher volume, moderate loads. More isolation work.",
    exercises: [
      { name: "Incline DB Press",             note: "Upper chest emphasis",      alts: ["Incline Barbell Press","Cable Incline Fly"],       sets:"4", reps:"10–12", rest:"90s", weight: w("14–18kg ea","18–24kg ea","24–30kg ea","30–36kg ea") },
      { name: "Chest-Supported DB Row",       note: "Eliminates lower back fatigue", alts: ["Seated Cable Row","T-Bar Row"],                sets:"4", reps:"10–12", rest:"90s", weight: w("14–20kg ea","20–26kg ea","26–34kg ea","34–42kg ea") },
      { name: "Cable Lateral Raise",          note: "Medial delt width",         alts: ["DB Lateral Raise","Machine Lateral Raise"],        sets:"4", reps:"15–20", rest:"60s", weight: w("5–8kg","8–12kg","12–16kg","16–20kg") },
      { name: "Seated Cable Row (wide grip)", note: "Mid-back + rear delt",      alts: ["Wide Grip Lat Pulldown","Straight Arm Pulldown"],  sets:"3", reps:"12–15", rest:"90s", weight: w("30–45kg","45–60kg","60–75kg","75–90kg") },
      { name: "Tricep Rope Pushdown",         note: "Tricep isolation",           alts: ["Overhead Tricep Extension","Close-Grip Bench Press"],sets:"3",reps:"12–15",rest:"60s",weight: w("15–25kg","25–35kg","35–45kg","45–55kg") },
      { name: "Incline DB Curl",              note: "Long head stretch",          alts: ["Preacher Curl","Cable Curl"],                      sets:"3", reps:"12–15", rest:"60s", weight: w("8–12kg ea","12–16kg ea","16–20kg ea","20–24kg ea") },
      { name: "Rear Delt Fly",                note: "Rear delt + posture",        alts: ["Reverse Pec Deck","Band Pull-Apart"],              sets:"3", reps:"15–20", rest:"60s", weight: w("6–10kg ea","10–14kg ea","14–18kg ea","18–22kg ea") },
    ],
  },
  "lower-b": {
    label: "Lower B", tag: "Posterior Focus", focus: "Hip-dominant. Deadlift pattern + hamstring volume.",
    exercises: [
      { name: "Conventional Deadlift",  note: "Full posterior chain",       alts: ["Trap Bar Deadlift","Sumo Deadlift"],              sets:"4", reps:"5–6",   rest:"3 min", weight: w("60–80kg","80–110kg","110–140kg","140–180kg") },
      { name: "Hack Squat",             note: "Quad volume",                alts: ["Leg Press","Front Squat"],                        sets:"3", reps:"12–15", rest:"90s",   weight: w("40–70kg","70–100kg","100–140kg","140–180kg") },
      { name: "Bulgarian Split Squat",  note: "Unilateral balance + glutes",alts: ["Reverse Lunge","Single-Leg Leg Press"],           sets:"3", reps:"10/leg",rest:"2 min", weight: w("BW–8kg DBs","8–16kg DBs","16–24kg DBs","24–32kg DBs") },
      { name: "Lying Leg Curl",         note: "Hamstring isolation",        alts: ["Seated Leg Curl","Nordic Curl"],                  sets:"4", reps:"12–15", rest:"60s",   weight: w("25–40kg","40–55kg","55–70kg","70–85kg") },
      { name: "Hip Thrust",             note: "Glute peak contraction",     alts: ["Glute Bridge","Cable Kickback"],                  sets:"3", reps:"12–15", rest:"90s",   weight: w("40–60kg","60–80kg","80–100kg","100–130kg") },
      { name: "Seated Calf Raise",      note: "Soleus focus",               alts: ["Standing Calf Raise","Leg Press Calf Raise"],     sets:"4", reps:"15–20", rest:"60s",   weight: w("20–35kg","35–50kg","50–65kg","65–80kg") },
    ],
  },
};

// ─── STRENGTH sessions ────────────────────────────────────────────────────────

export const STRENGTH_SESSIONS = {
  push: {
    label: "Push", tag: "Chest · Shoulders · Triceps", focus: "Max tension on pressing muscles. Heavy, low rep, full recovery.",
    exercises: [
      { name: "Barbell Bench Press",       note: "Primary strength builder",          alts: ["DB Bench Press","Smith Machine Press"],           sets:"5", reps:"3–5",  rest:"3–5 min", weight: w("50–70kg","70–100kg","100–130kg","130–160kg") },
      { name: "Overhead Press",            note: "Strict press — no leg drive",       alts: ["Push Press","Seated BB Press"],                   sets:"4", reps:"3–5",  rest:"3 min",   weight: w("30–45kg","45–60kg","60–80kg","80–100kg") },
      { name: "Incline DB Press",          note: "Upper chest accessory",             alts: ["Incline BB Press","Cable Fly"],                   sets:"3", reps:"6–8",  rest:"2 min",   weight: w("18–24kg ea","24–30kg ea","30–36kg ea","36–44kg ea") },
      { name: "Close-Grip Bench Press",    note: "Tricep strength",                   alts: ["Tricep Dips (weighted)","French Press"],          sets:"3", reps:"5–8",  rest:"2 min",   weight: w("30–50kg","50–70kg","70–90kg","90–110kg") },
      { name: "Cable Lateral Raise",       note: "Delt health",                       alts: ["DB Lateral Raise","Machine Lateral Raise"],       sets:"3", reps:"12–15",rest:"60s",     weight: w("5–8kg","8–12kg","12–16kg","16–20kg") },
      { name: "Cable Face Pull",           note: "Rotator cuff — never skip",         alts: ["Band Face Pull","Rear Delt Fly"],                  sets:"3", reps:"15–20",rest:"60s",     weight: w("10–15kg","15–20kg","20–25kg","25–30kg") },
    ],
  },
  pull: {
    label: "Pull", tag: "Back · Biceps", focus: "Heavy pulling. Strengthen the entire posterior chain from traps to lats.",
    exercises: [
      { name: "Deadlift",                  note: "The king — treat every rep as a max",alts: ["Trap Bar Deadlift","Rack Pull"],                 sets:"5", reps:"2–4",  rest:"4–5 min", weight: w("80–110kg","110–150kg","150–190kg","190–230kg") },
      { name: "Barbell Row",               note: "Heavy horizontal pull",              alts: ["Pendlay Row","T-Bar Row"],                       sets:"4", reps:"4–6",  rest:"3 min",   weight: w("40–60kg","60–80kg","80–100kg","100–120kg") },
      { name: "Weighted Pull-Up",          note: "Vertical pull strength",             alts: ["Lat Pulldown (heavy)","Band-Assisted Pull-Up"],  sets:"4", reps:"4–6",  rest:"3 min",   weight: w("BW","BW+5–10kg","BW+10–20kg","BW+20–30kg") },
      { name: "Cable Row (close grip)",    note: "Mid-back + bicep",                   alts: ["Seated Row","Chest-Supported Row"],               sets:"3", reps:"6–8",  rest:"2 min",   weight: w("40–55kg","55–70kg","70–90kg","90–110kg") },
      { name: "DB Hammer Curl",            note: "Brachialis + bicep",                 alts: ["Barbell Curl","Cable Curl"],                      sets:"3", reps:"8–10", rest:"90s",     weight: w("10–14kg ea","14–18kg ea","18–24kg ea","24–30kg ea") },
      { name: "Shrugs",                    note: "Trap strength",                      alts: ["DB Shrug","Machine Shrug"],                       sets:"3", reps:"8–10", rest:"90s",     weight: w("50–70kg","70–90kg","90–110kg","110–140kg") },
    ],
  },
  "legs-a": {
    label: "Legs A", tag: "Squat Focus", focus: "Squat-dominant. Maximise quad and glute strength through the barbell squat pattern.",
    exercises: [
      { name: "Barbell Back Squat",        note: "Primary strength lift",              alts: ["Low-Bar Squat","Safety Bar Squat"],               sets:"5", reps:"3–5",  rest:"4–5 min", weight: w("50–80kg","80–120kg","120–160kg","160–200kg") },
      { name: "Pause Squat",               note: "2s pause at bottom — builds strength out of the hole", alts: ["Box Squat","Front Squat"],   sets:"3", reps:"3–4",  rest:"3 min",   weight: w("40–60kg","60–90kg","90–120kg","120–150kg") },
      { name: "Romanian Deadlift",         note: "Posterior chain — stay tight",       alts: ["Stiff-Leg Deadlift","DB RDL"],                   sets:"3", reps:"6–8",  rest:"2 min",   weight: w("50–70kg","70–90kg","90–110kg","110–140kg") },
      { name: "Leg Press",                 note: "Quad volume after squats",           alts: ["Hack Squat","Belt Squat"],                        sets:"3", reps:"8–10", rest:"2 min",   weight: w("100–140kg","140–180kg","180–220kg","220–280kg") },
      { name: "Seated Leg Curl",           note: "Hamstring isolation",                alts: ["Lying Leg Curl","Nordic Curl"],                   sets:"3", reps:"10–12",rest:"90s",     weight: w("30–45kg","45–60kg","60–75kg","75–90kg") },
      { name: "Standing Calf Raise",       note: "Weighted — go heavy",                alts: ["Donkey Calf Raise","Leg Press Calf Raise"],       sets:"4", reps:"8–10", rest:"90s",     weight: w("40–60kg","60–80kg","80–100kg","100–120kg") },
    ],
  },
  "legs-b": {
    label: "Legs B", tag: "Hinge Focus", focus: "Deadlift-dominant. Posterior chain development — glutes, hamstrings, lower back.",
    exercises: [
      { name: "Sumo Deadlift",             note: "Wide stance — quad + glute dominant",alts: ["Conventional Deadlift","Trap Bar Deadlift"],      sets:"5", reps:"3–5",  rest:"4–5 min", weight: w("70–100kg","100–140kg","140–180kg","180–220kg") },
      { name: "Good Morning",              note: "Lower back + hamstring",             alts: ["Barbell RDL","45° Back Extension"],               sets:"3", reps:"5–8",  rest:"3 min",   weight: w("20–40kg","40–60kg","60–80kg","80–100kg") },
      { name: "Bulgarian Split Squat",     note: "Unilateral strength",                alts: ["Rear-Foot-Elevated RDL","Step-Up (loaded)"],       sets:"3", reps:"5–6/leg",rest:"2 min", weight: w("10–16kg DBs","16–24kg DBs","24–32kg DBs","32–40kg DBs") },
      { name: "Hip Thrust (heavy)",        note: "Glute max — top set heavy",          alts: ["Barbell Glute Bridge","Cable Pull-Through"],       sets:"4", reps:"5–8",  rest:"2 min",   weight: w("60–90kg","90–120kg","120–150kg","150–180kg") },
      { name: "Lying Leg Curl",            note: "Hamstring curl",                     alts: ["Seated Leg Curl","Nordic Curl"],                   sets:"3", reps:"8–10", rest:"90s",     weight: w("30–45kg","45–60kg","60–75kg","75–90kg") },
      { name: "Seated Calf Raise",         note: "Soleus",                             alts: ["Standing Calf Raise","Leg Press Calf Raise"],      sets:"4", reps:"8–10", rest:"90s",     weight: w("30–50kg","50–70kg","70–90kg","90–110kg") },
    ],
  },
};

// ─── POWER sessions ───────────────────────────────────────────────────────────

export const POWER_SESSIONS = {
  "upper-power": {
    label: "Upper Power A", tag: "Explosive Push + Pull", focus: "Move the bar as fast as possible. Speed is the stimulus.",
    exercises: [
      { name: "Medicine Ball Chest Pass",  note: "Explosive intent — max velocity",    alts: ["Clap Push-Up","Band Press"],                      sets:"4", reps:"4–5",  rest:"2–3 min", weight: w("3–4kg ball","4–5kg ball","5–6kg ball","6–8kg ball") },
      { name: "Push Press",               note: "Use legs to drive bar overhead",      alts: ["Barbell Push Press","DB Push Press"],              sets:"4", reps:"3–4",  rest:"3 min",   weight: w("30–45kg","45–60kg","60–75kg","75–95kg") },
      { name: "Bench Press (speed)",      note: "50–60% of max — move it FAST",        alts: ["DB Speed Press","Band-Resisted Press"],            sets:"5", reps:"3",    rest:"2 min",   weight: w("30–45kg","45–60kg","60–75kg","75–90kg") },
      { name: "Explosive Pull-Up",        note: "Pull as fast as possible, lower slow",alts: ["Jumping Pull-Up","Band Pull-Up"],                  sets:"4", reps:"4–5",  rest:"2–3 min", weight: w("Bodyweight","Bodyweight","BW or +5kg","BW+5–10kg") },
      { name: "Barbell Row (explosive)",  note: "Row bar hard into lower chest",        alts: ["Seal Row","Pendlay Row"],                          sets:"4", reps:"4–5",  rest:"2 min",   weight: w("40–55kg","55–70kg","70–90kg","90–110kg") },
      { name: "Cable Face Pull",          note: "Joint health — always include",        alts: ["Band Face Pull","Rear Delt Fly"],                  sets:"3", reps:"15",   rest:"60s",     weight: w("10–15kg","15–20kg","20–25kg","25–30kg") },
    ],
  },
  "lower-power": {
    label: "Lower Power A", tag: "Explosive Legs", focus: "Ground-contact speed. Train the stretch-shortening cycle.",
    exercises: [
      { name: "Box Jump",                 note: "Land soft — absorb with knees bent",  alts: ["Broad Jump","Vertical Jump"],                     sets:"5", reps:"3–5",  rest:"2–3 min", weight: w("BW — 50cm box","BW — 60cm","BW — 70cm","BW — 80cm") },
      { name: "Power Clean (from hang)",  note: "If unfamiliar, use DB Hang Power Clean",alts: ["DB Hang Power Clean","Kettlebell Swing"],        sets:"5", reps:"3",    rest:"3 min",   weight: w("30–45kg","45–65kg","65–85kg","85–105kg") },
      { name: "Jump Squat",               note: "20–30% of max squat — explode up",    alts: ["Squat Jump (BW)","Trap Bar Jump"],                 sets:"4", reps:"4–5",  rest:"2–3 min", weight: w("10–20kg","20–35kg","35–50kg","50–65kg") },
      { name: "Trap Bar Deadlift (speed)",note: "Accelerate through entire pull",       alts: ["Speed Conventional DL","KB Deadlift"],             sets:"4", reps:"3",    rest:"3 min",   weight: w("60–80kg","80–100kg","100–130kg","130–160kg") },
      { name: "Broad Jump",               note: "Max horizontal distance each rep",     alts: ["Standing Long Jump","Bounding"],                   sets:"4", reps:"4",    rest:"2 min",   weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Seated Calf Raise",        note: "Soleus tendon stiffness",              alts: ["Standing Calf Raise","Ankle Hops"],                sets:"3", reps:"12–15",rest:"60s",     weight: w("20–35kg","35–50kg","50–65kg","65–80kg") },
    ],
  },
  "upper-power-b": {
    label: "Upper Power B", tag: "Rotational + Overhead Power", focus: "Develop rotational and pressing power. Sport-specific.",
    exercises: [
      { name: "Med Ball Rotational Throw",note: "Explosive hip rotation into wall",     alts: ["Cable Woodchop","Band Rotational Press"],          sets:"4", reps:"5/side",rest:"2 min",   weight: w("3–4kg","4–5kg","5–6kg","6–8kg") },
      { name: "Push Jerk",                note: "Dip-drive-punch. Keep bar overhead",   alts: ["Push Press","DB Split Jerk"],                     sets:"4", reps:"3",    rest:"3 min",   weight: w("30–45kg","45–60kg","60–80kg","80–100kg") },
      { name: "Plyo Push-Up",             note: "Hands leave ground each rep",          alts: ["Incline Plyo Push-Up","Clap Push-Up"],             sets:"4", reps:"5–6",  rest:"2 min",   weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Lat Pulldown (explosive)", note: "Pull fast, control the return",         alts: ["Explosive Pull-Up","Band Pulldown"],               sets:"4", reps:"4–5",  rest:"2 min",   weight: w("40–55kg","55–70kg","70–90kg","90–110kg") },
      { name: "Landmine Press",           note: "Rotational pressing power",             alts: ["Cable Press","Single-Arm DB Press"],              sets:"3", reps:"5/side",rest:"2 min",   weight: w("15–25kg","25–35kg","35–45kg","45–55kg") },
      { name: "Band Pull-Apart",          note: "Shoulder health",                       alts: ["Cable Face Pull","Rear Delt Fly"],                 sets:"3", reps:"20",   rest:"45s",     weight: w("Light band","Light band","Med band","Med band") },
    ],
  },
  "lower-power-b": {
    label: "Lower Power B", tag: "Reactive + Plyometric", focus: "Minimal ground contact time. Train the reactive strength index.",
    exercises: [
      { name: "Depth Jump",               note: "Step off box, land and jump immediately",alts: ["Drop Jump","Hurdle Hop"],                        sets:"4", reps:"4–5",  rest:"3 min",   weight: w("40cm box","50cm","60cm","60cm+") },
      { name: "Single-Leg Hop",           note: "Continuous hops — minimal contact time",alts: ["Ankle Hop","Lateral Bound"],                     sets:"4", reps:"6/leg",rest:"2 min",   weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Barbell Hip Thrust (explosive)",note:"Drive hips up as fast as possible", alts: ["KB Swing","Cable Pull-Through"],                  sets:"4", reps:"4–5",  rest:"2–3 min", weight: w("50–70kg","70–90kg","90–120kg","120–150kg") },
      { name: "Sprint (treadmill/track)",  note: "6–8 second max effort sprints",        alts: ["Stationary Bike Sprint","Assault Bike Sprint"],    sets:"6", reps:"1",    rest:"2 min",   weight: w("Max effort","Max effort","Max effort","Max effort") },
      { name: "Lateral Bound",            note: "Explode laterally — land stable",        alts: ["Side Hop","Lateral Hurdle Jump"],                  sets:"4", reps:"6/side",rest:"2 min", weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Ankle Hops",               note: "Stiff ankles — minimal knee bend",       alts: ["Jump Rope","Pogos"],                              sets:"3", reps:"20",   rest:"90s",     weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
    ],
  },
};

// ─── ENDURANCE sessions ───────────────────────────────────────────────────────

export const ENDURANCE_SESSIONS = {
  "fb-a": {
    label: "Full Body A", tag: "Push Dominant", focus: "High rep, short rest. Targets push muscles + core with circuit-style density.",
    exercises: [
      { name: "DB Bench Press",           note: "15–20 reps — controlled speed",       alts: ["Push-Up","Machine Chest Press"],                   sets:"3", reps:"15–20", rest:"30–45s", weight: w("10–14kg ea","14–18kg ea","18–22kg ea","22–28kg ea") },
      { name: "DB Shoulder Press",        note: "Moderate weight, high reps",           alts: ["Machine Shoulder Press","Pike Push-Up"],           sets:"3", reps:"15–20", rest:"30–45s", weight: w("8–12kg ea","12–16kg ea","16–20kg ea","20–26kg ea") },
      { name: "Lat Pulldown",             note: "Back balance to push work",             alts: ["Assisted Pull-Up","Band Pulldown"],                 sets:"3", reps:"15–20", rest:"30–45s", weight: w("30–45kg","45–60kg","60–75kg","75–90kg") },
      { name: "Goblet Squat",             note: "Legs + cardio — go for burn",           alts: ["Bodyweight Squat","Air Squat"],                    sets:"3", reps:"20–25", rest:"30–45s", weight: w("12–16kg","16–20kg","20–24kg","24–32kg") },
      { name: "Plank",                    note: "Hold to fatigue — brace hard",          alts: ["Dead Bug","Ab Wheel"],                             sets:"3", reps:"45–60s",rest:"30s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Battle Ropes",             note: "30s on, 30s off — full effort",         alts: ["KB Swing","Mountain Climber"],                     sets:"4", reps:"30s",   rest:"30s",    weight: w("Light rope","Med rope","Med rope","Heavy rope") },
    ],
  },
  "fb-b": {
    label: "Full Body B", tag: "Pull Dominant", focus: "Posterior chain + pull muscles. Keeps heart rate elevated throughout.",
    exercises: [
      { name: "Seated Cable Row",          note: "High reps — squeeze each rep",         alts: ["Resistance Band Row","DB Row"],                    sets:"3", reps:"15–20", rest:"30–45s", weight: w("30–45kg","45–60kg","60–75kg","75–90kg") },
      { name: "Romanian Deadlift",         note: "Light — perfect hamstring hinge",       alts: ["Dumbbell RDL","Cable Pull-Through"],               sets:"3", reps:"15–20", rest:"45s",    weight: w("30–45kg","45–60kg","60–75kg","75–90kg") },
      { name: "Incline DB Press",          note: "Upper chest + endurance",               alts: ["Cable Crossover","Machine Fly"],                   sets:"3", reps:"15–20", rest:"30s",    weight: w("10–14kg ea","14–18kg ea","18–22kg ea","22–28kg ea") },
      { name: "Step-Up (DB)",             note: "Alternate legs, continuous tempo",       alts: ["Walking Lunge","Box Step"],                        sets:"3", reps:"15/leg", rest:"30s",   weight: w("8–12kg ea","12–16kg ea","16–20kg ea","20–26kg ea") },
      { name: "Cable Lateral Raise",       note: "Lightweight — 20+ reps",                alts: ["DB Lateral Raise","Machine Lateral Raise"],        sets:"3", reps:"20–25", rest:"30s",    weight: w("4–6kg","6–8kg","8–10kg","10–14kg") },
      { name: "Farmer's Carry",           note: "Walk 30–40m — grip + core + cardio",    alts: ["KB Carry","Suitcase Carry"],                       sets:"4", reps:"30m",   rest:"60s",    weight: w("16–20kg ea","20–26kg ea","26–32kg ea","32–40kg ea") },
    ],
  },
  "fb-c": {
    label: "Full Body C", tag: "Legs + Core", focus: "Lower body endurance circuit. Builds quad, glute and core capacity.",
    exercises: [
      { name: "Leg Press",                 note: "20–25 reps — chase the burn",           alts: ["Hack Squat","Goblet Squat"],                       sets:"3", reps:"20–25", rest:"45s",    weight: w("60–90kg","90–120kg","120–150kg","150–180kg") },
      { name: "Walking Lunges",            note: "Non-stop — alternate legs",              alts: ["Reverse Lunge","Split Squat"],                     sets:"3", reps:"20/leg", rest:"30s",   weight: w("BW–8kg DBs","8–12kg DBs","12–16kg DBs","16–20kg DBs") },
      { name: "Lying Leg Curl",            note: "Controlled — feel the hamstring",        alts: ["Seated Leg Curl","Nordic Curl"],                   sets:"3", reps:"20–25", rest:"30s",    weight: w("20–35kg","35–50kg","50–65kg","65–80kg") },
      { name: "Hip Thrust",               note: "Bodyweight or light load, 25 reps",      alts: ["Glute Bridge","Cable Kickback"],                   sets:"3", reps:"20–25", rest:"30s",    weight: w("BW–20kg","20–40kg","40–60kg","60–80kg") },
      { name: "Ab Circuit",               note: "Crunch / Leg Raise / Plank — no rest between",alts: ["Dead Bug","Mountain Climber"],               sets:"3", reps:"15 ea", rest:"60s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Stationary Bike",           note: "5 min steady state — finish strong",     alts: ["Row Machine","Elliptical"],                        sets:"1", reps:"5 min", rest:"—",      weight: w("Moderate resistance","Moderate","Moderate","Moderate") },
    ],
  },
  "fb-d": {
    label: "Full Body D", tag: "Total Body Circuit", focus: "Mixed circuit — all muscle groups, maximum calorie burn and stamina.",
    exercises: [
      { name: "Kettlebell Swing",          note: "Hip hinge — power from glutes",         alts: ["DB Swing","Cable Pull-Through"],                   sets:"4", reps:"20",   rest:"30–45s", weight: w("12–16kg","16–20kg","20–24kg","24–32kg") },
      { name: "Push-Up (weighted vest)",   note: "Full ROM — chest to floor",              alts: ["Push-Up","DB Chest Press"],                        sets:"3", reps:"15–20", rest:"30s",   weight: w("BW","BW or +5kg vest","BW+5kg","BW+10kg") },
      { name: "TRX Row / Inverted Row",    note: "Body at 45°, pull to chest",             alts: ["Lat Pulldown","Resistance Band Row"],               sets:"3", reps:"15–20", rest:"30s",   weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Goblet Squat + Press",      note: "Squat down, press at top",               alts: ["Thruster","DB Squat to Press"],                    sets:"3", reps:"15",   rest:"45s",    weight: w("10–14kg","14–18kg","18–22kg","22–28kg") },
      { name: "Renegade Row",              note: "Plank position — row each side",          alts: ["Single-Arm Row","DB Row"],                         sets:"3", reps:"10/side",rest:"45s",  weight: w("8–10kg ea","10–14kg ea","14–18kg ea","18–22kg ea") },
      { name: "Assault Bike / Row Erg",   note: "3 min all-out to finish",                 alts: ["Ski Erg","Jump Rope"],                             sets:"1", reps:"3 min", rest:"—",     weight: w("Max effort","Max effort","Max effort","Max effort") },
    ],
  },
};

// ─── STABILITY sessions ───────────────────────────────────────────────────────

export const STABILITY_SESSIONS = {
  "stab-a": {
    label: "Session A", tag: "Core + Hip Stability", focus: "Anti-rotation and hip stability. Build the foundation everything else sits on.",
    exercises: [
      { name: "Pallof Press",              note: "Anti-rotation — stand tall, no twist",  alts: ["Band Pallof Press","Half-Kneeling Pallof"],       sets:"3", reps:"12/side",rest:"60s",    weight: w("10–15kg","15–20kg","20–25kg","25–30kg") },
      { name: "Single-Leg RDL (DB)",       note: "Slow and controlled — feel the hip",    alts: ["Cable Single-Leg RDL","Assisted SL RDL"],          sets:"3", reps:"10/side",rest:"60–90s", weight: w("8–12kg ea","12–16kg ea","16–20kg ea","20–26kg ea") },
      { name: "Dead Bug",                  note: "Lower back to floor — never arch",       alts: ["Bird Dog","Hollow Body Hold"],                     sets:"3", reps:"8/side", rest:"60s",    weight: w("Bodyweight","Bodyweight","BW+cable arm","BW+cable arm") },
      { name: "Copenhagen Plank",          note: "Side plank with inner leg on bench",     alts: ["Side Plank","Hip Adduction Machine"],              sets:"3", reps:"20–30s/side",rest:"60s",weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Glute Bridge (single leg)", note: "Drive through heel — squeeze glute",     alts: ["Hip Thrust (SL)","Cable Kickback"],                sets:"3", reps:"12/side",rest:"60s",    weight: w("Bodyweight","BW or +10kg","BW+10–20kg","BW+20kg") },
      { name: "Farmers Carry",             note: "Upright posture — core braced",          alts: ["Suitcase Carry","Waiter Carry"],                   sets:"3", reps:"30m",   rest:"90s",    weight: w("16–20kg ea","20–26kg ea","26–32kg ea","32–40kg ea") },
    ],
  },
  "stab-b": {
    label: "Session B", tag: "Shoulder + Upper Body Stability", focus: "Rotator cuff, scapular control, and pressing stability.",
    exercises: [
      { name: "Bottoms-Up KB Press",       note: "KB inverted — forces stability",        alts: ["Landmine Press","Single-Arm DB Press"],            sets:"3", reps:"8/side", rest:"90s",    weight: w("8–10kg","10–14kg","14–18kg","18–22kg") },
      { name: "Band External Rotation",    note: "Elbow at 90° — squeeze scapula",         alts: ["Cable External Rotation","Light DB ER"],           sets:"3", reps:"15/side",rest:"45s",    weight: w("Light band","Light band","Med band","Med band") },
      { name: "TRX Y-T-W",                note: "3 positions — feel rear delt burn",       alts: ["DB Y-T-W (prone)","Band Y-T-W"],                   sets:"3", reps:"8 each", rest:"60s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Push-Up to T-Rotation",    note: "Rotate to side plank at top",             alts: ["Side Plank + Row","Cable Push-Pull"],              sets:"3", reps:"8/side", rest:"60s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Single-Arm Cable Row",      note: "Hold and pause at end range",             alts: ["Single-Arm DB Row","TRX Row (single arm)"],        sets:"3", reps:"12/side",rest:"60s",    weight: w("15–25kg","25–35kg","35–45kg","45–55kg") },
      { name: "Quadruped Reach",           note: "Opposite arm + leg extended — hold",     alts: ["Bird Dog","Superman Hold"],                        sets:"3", reps:"10/side",rest:"45s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
    ],
  },
  "stab-c": {
    label: "Session C", tag: "Knee + Ankle Stability", focus: "Unilateral lower body work. Builds proprioception and knee tracking.",
    exercises: [
      { name: "Single-Leg Squat (pistol assist)",note:"Hold TRX — work toward full pistol",alts: ["Bulgarian Split Squat","Reverse Lunge"],          sets:"3", reps:"8/side", rest:"90s",    weight: w("Bodyweight","Bodyweight","BW or +5kg","BW+5–10kg") },
      { name: "Lateral Band Walk",         note: "Band above knees — keep hips level",    alts: ["Clamshell","Hip Abduction Machine"],                sets:"3", reps:"15/side",rest:"60s",    weight: w("Light band","Light band","Med band","Med band") },
      { name: "Step-Up (slow eccentric)",  note: "3s to step down — feel the quad",        alts: ["Reverse Step-Up","Box Step"],                      sets:"3", reps:"10/side",rest:"60–90s", weight: w("8–12kg ea","12–16kg ea","16–20kg ea","20–26kg ea") },
      { name: "Terminal Knee Extension",   note: "Band behind knee — full extension",       alts: ["Leg Extension (light)","Seated Knee Press"],       sets:"3", reps:"15/side",rest:"45s",    weight: w("Light band","Light band","Med band","Med band") },
      { name: "Single-Leg Calf Raise",    note: "Slow — 3s up, 3s down",                  alts: ["Standing Calf Raise","Seated Calf Raise"],         sets:"3", reps:"12/side",rest:"60s",    weight: w("Bodyweight","BW or +5kg","BW+5–10kg","BW+10–15kg") },
      { name: "Balance Board Squat",      note: "Bodyweight squat on unstable surface",    alts: ["Bosu Squat","Single-Leg Stand"],                   sets:"3", reps:"10/side",rest:"60s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
    ],
  },
  "stab-d": {
    label: "Session D", tag: "Whole Body Integration", focus: "Multi-joint stability patterns. Trains the body as a connected system.",
    exercises: [
      { name: "Turkish Get-Up",            note: "Each step deliberate — no rushing",      alts: ["Segmented TGU","Half Get-Up"],                     sets:"3", reps:"3/side", rest:"2 min",   weight: w("8–12kg","12–16kg","16–20kg","20–26kg") },
      { name: "Windmill",                  note: "Hip out, reach for ground, eyes on KB",  alts: ["Side Bend + Reach","Lateral Flexion"],             sets:"3", reps:"6/side", rest:"90s",     weight: w("8–12kg","12–16kg","16–20kg","20–26kg") },
      { name: "Bear Crawl",                note: "Knees 5cm off floor — full control",     alts: ["Commando Crawl","Inchworm"],                       sets:"4", reps:"20m",    rest:"60s",     weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Hollow Body Rock",          note: "Ribs down — no lower back arch",         alts: ["Hollow Hold","Ab Mat Crunch"],                     sets:"3", reps:"20–30s", rest:"45s",     weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Cable Chop (high to low)",  note: "Rotate from shoulder to opposite hip",   alts: ["Band Chop","Med Ball Slam"],                       sets:"3", reps:"10/side",rest:"60s",     weight: w("10–15kg","15–20kg","20–25kg","25–30kg") },
      { name: "Loaded Carry (overhead)",   note: "Arm fully locked — steady gait",          alts: ["Waiter Carry","Shoulder Carry"],                   sets:"3", reps:"20m/side",rest:"90s",   weight: w("8–12kg","12–16kg","16–20kg","20–26kg") },
    ],
  },
};

// ─── FLEXIBILITY sessions ─────────────────────────────────────────────────────

export const FLEXIBILITY_SESSIONS = {
  "flex-a": {
    label: "Flow A", tag: "Full Body Dynamic", focus: "Dynamic movements through full range. Prepares the body and builds active flexibility.",
    exercises: [
      { name: "World's Greatest Stretch",  note: "Lunge, rotate, reach — 5 reps/side",   alts: ["Hip Flexor + Twist","Deep Lunge Flow"],            sets:"3", reps:"5/side", rest:"30s",     weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Cat-Cow Flow",              note: "Breathe — inhale extend, exhale round", alts: ["Spine Wave","Segmental Roll"],                     sets:"3", reps:"10",     rest:"20s",     weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Hip 90/90 Flow",            note: "Rotate between front and rear 90°",     alts: ["Pigeon Pose","Seated Hip Rotation"],                sets:"3", reps:"8/side", rest:"30s",     weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Thread the Needle",         note: "Thoracic rotation — arm under body",    alts: ["Open Book","Seated Rotation"],                     sets:"3", reps:"8/side", rest:"20s",     weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Leg Swing (front/back)",    note: "Controlled arc — increase range each rep",alts: ["Standing Hip Flexor","Straight-Leg Raise"],      sets:"3", reps:"12/side",rest:"20s",     weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Deep Squat Hold + Reach",  note: "Hold bottom, rotate arms up each side", alts: ["Goblet Squat Hold","Squat to Stand"],              sets:"3", reps:"30–45s", rest:"30s",     weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
    ],
  },
  "flex-b": {
    label: "Flow B", tag: "Lower Body Focus", focus: "Hip flexors, hamstrings, quads and glutes. Essential after heavy leg sessions.",
    exercises: [
      { name: "Kneeling Hip Flexor Stretch",note:"Anterior pelvic tilt — hold and breathe",alts: ["Standing Hip Flexor","Couch Stretch"],            sets:"3", reps:"60s/side",rest:"20s",   weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Seated Hamstring Stretch",  note: "Straight leg — flex foot",              alts: ["Lying Hamstring Stretch","PNF Hamstring"],          sets:"3", reps:"45s/side",rest:"20s",   weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Pigeon Pose",               note: "Front shin parallel — hold 60–90s",     alts: ["Supine Pigeon","Figure-4 Stretch"],                sets:"3", reps:"60–90s/side",rest:"20s",weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Couch Stretch",             note: "Quad + hip flexor — against wall",       alts: ["Kneeling Quad Stretch","Prone Quad Stretch"],      sets:"3", reps:"60s/side",rest:"20s",   weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Adductor Stretch (wide squat)",note:"Wide stance — push knees out with elbows",alts: ["Butterfly Stretch","Side Lunge Hold"],          sets:"3", reps:"45–60s", rest:"20s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Calf + Ankle Stretch",      note: "Wall calf stretch + slow ankle circles", alts: ["Downward Dog","Standing Calf Stretch"],            sets:"3", reps:"45s/side",rest:"20s",   weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
    ],
  },
  "flex-c": {
    label: "Flow C", tag: "Upper Body + Spine", focus: "Thoracic mobility, shoulder flexibility and chest opening. Counteracts desk posture.",
    exercises: [
      { name: "Doorway Chest Stretch",     note: "Arm at 90° — lean in gently",           alts: ["Cable Chest Stretch","Band Chest Stretch"],        sets:"3", reps:"45s/side",rest:"20s",   weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Sleeper Stretch",           note: "Posterior capsule — gentle pressure only",alts: ["Cross-Body Shoulder Stretch","Child's Pose"],     sets:"3", reps:"45s/side",rest:"20s",   weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Thoracic Extension over Foam Roller",note:"Roll T4–T8, arms behind head",  alts: ["Cat-Cow","Seated T-Spine Rotation"],               sets:"3", reps:"30–45s", rest:"20s",    weight: w("Foam roller","Foam roller","Foam roller","Foam roller") },
      { name: "Lat Stretch (overhead grip)",note:"Bar or rack — sit back, stretch lats",   alts: ["Banded Lat Stretch","Child's Pose"],               sets:"3", reps:"45s",    rest:"20s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Neck Flexion/Extension Flow",note:"Slow — never force range",               alts: ["Neck Side Bend","Levator Scap Stretch"],           sets:"2", reps:"10 each direction",rest:"20s",weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Child's Pose to Cobra Flow",note:"Breathe through each transition",         alts: ["Prayer Stretch","Seal Stretch"],                   sets:"3", reps:"8",      rest:"20s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
    ],
  },
  "flex-d": {
    label: "Flow D", tag: "Full Body Deep Stretch", focus: "Longer holds, deeper positions. Recovery session or dedicated flexibility day.",
    exercises: [
      { name: "Supine Spinal Twist",       note: "Both shoulders on floor — breathe",     alts: ["Seated Spinal Twist","Lying Figure-4"],            sets:"3", reps:"60–90s/side",rest:"20s",weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Full Splits Progression",   note: "Go to YOUR edge — never bounce",         alts: ["Half Split","Wide-Leg Fold"],                      sets:"3", reps:"60s",    rest:"20s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Pancake Stretch",           note: "Wide legs, fold forward — chest down",   alts: ["Seated Straddle","Wide-Leg Forward Fold"],         sets:"3", reps:"60–90s", rest:"20s",    weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Loaded Progressive Stretch",note:"Gentle weight used only for gravity assist",alts: ["DB Romanian Stretch","Pulley Hip Flexor"],       sets:"3", reps:"45s",    rest:"30s",    weight: w("3–5kg plate","5–8kg","8–10kg","10–12kg") },
      { name: "PNF Hamstring",             note: "Contract 5s, release, go deeper — repeat",alts: ["Partner Hamstring","Rope Stretch"],              sets:"3", reps:"3 cycles/side",rest:"30s",weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
      { name: "Savasana / Breathing",      note: "5 min diaphragmatic breathing to close", alts: ["Meditation","Progressive Muscle Relaxation"],     sets:"1", reps:"5 min",  rest:"—",      weight: w("Bodyweight","Bodyweight","Bodyweight","Bodyweight") },
    ],
  },
};

// ─── Exercise guides (hypertrophy) ────────────────────────────────────────────

export const EXERCISE_GUIDES = {
  "Barbell Bench Press": {
    images: { start: "/images/exercises/barbell-bench-press-start.jpg", finish: "/images/exercises/barbell-bench-press-finish.jpg" },
    muscles: { primary: ["Chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Lie flat on the bench, eyes under the bar. Feet flat on the floor.",
      "Grip the bar just outside shoulder width. Unrack with straight arms.",
      "Lower the bar to your mid-chest with elbows at roughly 45 degrees.",
      "Press up in a slight arc back toward the rack position. Lock out.",
    ],
    cues: ["Squeeze shoulder blades together before you unrack", "Drive feet into the floor throughout", "Touch your chest — don't half-rep"],
    mistakes: ["Flaring elbows to 90 degrees — stresses the shoulder", "Bouncing the bar off your chest", "Lifting hips off the bench"],
  },
  "Barbell Bent-Over Row": {
    muscles: { primary: ["Lats", "Rhomboids", "Traps", "Rear delts"], secondary: ["Biceps", "Forearms", "Erectors"] },
    steps: [
      "Stand with feet shoulder-width apart, barbell over mid-foot.",
      "Hinge at the hips until your torso is roughly 45 degrees. Soft knee bend.",
      "Grip the bar just outside your knees, overhand or mixed grip.",
      "Pull the bar toward your lower chest, driving elbows back past your torso.",
      "Squeeze shoulder blades together at the top, then lower under control.",
    ],
    cues: ["Keep your back flat — think 'proud chest'", "Elbows travel back, not out to the sides", "Brace your core as if about to be punched"],
    mistakes: ["Rounding the lower back — drop the weight if this happens", "Standing too upright — reduces lat activation", "Using momentum to swing the weight up"],
  },
  "Overhead Press": {
    muscles: { primary: ["Front delts", "Lateral delts"], secondary: ["Triceps", "Upper chest", "Core"] },
    steps: [
      "Stand with feet hip-width, bar resting on your front delts.",
      "Brace your core and squeeze your glutes.",
      "Press the bar straight up, moving your head back slightly to clear your chin.",
      "Once the bar passes your forehead, push your head forward and lock out overhead.",
    ],
    cues: ["Bar path should be a straight line when viewed from the side", "Keep ribs down — don't arch excessively", "Full lockout at the top, biceps near ears"],
    mistakes: ["Leaning back too far — turns it into an incline press", "Pressing the bar forward instead of straight up", "Not bracing the core — lower back takes the load"],
  },
  "Weighted Pull-Up": {
    muscles: { primary: ["Lats", "Teres major"], secondary: ["Biceps", "Rear delts", "Forearms"] },
    steps: [
      "Hang from the bar with arms fully extended, shoulder-width or slightly wider grip.",
      "Attach weight via belt or hold a dumbbell between your feet.",
      "Pull yourself up by driving elbows down toward your hips.",
      "Chin over the bar, then lower under control to full extension.",
    ],
    cues: ["Initiate with your lats, not your arms", "Think about pulling the bar to your chest, not your chin to the bar", "Dead hang at the bottom — full stretch each rep"],
    mistakes: ["Kipping or swinging for momentum", "Half reps — not reaching full extension at the bottom", "Shrugging shoulders up toward ears instead of pulling them down"],
  },
  "Incline DB Press": {
    muscles: { primary: ["Upper chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Set the bench to 30–45 degrees. Sit back with a dumbbell in each hand.",
      "Press dumbbells up from shoulder level until arms are extended.",
      "Lower slowly until a deep stretch in the upper chest.",
      "Press back up without clanking the dumbbells together at the top.",
    ],
    cues: ["Keep a slight arch in your upper back — shoulders pinned to the bench", "Dumbbells travel in a slight arc, not straight up", "Control the negative — 2–3 seconds down"],
    mistakes: ["Setting the bench too steep — becomes a shoulder press", "Letting the dumbbells drift too wide at the bottom", "Losing tension at the top by fully locking elbows"],
  },
  "Cable Face Pull": {
    muscles: { primary: ["Rear delts", "Rotator cuff"], secondary: ["Traps", "Rhomboids"] },
    steps: [
      "Set a cable with rope attachment at upper-chest to face height.",
      "Grip the rope with thumbs pointing back toward you.",
      "Pull toward your face, separating the rope ends past your ears.",
      "Squeeze your rear delts and external rotators at the end position.",
    ],
    cues: ["High elbows — hands finish level with your ears", "Rotate your hands outward as you pull apart", "Pause for a full second at peak contraction"],
    mistakes: ["Using too much weight and turning it into a row", "Pulling to your chest instead of your face", "Letting your shoulders round forward at the start"],
  },
  "Barbell Back Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings", "Erectors", "Core"] },
    steps: [
      "Bar on your upper traps (high bar) or rear delts (low bar). Unrack and step back.",
      "Feet shoulder-width or slightly wider, toes turned out 15–30 degrees.",
      "Break at the hips and knees simultaneously. Descend until hip crease is below the knee.",
      "Drive up through your whole foot, keeping your chest up.",
    ],
    cues: ["Screw your feet into the floor — creates external rotation torque", "Big breath into your belly before each rep, brace hard", "Knees track over your toes — don't let them cave in"],
    mistakes: ["Good-morning squat — hips rise first while chest drops", "Cutting depth short — go to at least parallel", "Heels lifting off the floor — work on ankle mobility or use squat shoes"],
  },
  "Romanian Deadlift": {
    muscles: { primary: ["Hamstrings", "Glutes"], secondary: ["Erectors", "Forearms"] },
    steps: [
      "Stand with feet hip-width, holding the bar at hip height with an overhand grip.",
      "Push your hips back while keeping a slight knee bend — the bar stays close to your legs.",
      "Lower until you feel a deep hamstring stretch, typically mid-shin to just below the knee.",
      "Drive your hips forward to return to the start. Squeeze your glutes at the top.",
    ],
    cues: ["Think 'hips back' not 'bend over'", "The bar should almost slide down your thighs and shins", "Keep your lats engaged — imagine tucking your shoulder blades into your back pockets"],
    mistakes: ["Rounding the lower back — biggest risk with this exercise", "Bending the knees too much — turns it into a conventional deadlift", "Hyperextending at the top — stand tall, don't lean back"],
  },
  "Leg Press": {
    muscles: { primary: ["Quads"], secondary: ["Glutes", "Hamstrings"] },
    steps: [
      "Sit in the machine with your back flat against the pad.",
      "Place feet shoulder-width on the platform, about mid-height.",
      "Release the safeties and lower the platform until your knees reach about 90 degrees.",
      "Press through your whole foot back to the start without locking your knees.",
    ],
    cues: ["Keep your lower back pressed into the seat throughout", "Higher foot placement = more glute and hamstring", "Lower foot placement = more quad — but watch your knees"],
    mistakes: ["Going too deep and letting your lower back round off the pad", "Locking out your knees at the top", "Placing feet too narrow — knees cave inward"],
  },
  "Walking Lunges": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Stand upright holding dumbbells at your sides (or a barbell on your back).",
      "Step forward with one leg and lower until both knees are at roughly 90 degrees.",
      "Drive through the front foot to step forward into the next lunge.",
      "Alternate legs with each step.",
    ],
    cues: ["Keep your torso upright — don't lean forward", "Front knee tracks over the toes, not past them excessively", "Take a big enough step that your shin stays vertical"],
    mistakes: ["Steps too short — knee travels too far forward", "Letting the back knee slam into the ground", "Wobbling side to side — tighten your core"],
  },
  "Seated Leg Curl": {
    muscles: { primary: ["Hamstrings"], secondary: [] },
    steps: [
      "Adjust the machine so the pad sits on your lower calves, just above your ankles.",
      "Sit with your back flat against the pad, thighs supported.",
      "Curl your heels toward your glutes in a controlled arc.",
      "Pause at peak contraction, then return slowly to the start.",
    ],
    cues: ["Point your toes slightly to shift emphasis between inner and outer hamstrings", "Don't let the weight stack crash — control the eccentric", "Squeeze hard at the bottom of the curl"],
    mistakes: ["Using momentum by jerking your hips", "Not going through the full range of motion", "Setting the pad too high on your calves"],
  },
  "Standing Calf Raise": {
    muscles: { primary: ["Gastrocnemius"], secondary: ["Soleus"] },
    steps: [
      "Stand on the edge of a step or calf raise machine with balls of your feet on the platform.",
      "Lower your heels as far as comfortable for a full stretch.",
      "Push up onto your toes as high as possible.",
      "Hold the top for a beat, then lower slowly.",
    ],
    cues: ["Full range — deep stretch at the bottom, peak squeeze at the top", "Straight legs to target the gastrocnemius", "2–3 second negative on the way down"],
    mistakes: ["Bouncing at the bottom — no stretch, no growth", "Bending your knees — shifts load to the soleus", "Cutting range short — half reps are half results"],
  },
  "Chest-Supported DB Row": {
    muscles: { primary: ["Lats", "Rhomboids", "Traps"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Set an incline bench to about 30–45 degrees. Lie face down with your chest supported.",
      "Hold a dumbbell in each hand, arms hanging straight down.",
      "Row both dumbbells up by driving elbows back, squeezing your shoulder blades.",
      "Lower under control to full arm extension.",
    ],
    cues: ["Chest stays on the pad — no lifting off to cheat", "Rotate your wrists slightly outward at the top for more rear delt", "Let your shoulders protract at the bottom for full stretch"],
    mistakes: ["Lifting your chest off the bench to use momentum", "Shrugging your shoulders up instead of pulling elbows back", "Going too heavy and losing the contraction"],
  },
  "Cable Lateral Raise": {
    muscles: { primary: ["Lateral delts"], secondary: ["Traps"] },
    steps: [
      "Stand side-on to a low cable, handle in the far hand.",
      "Slight lean away from the machine for a deeper stretch.",
      "Raise your arm out to the side until your hand is at shoulder height.",
      "Lower under control — don't let the cable yank your arm down.",
    ],
    cues: ["Lead with your elbow, not your hand", "Slight bend in the elbow throughout — not straight-armed", "Pause at shoulder height — don't go above"],
    mistakes: ["Swinging your body to get the weight up", "Raising above shoulder height — traps take over", "Going too fast on the negative — free gains from the eccentric"],
  },
  "Seated Cable Row (wide grip)": {
    muscles: { primary: ["Mid-back", "Rhomboids", "Rear delts"], secondary: ["Lats", "Biceps"] },
    steps: [
      "Sit at the cable row station, feet on the platform, slight knee bend.",
      "Grip the wide bar with an overhand grip.",
      "Pull the bar toward your upper abdomen, driving elbows wide.",
      "Squeeze your shoulder blades together, then extend forward with control.",
    ],
    cues: ["Stay upright — don't rock back and forth", "Wide elbows emphasise rear delts and mid-back over lats", "Allow a slight stretch forward at the start — controlled, not sloppy"],
    mistakes: ["Excessive body lean — should be minimal", "Pulling to your lap instead of your upper stomach", "Rounding your upper back on the stretch"],
  },
  "Tricep Rope Pushdown": {
    muscles: { primary: ["Triceps (all three heads)"], secondary: [] },
    steps: [
      "Attach a rope to a high cable. Stand with a slight forward lean.",
      "Start with elbows at your sides, forearms roughly parallel to the floor.",
      "Push down and spread the rope apart at the bottom.",
      "Squeeze the triceps at full extension, then return to the start slowly.",
    ],
    cues: ["Elbows stay pinned to your sides — only your forearms move", "Split the rope at the bottom for peak contraction", "Don't lean into it with your body weight"],
    mistakes: ["Letting elbows flare forward — turns it into a pushdown/crunch hybrid", "Using too much weight and compensating with body lean", "Not reaching full elbow extension"],
  },
  "Incline DB Curl": {
    muscles: { primary: ["Biceps (long head)"], secondary: ["Brachialis", "Forearms"] },
    steps: [
      "Set the bench to 45–60 degrees. Sit back with a dumbbell in each hand, arms hanging down.",
      "Curl the dumbbells up while keeping your upper arms stationary.",
      "Squeeze at the top, then lower slowly to a full arm extension.",
    ],
    cues: ["Let your arms hang straight at the start — this is the stretch that makes it effective", "Don't swing your shoulders forward to help the curl", "Supinate (turn palms up) as you curl for full bicep activation"],
    mistakes: ["Bringing your elbows forward — keeps tension on the biceps only if elbows stay back", "Swinging the dumbbells instead of curling them", "Cutting the range short at the bottom — the stretch is the point"],
  },
  "Rear Delt Fly": {
    muscles: { primary: ["Rear delts"], secondary: ["Rhomboids", "Traps"] },
    steps: [
      "Bend forward at the hips or lie face down on an incline bench.",
      "Hold dumbbells with palms facing each other, arms hanging below you.",
      "Raise the dumbbells out to the sides in a wide arc, leading with your elbows.",
      "Squeeze at the top, then lower slowly.",
    ],
    cues: ["Think about moving your elbows, not your hands", "Slight bend in the elbows — locked throughout", "Pinch your shoulder blades at the top"],
    mistakes: ["Using too much weight — rear delts are small, go lighter than you think", "Turning it into a row by bending your elbows excessively", "Swinging your torso up to cheat the weight"],
  },
  "Conventional Deadlift": {
    muscles: { primary: ["Glutes", "Hamstrings", "Erectors", "Quads"], secondary: ["Lats", "Traps", "Forearms", "Core"] },
    steps: [
      "Stand with feet hip-width, bar over mid-foot. Shins nearly touching the bar.",
      "Hinge at the hips and grip the bar just outside your knees.",
      "Drop your hips, lift your chest, and take the slack out of the bar.",
      "Drive through the floor, keeping the bar close to your body. Hips and shoulders rise together.",
      "Lock out at the top — stand tall, squeeze glutes. Lower by hinging at the hips first.",
    ],
    cues: ["Push the floor away rather than pulling the bar up", "The bar should scrape your shins and thighs on the way up", "Big breath before each rep — brace like a belt"],
    mistakes: ["Rounding the lower back — the most common and dangerous error", "Hips shooting up first (stiff-leg deadlift by accident)", "Jerking the bar off the floor — take the slack out first"],
  },
  "Hack Squat": {
    muscles: { primary: ["Quads"], secondary: ["Glutes"] },
    steps: [
      "Position yourself in the hack squat machine, shoulders under the pads, back flat.",
      "Feet shoulder-width on the platform, slightly lower than mid-platform for quad focus.",
      "Release the safeties and lower until your thighs are at least parallel.",
      "Drive through your feet to return to the start.",
    ],
    cues: ["Keep your back flat against the pad at all times", "Push through your heels for more glute, balls of feet for more quad", "Don't lock out your knees at the top"],
    mistakes: ["Heels lifting off the platform", "Not going deep enough — parallel minimum", "Loading too much weight and losing back contact with the pad"],
  },
  "Bulgarian Split Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Stand about 2 feet in front of a bench. Place the top of your rear foot on the bench.",
      "Hold dumbbells at your sides or a barbell on your back.",
      "Lower your back knee toward the floor, keeping your front shin relatively vertical.",
      "Drive through your front foot to stand back up.",
    ],
    cues: ["Most of your weight should be on the front leg", "Keep your torso upright — slight forward lean is fine", "Front knee tracks over your toes, don't let it cave in"],
    mistakes: ["Standing too close to the bench — knee shoots past toes", "Standing too far — turns it into a hip flexor stretch", "Leaning forward excessively and losing balance"],
  },
  "Lying Leg Curl": {
    muscles: { primary: ["Hamstrings"], secondary: [] },
    steps: [
      "Lie face down on the machine, pad on your lower calves just above your ankles.",
      "Grip the handles and keep your hips pressed into the pad.",
      "Curl your heels toward your glutes.",
      "Pause at the top, then lower under control.",
    ],
    cues: ["Keep your hips flat — don't let them rise off the pad", "Point your toes away from you to increase hamstring activation", "Slow eccentric — 2–3 seconds on the way down"],
    mistakes: ["Lifting your hips to cheat the weight up", "Using momentum instead of controlled contraction", "Not going through the full range of motion"],
  },
  "Hip Thrust": {
    muscles: { primary: ["Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Sit on the floor with your upper back against a bench, barbell across your hip crease.",
      "Use a bar pad for comfort. Feet flat, about shoulder-width, close enough that shins are vertical at the top.",
      "Drive through your heels to lift your hips until your torso is parallel to the floor.",
      "Squeeze your glutes hard at the top, then lower under control.",
    ],
    cues: ["Tuck your chin — look forward, not at the ceiling", "Posterior pelvic tilt at the top — don't hyperextend your lower back", "Pause for a full second at lockout"],
    mistakes: ["Pushing through your toes instead of your heels", "Hyperextending your back instead of squeezing your glutes", "Feet too far from the bench — hamstrings take over"],
  },
  "Seated Calf Raise": {
    muscles: { primary: ["Soleus"], secondary: ["Gastrocnemius"] },
    steps: [
      "Sit in the machine with the pad on your lower thighs, balls of feet on the platform.",
      "Release the safety and lower your heels for a deep stretch.",
      "Push up onto your toes as high as possible.",
      "Pause at the top, then lower with a slow eccentric.",
    ],
    cues: ["Bent knees target the soleus specifically — that's the point", "Full range of motion every rep", "3-second negative for maximum growth stimulus"],
    mistakes: ["Bouncing reps with no control", "Not going through the full stretch at the bottom", "Rushing through sets — calves need time under tension"],
  },
  // ─── Alt + age-override exercises (hypertrophy) ─────────────────────────────
  "Arnold Press": {
    muscles: { primary: ["Front delts", "Lateral delts"], secondary: ["Triceps", "Upper chest"] },
    steps: [
      "Sit on a bench with back support, dumbbells at shoulder height, palms facing you.",
      "Press up while rotating your palms to face forward by the top.",
      "Lock out overhead, then reverse the rotation as you lower back to the start.",
    ],
    cues: ["Smooth rotation — don't jerk it", "Full lockout at the top", "Control the descent and rotation together"],
    mistakes: ["Rotating too early — palms should face forward only at the top", "Leaning back excessively", "Using momentum instead of controlled pressing"],
  },
  "Assisted Pull-Up": {
    muscles: { primary: ["Lats", "Teres major"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Set the assistance on the machine or loop a band around the bar and under your knees.",
      "Grip the bar shoulder-width or slightly wider.",
      "Pull yourself up until your chin clears the bar.",
      "Lower under control to full arm extension.",
    ],
    cues: ["Drive your elbows down, not back", "Squeeze at the top before lowering", "Use the least assistance you can manage with good form"],
    mistakes: ["Relying too much on the assistance — reduce it progressively", "Half reps — full extension at the bottom every time", "Swinging or kipping"],
  },
  "Assisted Pull-Up / Lat Pulldown": {
    muscles: { primary: ["Lats", "Teres major"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Use either an assisted pull-up machine or a lat pulldown station.",
      "Grip shoulder-width or slightly wider.",
      "Pull down (or up) until the bar reaches upper chest level.",
      "Return slowly to full arm extension. 3-second negative on each rep.",
    ],
    cues: ["Focus on the squeeze — slow and controlled", "Initiate with your lats, not your arms", "Full stretch at the top of every rep"],
    mistakes: ["Going too fast — tempo matters more at this stage", "Leaning back excessively on the pulldown", "Gripping too tight — let your back do the work"],
  },
  "Band Face Pull": {
    muscles: { primary: ["Rear delts", "Rotator cuff"], secondary: ["Traps", "Rhomboids"] },
    steps: [
      "Attach a resistance band at face height to a rack or post.",
      "Grip the band with both hands, thumbs pointing back.",
      "Pull toward your face, separating your hands past your ears.",
      "Squeeze rear delts, then return slowly.",
    ],
    cues: ["High elbows throughout", "Externally rotate at the end — thumbs point behind you", "Constant tension — don't let the band go slack"],
    mistakes: ["Using a band that's too heavy — form breaks down", "Pulling to your chest instead of your face", "Rushing the reps — this is a control exercise"],
  },
  "Band Pull-Apart": {
    muscles: { primary: ["Rear delts", "Rhomboids"], secondary: ["Traps"] },
    steps: [
      "Hold a resistance band in front of you at shoulder height, arms straight.",
      "Pull the band apart by squeezing your shoulder blades together.",
      "Bring the band to your chest, then return slowly.",
    ],
    cues: ["Arms stay straight — don't bend your elbows", "Squeeze your shoulder blades at the end", "Control the return — don't let the band snap back"],
    mistakes: ["Shrugging your shoulders up", "Bending the elbows to cheat the movement", "Going too fast — this is about contraction quality"],
  },
  "Belt Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings"] },
    steps: [
      "Attach the belt around your hips and stand on the platforms.",
      "Feet shoulder-width, toes slightly out.",
      "Squat down until thighs are parallel or below.",
      "Drive up through your whole foot.",
    ],
    cues: ["Torso stays upright — that's the whole point of belt squats", "Push knees out over toes", "No spinal load — so you can focus purely on your legs"],
    mistakes: ["Leaning forward — stay upright", "Not going deep enough", "Rushing reps — controlled tempo"],
  },
  "Cable Curl": {
    muscles: { primary: ["Biceps"], secondary: ["Brachialis", "Forearms"] },
    steps: [
      "Stand facing a low cable with a straight or EZ bar attachment.",
      "Curl the bar up, keeping elbows pinned to your sides.",
      "Squeeze at the top, then lower under control.",
    ],
    cues: ["Constant tension from the cable — use it", "Don't swing your body", "Full extension at the bottom, full squeeze at the top"],
    mistakes: ["Swaying the torso to generate momentum", "Letting elbows drift forward", "Going too heavy and losing the contraction"],
  },
  "Cable Incline Fly": {
    muscles: { primary: ["Upper chest"], secondary: ["Front delts"] },
    steps: [
      "Set cables at the lowest position. Lie on an incline bench between the pulleys.",
      "Grab the handles and press them up to the start position, slight bend in elbows.",
      "Open your arms wide in an arc until you feel a deep chest stretch.",
      "Squeeze your chest to bring the handles back together at the top.",
    ],
    cues: ["Think about hugging a tree — wide arc, not a press", "Constant slight bend in the elbows", "Squeeze hard at the top for peak contraction"],
    mistakes: ["Turning it into a press by bending elbows too much", "Going too heavy — flys are about stretch and squeeze", "Not controlling the eccentric"],
  },
  "Cable Kickback": {
    muscles: { primary: ["Glutes"], secondary: ["Hamstrings"] },
    steps: [
      "Attach an ankle cuff to a low cable. Face the machine.",
      "Kick your leg straight back, squeezing your glute at the top.",
      "Return slowly without letting the weight stack crash.",
    ],
    cues: ["Slight forward lean for balance — hold the machine", "Squeeze the glute hard at full extension", "Don't arch your lower back — move from the hip"],
    mistakes: ["Swinging the leg with momentum", "Arching the lower back instead of using the glute", "Going too heavy and losing control"],
  },
  "Cable Pull-Through": {
    muscles: { primary: ["Glutes", "Hamstrings"], secondary: ["Erectors"] },
    steps: [
      "Stand facing away from a low cable, rope attachment between your legs.",
      "Hinge at the hips, letting the cable pull your hands back between your legs.",
      "Drive your hips forward to stand tall, squeezing your glutes at the top.",
    ],
    cues: ["This is a hip hinge — push hips back, not bend at the waist", "Arms are just hooks — your glutes do the work", "Full glute squeeze at lockout"],
    mistakes: ["Squatting instead of hinging", "Pulling with your arms", "Hyperextending at the top"],
  },
  "Cable Row": {
    muscles: { primary: ["Lats", "Rhomboids"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Sit at a cable row station, feet on the platform, slight knee bend.",
      "Grip the handle and sit upright with arms extended.",
      "Pull the handle toward your lower chest, driving elbows back.",
      "Squeeze your shoulder blades, then extend slowly.",
    ],
    cues: ["Minimal body lean — stay upright", "Pull to your belly button, not your chest", "Let your shoulders protract slightly at the stretch for full ROM"],
    mistakes: ["Excessive rocking back and forth", "Rounding the upper back", "Using momentum instead of a controlled pull"],
  },
  "Close-Grip Bench Press": {
    muscles: { primary: ["Triceps", "Chest"], secondary: ["Front delts"] },
    steps: [
      "Lie flat on the bench, grip the bar about shoulder-width or slightly narrower.",
      "Unrack and lower the bar to your lower chest, keeping elbows tucked close.",
      "Press up, focusing on extending through the elbows.",
    ],
    cues: ["Elbows stay close to your body throughout", "Touch your lower chest / upper stomach area", "Lockout hard at the top — that's the tricep contraction"],
    mistakes: ["Grip too narrow — stresses the wrists, shoulder-width is fine", "Flaring elbows wide — defeats the purpose", "Bouncing the bar off the chest"],
  },
  "DB Lateral Raise": {
    muscles: { primary: ["Lateral delts"], secondary: ["Traps"] },
    steps: [
      "Stand with dumbbells at your sides, slight bend in elbows.",
      "Raise the dumbbells out to the sides until hands reach shoulder height.",
      "Pause briefly, then lower under control.",
    ],
    cues: ["Lead with your elbows, not your hands", "Pinky finger slightly higher than thumb — like pouring a jug", "Don't go above shoulder height"],
    mistakes: ["Swinging the weights up with momentum", "Shrugging your traps to help lift", "Going too heavy — lateral raises work best light with control"],
  },
  "Donkey Calf Raise": {
    muscles: { primary: ["Gastrocnemius"], secondary: ["Soleus"] },
    steps: [
      "Position yourself in the donkey calf raise machine or bend at the hips with weight on your back.",
      "Balls of feet on the platform, heels hanging off.",
      "Lower your heels for a deep stretch, then rise as high as possible.",
    ],
    cues: ["The hip-flexed position pre-stretches the gastrocnemius — makes it more effective", "Full range every rep", "Pause at the top and the bottom"],
    mistakes: ["Bouncing through reps", "Not going through the full stretch", "Bending your knees — legs stay straight"],
  },
  "Dumbbell Bench Press": {
    muscles: { primary: ["Chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Sit on the bench with dumbbells on your thighs, then kick them up as you lie back.",
      "Press the dumbbells up until arms are extended, palms facing forward.",
      "Lower slowly until a deep stretch in the chest, elbows at about 45 degrees.",
      "Press back up without clanking the dumbbells together.",
    ],
    cues: ["Squeeze shoulder blades together into the bench", "Dumbbells travel in a slight arc", "Greater range of motion than barbell — use it"],
    mistakes: ["Dropping the dumbbells too fast on the negative", "Elbows flaring to 90 degrees", "Uneven pressing — one arm ahead of the other"],
  },
  "Dumbbell RDL": {
    muscles: { primary: ["Hamstrings", "Glutes"], secondary: ["Erectors", "Forearms"] },
    steps: [
      "Stand with feet hip-width, a dumbbell in each hand in front of your thighs.",
      "Push your hips back, lowering the dumbbells along your legs. Slight knee bend.",
      "Go until you feel a deep hamstring stretch, then drive hips forward to stand.",
    ],
    cues: ["Dumbbells stay close to your legs throughout", "Same hip hinge pattern as barbell RDL — just more natural wrist position", "Squeeze glutes at the top"],
    mistakes: ["Rounding the back", "Bending the knees too much", "Not hinging deep enough — go until you feel the hamstrings"],
  },
  "Dumbbell Row": {
    muscles: { primary: ["Lats", "Rhomboids", "Traps"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Place one hand and knee on a bench, other foot on the floor.",
      "Hold a dumbbell in your free hand, arm hanging straight down.",
      "Row the dumbbell to your hip, driving your elbow past your torso.",
      "Lower under control to a full stretch.",
    ],
    cues: ["Pull to your hip, not your chest — maximises lat involvement", "Keep your torso parallel to the floor", "Slight rotation at the top is fine — don't force a rigid torso"],
    mistakes: ["Twisting your torso to heave the weight up", "Rowing to the chest instead of the hip", "Cutting range short — full extension at the bottom"],
  },
  "Front Squat": {
    muscles: { primary: ["Quads", "Core"], secondary: ["Glutes", "Upper back"] },
    steps: [
      "Bar rests on your front delts in a clean grip or crossed-arm position.",
      "Unrack, feet shoulder-width, toes slightly out.",
      "Squat straight down, keeping elbows high and chest up.",
      "Drive up through your whole foot.",
    ],
    cues: ["Elbows stay high — if they drop, the bar rolls", "More upright torso than back squat", "Go as deep as you can while keeping your back straight"],
    mistakes: ["Elbows dropping — the most common issue", "Leaning forward — this is a quad exercise, stay upright", "Wrist pain — try the crossed-arm grip instead"],
  },
  "Glute Bridge": {
    muscles: { primary: ["Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Lie on your back, knees bent, feet flat on the floor close to your glutes.",
      "Drive through your heels to lift your hips toward the ceiling.",
      "Squeeze your glutes hard at the top, then lower slowly.",
    ],
    cues: ["Posterior pelvic tilt at the top — tuck your tailbone", "Don't hyperextend your back — it's a glute exercise", "Pause at the top for a full second"],
    mistakes: ["Pushing through your toes instead of heels", "Arching your lower back at the top", "Rushing through reps without squeezing"],
  },
  "Goblet Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core", "Upper back"] },
    steps: [
      "Hold a dumbbell or kettlebell vertically at your chest, cupping the top end.",
      "Feet shoulder-width, toes slightly out.",
      "Squat down, keeping the weight close to your chest and elbows inside your knees.",
      "Drive up through your whole foot.",
    ],
    cues: ["The weight acts as a counterbalance — use it to stay upright", "Elbows push your knees out at the bottom", "Great for learning squat mechanics"],
    mistakes: ["Letting the weight drift away from your chest", "Not going deep enough — aim for full depth", "Rounding the upper back"],
  },
  "Hack Squat Machine": {
    muscles: { primary: ["Quads"], secondary: ["Glutes"] },
    steps: [
      "Position yourself in the machine, shoulders under the pads, back flat.",
      "Feet shoulder-width on the platform.",
      "Release the safeties and lower until thighs are at least parallel.",
      "Drive through your feet to return to the start.",
    ],
    cues: ["Back stays flat against the pad throughout", "Lower foot placement = more quad emphasis", "Don't lock out your knees at the top"],
    mistakes: ["Back coming off the pad", "Not reaching parallel depth", "Locking out knees aggressively"],
  },
  "Incline Barbell Press": {
    muscles: { primary: ["Upper chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Set the bench to 30–45 degrees. Unrack the bar with a grip slightly wider than shoulder-width.",
      "Lower the bar to your upper chest, just below the collarbone.",
      "Press up in a slight arc back toward the rack. Lock out.",
    ],
    cues: ["Shoulder blades squeezed and retracted", "Touch your upper chest — not your chin, not your stomach", "Slight arch in your upper back, not your lower back"],
    mistakes: ["Bench too steep — turns it into a shoulder press", "Bar path drifting too far forward", "Bouncing off the chest"],
  },
  "Incline Cable Fly": {
    muscles: { primary: ["Upper chest"], secondary: ["Front delts"] },
    steps: [
      "Set an incline bench between two low cable pulleys.",
      "Grab the handles and lie back, arms extended above you with a slight elbow bend.",
      "Open your arms in a wide arc until you feel a deep chest stretch.",
      "Squeeze your chest to bring the handles together at the top.",
    ],
    cues: ["Arc motion — not a press", "Constant cable tension makes this superior to dumbbell flys", "Squeeze hard at the top"],
    mistakes: ["Bending elbows too much — turns it into a press", "Going too heavy", "Not controlling the stretch at the bottom"],
  },
  "Incline Machine Press": {
    muscles: { primary: ["Upper chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Adjust the seat so the handles align with your upper chest.",
      "Grip the handles and press forward until arms are extended.",
      "Return slowly to the start with a controlled negative.",
    ],
    cues: ["Machine guides the path — focus on squeezing your chest", "Don't lock out aggressively", "Great for going to failure safely"],
    mistakes: ["Seat too low — shoulders take over", "Rushing the negative — slow and controlled", "Not using full range of motion"],
  },
  "Landmine Press": {
    muscles: { primary: ["Front delts", "Upper chest"], secondary: ["Triceps", "Core"] },
    steps: [
      "Place one end of a barbell in a landmine attachment or corner.",
      "Stand holding the other end at shoulder height with one or both hands.",
      "Press the bar up and forward in an arc.",
      "Lower under control back to shoulder height.",
    ],
    cues: ["The angled path is easier on the shoulder joint than straight overhead pressing", "Lean slightly into the press", "Core stays braced throughout"],
    mistakes: ["Arching the back — stay tight", "Pressing straight up instead of following the natural arc", "Not controlling the descent"],
  },
  "Lat Pulldown": {
    muscles: { primary: ["Lats", "Teres major"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Sit at the pulldown machine, thighs secured under the pad.",
      "Grip the bar slightly wider than shoulder-width.",
      "Pull the bar down to your upper chest, driving elbows down and back.",
      "Return slowly to full arm extension.",
    ],
    cues: ["Lean back slightly — about 15 degrees", "Pull to your chest, not behind your neck", "Squeeze your lats at the bottom of each rep"],
    mistakes: ["Leaning back too far and turning it into a row", "Pulling behind the neck — shoulder injury risk", "Using momentum to swing the weight down"],
  },
  "Leg Press Calf Raise": {
    muscles: { primary: ["Gastrocnemius", "Soleus"], secondary: [] },
    steps: [
      "Sit in the leg press machine with just the balls of your feet on the bottom edge of the platform.",
      "Extend your legs (don't lock out) and release the safeties.",
      "Push through your toes to extend your ankles fully.",
      "Lower slowly for a deep calf stretch.",
    ],
    cues: ["Small range of motion — all the work is in the ankle", "Don't bend your knees — only your ankles move", "Full stretch at the bottom every rep"],
    mistakes: ["Bending knees to help push — ankles only", "Bouncing at the bottom", "Using too much weight and losing range of motion"],
  },
  "Machine Chest Press": {
    muscles: { primary: ["Chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Adjust the seat so the handles are at mid-chest height.",
      "Grip the handles and press forward until arms are extended.",
      "Return slowly to the start position.",
    ],
    cues: ["Machine guides the path — focus purely on chest contraction", "Great for isolating the chest without stabiliser fatigue", "Safe to push close to failure"],
    mistakes: ["Seat too high or low — handles should be at chest level", "Not using full range of motion", "Rushing through reps"],
  },
  "Machine Lateral Raise": {
    muscles: { primary: ["Lateral delts"], secondary: ["Traps"] },
    steps: [
      "Sit in the machine with your arms against the pads.",
      "Raise the pads out to the sides until your arms are at shoulder height.",
      "Lower under control.",
    ],
    cues: ["Machine removes momentum — every rep is strict", "Pause at the top", "Don't go above shoulder height"],
    mistakes: ["Shrugging up to help the movement", "Going above shoulder height — traps take over", "Rushing the negative"],
  },
  "Nordic Curl": {
    muscles: { primary: ["Hamstrings"], secondary: [] },
    steps: [
      "Kneel on a pad with your ankles secured under a bar or held by a partner.",
      "Keeping your hips extended, slowly lower your body toward the floor.",
      "Use your hamstrings to control the descent as long as possible.",
      "Catch yourself with your hands and push back up to assist the return.",
    ],
    cues: ["Stay straight from knees to shoulders — don't bend at the hips", "Control the eccentric — that's where the growth comes from", "Use your hands to assist on the way up as needed"],
    mistakes: ["Bending at the hips instead of staying straight", "Dropping too fast — the slow lowering is the exercise", "Not progressing — aim to lower a little further each session"],
  },
  "Overhead Tricep Extension": {
    muscles: { primary: ["Triceps (long head)"], secondary: [] },
    steps: [
      "Hold a dumbbell or cable rope overhead with arms extended.",
      "Lower behind your head by bending at the elbows.",
      "Extend back up to the start, squeezing your triceps.",
    ],
    cues: ["Elbows stay close to your head and point forward", "Full stretch at the bottom — the long head needs the overhead position", "Don't flare your elbows wide"],
    mistakes: ["Elbows flaring out to the sides", "Arching the back to press the weight", "Cutting range short — go deep for the stretch"],
  },
  "Preacher Curl": {
    muscles: { primary: ["Biceps (short head)"], secondary: ["Brachialis"] },
    steps: [
      "Sit at the preacher bench, upper arms flat on the pad.",
      "Curl the bar or dumbbells up, keeping your upper arms on the pad.",
      "Squeeze at the top, then lower slowly to near-full extension.",
    ],
    cues: ["The pad removes all momentum — pure bicep work", "Don't fully lock out at the bottom — keep slight tension", "Slow negative — 2–3 seconds down"],
    mistakes: ["Lifting your elbows off the pad to cheat", "Dropping the weight on the eccentric", "Hyperextending the elbow at the bottom — slight bend always"],
  },
  "Reverse Lunge": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Stand upright holding dumbbells at your sides.",
      "Step one foot backward and lower until both knees are at about 90 degrees.",
      "Drive through your front foot to return to standing.",
      "Alternate legs or complete all reps on one side.",
    ],
    cues: ["Easier on the knees than forward lunges — less shear force", "Keep your torso upright", "Front shin stays roughly vertical"],
    mistakes: ["Stepping too short — knee shoots too far forward", "Leaning forward excessively", "Letting the back knee slam the floor"],
  },
  "Reverse Pec Deck": {
    muscles: { primary: ["Rear delts"], secondary: ["Rhomboids", "Traps"] },
    steps: [
      "Sit facing the machine, chest against the pad.",
      "Grip the handles with arms extended in front of you.",
      "Open your arms in a wide arc, squeezing your rear delts.",
      "Return slowly to the start.",
    ],
    cues: ["Lead with your elbows, not your hands", "Squeeze your shoulder blades at the end", "Don't go behind your shoulder line — stop when arms are in line with your body"],
    mistakes: ["Using too much weight and losing the contraction", "Swinging the handles with momentum", "Not fully returning to the start — use full ROM"],
  },
  "Seated Cable Row": {
    muscles: { primary: ["Lats", "Rhomboids"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Sit with feet on the platform, slight knee bend. Grip the V-handle.",
      "Sit tall, arms extended.",
      "Pull the handle toward your belly button, squeezing your shoulder blades.",
      "Extend slowly back to the start.",
    ],
    cues: ["Minimal body lean", "Pull to your belly, not your chest", "Let your shoulders stretch forward slightly at the start for full ROM"],
    mistakes: ["Rocking your torso back and forth", "Rounding your back on the stretch", "Using arms more than back — think elbows, not hands"],
  },
  "Seated DB Shoulder Press": {
    muscles: { primary: ["Front delts", "Lateral delts"], secondary: ["Triceps"] },
    steps: [
      "Sit on a bench with back support, dumbbells at shoulder height, palms forward.",
      "Press both dumbbells overhead until arms are extended.",
      "Lower slowly back to shoulder height.",
    ],
    cues: ["Back stays against the pad", "Press straight up — don't let the dumbbells drift forward", "Full lockout at the top"],
    mistakes: ["Arching the back away from the pad", "Pressing unevenly — one arm ahead of the other", "Not going through the full range of motion"],
  },
  "Single-Leg Leg Press": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings"] },
    steps: [
      "Sit in the leg press machine, place one foot on the platform.",
      "Release the safeties and lower until your knee reaches about 90 degrees.",
      "Press through your foot back to the start. Complete all reps then switch legs.",
    ],
    cues: ["Keep your lower back pressed into the seat", "Machine guides the path — focus on the working leg", "Start lighter than you think — single leg is humbling"],
    mistakes: ["Going too deep and lower back rounding off the pad", "Locking out the knee at the top", "Pushing off with the non-working leg on the floor"],
  },
  "Smith Machine Bench Press": {
    muscles: { primary: ["Chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Position the bench so the bar path hits your mid-chest.",
      "Grip slightly wider than shoulder-width. Unrack by twisting the bar.",
      "Lower to your chest, then press up and twist to rack.",
    ],
    cues: ["Fixed bar path — focus purely on pressing force", "Bench position is critical — test with an empty bar first", "Good for training to failure safely"],
    mistakes: ["Bench positioned wrong — bar hits too high or low", "Not retracting shoulder blades", "Using the Smith as a crutch — still use free weights as your main lift"],
  },
  "Step-Ups": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Stand facing a bench or box, holding dumbbells at your sides.",
      "Step one foot onto the box and drive through it to stand up.",
      "Lower back down under control.",
    ],
    cues: ["Drive through the heel of the top foot", "Don't push off with the bottom foot — make the top leg do the work", "Box height should put your knee at roughly 90 degrees"],
    mistakes: ["Pushing off the ground foot instead of the box foot", "Leaning forward excessively", "Box too high — losing balance and form"],
  },
  "Step-Up (slow eccentric)": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Stand on a box or step, holding dumbbells at your sides.",
      "Slowly lower one foot to the ground over 3 seconds, controlling with the standing leg.",
      "Lightly tap the floor, then drive back up.",
    ],
    cues: ["3-second lowering is the whole point — don't rush", "Standing leg does all the work", "Stay upright — don't lean toward the stepping side"],
    mistakes: ["Dropping too fast — defeats the purpose", "Shifting weight to the lower leg", "Box too high for controlled movement"],
  },
  "Straight Arm Pulldown": {
    muscles: { primary: ["Lats"], secondary: ["Teres major", "Rear delts"] },
    steps: [
      "Stand facing a high cable with a straight bar attachment.",
      "Arms straight, pull the bar down in an arc to your thighs.",
      "Squeeze your lats at the bottom, then return slowly.",
    ],
    cues: ["Arms stay straight — only your shoulders move", "Think about pushing the bar to your hips, not pulling", "Great lat isolation — feel the squeeze"],
    mistakes: ["Bending the elbows — turns it into a pulldown", "Leaning too far forward", "Using too much weight and losing the isolation"],
  },
  "Sumo Deadlift": {
    muscles: { primary: ["Quads", "Glutes", "Hamstrings"], secondary: ["Erectors", "Traps", "Forearms"] },
    steps: [
      "Wide stance, toes pointed out 30–45 degrees. Bar over mid-foot.",
      "Grip the bar between your knees with arms straight down.",
      "Drop your hips, lift your chest, and drive through the floor.",
      "Lock out at the top, squeezing glutes.",
    ],
    cues: ["Push your knees out hard — they should track over your toes", "More upright torso than conventional — use that", "Hips and shoulders rise together"],
    mistakes: ["Hips shooting up first — stay patient off the floor", "Knees caving in — push them out", "Not setting up wide enough — experiment with stance width"],
  },
  "T-Bar Row": {
    muscles: { primary: ["Lats", "Rhomboids", "Traps"], secondary: ["Biceps", "Rear delts", "Erectors"] },
    steps: [
      "Straddle the T-bar, grip the handles, and stand with a slight hip hinge.",
      "Pull the weight toward your chest, driving elbows back.",
      "Squeeze at the top, then lower under control.",
    ],
    cues: ["Chest up, back flat throughout", "Pull to your upper abdomen / lower chest area", "Elbows stay close to your body"],
    mistakes: ["Rounding the lower back", "Standing too upright — maintain the hip hinge", "Using momentum to swing the weight"],
  },
  "Trap Bar Deadlift": {
    muscles: { primary: ["Quads", "Glutes", "Hamstrings", "Erectors"], secondary: ["Traps", "Forearms", "Core"] },
    steps: [
      "Stand inside the trap bar, feet hip-width.",
      "Hinge down and grip the handles at your sides.",
      "Lift your chest, brace your core, and drive through the floor.",
      "Stand tall at the top, then lower under control.",
    ],
    cues: ["Neutral grip is easier on the back and shoulders", "More upright than a conventional deadlift — that's the advantage", "Push the floor away rather than pulling the bar"],
    mistakes: ["Rounding the back — same rules as any deadlift", "Hips shooting up first", "Not bracing properly before each rep"],
  },
  "Wide Grip Lat Pulldown": {
    muscles: { primary: ["Lats", "Teres major"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Grip the pulldown bar well outside shoulder-width.",
      "Lean back slightly and pull the bar to your upper chest.",
      "Squeeze at the bottom, then return slowly to full arm extension.",
    ],
    cues: ["Wide grip shifts emphasis to the outer lats — width builder", "Pull to your upper chest, not behind your neck", "Control the return — don't let the weight yank you up"],
    mistakes: ["Pulling behind the neck — shoulder injury risk", "Leaning back too far", "Grip too wide — if your wrists hurt, narrow slightly"],
  },
  // ─── Strength regime exercises ──────────────────────────────────────────────
  "Deadlift": {
    muscles: { primary: ["Glutes", "Hamstrings", "Erectors", "Quads"], secondary: ["Lats", "Traps", "Forearms", "Core"] },
    steps: [
      "Stand with feet hip-width, bar over mid-foot.",
      "Hinge down, grip just outside knees. Lift chest, brace core.",
      "Drive through the floor — hips and shoulders rise together.",
      "Lock out by squeezing glutes. Lower by hinging hips first.",
    ],
    cues: ["Push the floor away, don't pull the bar", "Bar stays glued to your body", "Big breath and brace before every rep"],
    mistakes: ["Rounding the lower back", "Hips shooting up first", "Jerking the bar off the floor"],
  },
  "Barbell Row": {
    muscles: { primary: ["Lats", "Rhomboids", "Traps"], secondary: ["Biceps", "Erectors", "Rear delts"] },
    steps: [
      "Stand with feet shoulder-width, bar hanging at arm's length.",
      "Hinge forward to about 45 degrees, slight knee bend.",
      "Row the bar to your lower chest, elbows driving back.",
      "Lower under control.",
    ],
    cues: ["Flat back throughout", "Pull to your belly, not your chest", "Squeeze shoulder blades at the top"],
    mistakes: ["Rounding the back", "Standing too upright", "Using momentum to swing"],
  },
  "Cable Row (close grip)": {
    muscles: { primary: ["Lats", "Rhomboids"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Sit at the cable row, feet on the platform, V-handle attached.",
      "Pull the handle to your lower stomach, elbows close to your body.",
      "Squeeze at the end, then extend forward with control.",
    ],
    cues: ["Close grip hits the lats harder than wide grip", "Minimal body lean", "Let shoulders stretch forward at the start for full ROM"],
    mistakes: ["Rocking excessively", "Pulling to the chest instead of the stomach", "Rushing the eccentric"],
  },
  "DB Hammer Curl": {
    muscles: { primary: ["Brachialis", "Biceps"], secondary: ["Forearms"] },
    steps: [
      "Stand with dumbbells at your sides, palms facing your body.",
      "Curl the dumbbells up keeping palms neutral (facing each other).",
      "Squeeze at the top, lower under control.",
    ],
    cues: ["Neutral grip targets the brachialis — builds arm thickness", "Elbows pinned to your sides", "No swinging"],
    mistakes: ["Swinging the body for momentum", "Turning the wrists during the curl", "Using too much weight and losing form"],
  },
  "Shrugs": {
    muscles: { primary: ["Upper traps"], secondary: ["Levator scapulae"] },
    steps: [
      "Hold a barbell or dumbbells at arm's length, arms straight.",
      "Shrug your shoulders straight up toward your ears.",
      "Hold at the top for a beat, then lower slowly.",
    ],
    cues: ["Straight up and down — don't roll your shoulders", "Hold the squeeze at the top", "Heavy weight is fine — traps respond to load"],
    mistakes: ["Rolling shoulders forward or back — injury risk", "Bending the elbows to cheat", "Not holding the contraction at the top"],
  },
  "Pause Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core", "Erectors"] },
    steps: [
      "Set up as a normal back squat. Descend to the bottom position.",
      "Pause for 2 full seconds at the bottom — no bouncing.",
      "Drive up explosively from the dead stop.",
    ],
    cues: ["Stay tight during the pause — don't relax", "Breathe and brace before descending", "Builds strength out of the hole"],
    mistakes: ["Not pausing long enough — count to 2 honestly", "Relaxing at the bottom and losing tightness", "Using the same weight as regular squats — go lighter"],
  },
  "Good Morning": {
    muscles: { primary: ["Hamstrings", "Erectors"], secondary: ["Glutes"] },
    steps: [
      "Bar on upper back as for a squat. Feet hip-width.",
      "Hinge forward at the hips with a slight knee bend.",
      "Go until your torso is roughly parallel to the floor.",
      "Drive hips forward to stand up.",
    ],
    cues: ["Think of it as an RDL with the bar on your back", "Slight knee bend — not a squat", "Keep your back flat throughout"],
    mistakes: ["Rounding the lower back — most dangerous error", "Going too heavy before mastering the movement", "Squatting instead of hinging"],
  },
  "Hip Thrust (heavy)": {
    muscles: { primary: ["Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Upper back on bench, heavy barbell across hip crease with pad.",
      "Feet flat, shoulder-width, shins vertical at the top.",
      "Drive hips up hard — squeeze glutes at lockout.",
      "Lower with a 2-second negative.",
    ],
    cues: ["Tuck your chin, look forward", "Posterior pelvic tilt at the top", "This is for max glute load — go heavy"],
    mistakes: ["Hyperextending the back instead of squeezing glutes", "Feet too far away — hamstrings dominate", "Not using a bar pad — painful and distracting"],
  },
  "Pendlay Row": {
    muscles: { primary: ["Lats", "Rhomboids", "Traps"], secondary: ["Biceps", "Erectors"] },
    steps: [
      "Bar on the floor. Hinge to a flat back, grip outside knees.",
      "Explosively row the bar to your lower chest.",
      "Lower the bar back to the floor — dead stop each rep.",
    ],
    cues: ["Each rep starts from the floor — no bounce", "Flat back, torso close to parallel", "Explosive pull, controlled lower"],
    mistakes: ["Torso rising during the pull", "Not returning to a dead stop", "Rounding the back"],
  },
  "Rack Pull": {
    muscles: { primary: ["Erectors", "Traps", "Glutes"], secondary: ["Hamstrings", "Forearms"] },
    steps: [
      "Set the bar in a rack at knee height or just below.",
      "Grip and set up as for a deadlift — flat back, braced core.",
      "Pull to lockout, squeezing at the top.",
      "Lower to the pins under control.",
    ],
    cues: ["Partial range — you can go heavier than a full deadlift", "Great for lockout strength", "Keep the bar close to your body"],
    mistakes: ["Rounding the upper back under heavy load", "Hitching the bar up with hip flexion", "Dropping the bar instead of lowering"],
  },
  "Lat Pulldown (heavy)": {
    muscles: { primary: ["Lats", "Teres major"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Sit at the pulldown, thighs secured. Grip slightly wider than shoulders.",
      "Pull the bar to your upper chest with a slight lean back.",
      "Squeeze your lats, then return slowly.",
    ],
    cues: ["Go heavy — this is a strength movement, not a pump exercise", "Controlled negative despite the load", "Slight lean, not a full recline"],
    mistakes: ["Leaning way back to cheat the weight", "Pulling behind the neck", "Losing the eccentric control"],
  },
  "Band-Assisted Pull-Up": {
    muscles: { primary: ["Lats", "Teres major"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Loop a band over the pull-up bar and place one foot or knee in the loop.",
      "Hang with arms fully extended.",
      "Pull up until your chin clears the bar.",
      "Lower under control to full extension.",
    ],
    cues: ["Use the thinnest band you can manage with good form", "Full dead hang at the bottom", "Same technique as a regular pull-up"],
    mistakes: ["Using too thick a band — progress by going thinner", "Kipping or swinging", "Not going to full extension at the bottom"],
  },
  "Seated Row": {
    muscles: { primary: ["Lats", "Rhomboids"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Sit at the cable row or machine row station.",
      "Pull the handle toward your stomach, squeezing shoulder blades.",
      "Extend arms forward with control.",
    ],
    cues: ["Sit tall — chest up", "Pull to belly level", "Controlled stretch at the start"],
    mistakes: ["Excessive body lean", "Rounding the back", "Rushing through reps"],
  },
  "Chest-Supported Row": {
    muscles: { primary: ["Lats", "Rhomboids", "Traps"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Lie face down on an incline bench, dumbbells or handles hanging below.",
      "Row both weights up, squeezing shoulder blades together.",
      "Lower to full extension.",
    ],
    cues: ["Chest stays on the pad — zero momentum", "Great for isolating the back without lower back fatigue", "Let shoulders protract at the bottom"],
    mistakes: ["Lifting chest off the pad to cheat", "Shrugging instead of rowing", "Going too heavy and losing contraction"],
  },
  "Barbell Curl": {
    muscles: { primary: ["Biceps"], secondary: ["Forearms", "Brachialis"] },
    steps: [
      "Stand with a barbell, shoulder-width underhand grip.",
      "Curl the bar up keeping elbows pinned to your sides.",
      "Squeeze at the top, lower under control.",
    ],
    cues: ["Upper arms don't move — only forearms", "No body English", "Straight bar or EZ bar — EZ is easier on wrists"],
    mistakes: ["Swinging the torso to generate momentum", "Elbows drifting forward", "Half reps at the top"],
  },
  "DB Shrug": {
    muscles: { primary: ["Upper traps"], secondary: ["Levator scapulae"] },
    steps: [
      "Stand holding dumbbells at your sides.",
      "Shrug straight up toward your ears.",
      "Hold the contraction, then lower slowly.",
    ],
    cues: ["Straight up and down — no rolling", "Dumbbells allow a slightly more natural path than a barbell", "Heavy is fine — traps are strong"],
    mistakes: ["Rolling shoulders", "Bending elbows", "Rushing through reps without squeezing"],
  },
  "Machine Shrug": {
    muscles: { primary: ["Upper traps"], secondary: ["Levator scapulae"] },
    steps: [
      "Stand in the shrug machine, handles at your sides.",
      "Shrug straight up.",
      "Hold at the top, lower slowly.",
    ],
    cues: ["Machine guides the path — focus on the squeeze", "Go heavy", "Hold the contraction for 1–2 seconds"],
    mistakes: ["Not using full range", "Going too fast", "Rolling shoulders"],
  },
  "Low-Bar Squat": {
    muscles: { primary: ["Quads", "Glutes", "Hamstrings"], secondary: ["Erectors", "Core"] },
    steps: [
      "Bar sits across your rear delts, lower than a high-bar squat.",
      "Wider stance, toes out. More forward lean is normal.",
      "Squat to parallel, then drive up.",
    ],
    cues: ["More hip-dominant than high bar — you can typically lift more", "Wrist flexibility matters — work on it", "Chest up as much as possible despite the lean"],
    mistakes: ["Bar sliding down your back — squeeze your rear delts tight", "Excessive forward lean turning it into a good morning", "Wrist pain — try a wider grip or thumb-over grip"],
  },
  "Safety Bar Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core", "Upper back"] },
    steps: [
      "The safety bar sits on your traps with handles in front.",
      "Grip the handles, unrack, and squat as normal.",
      "The bar tries to pitch you forward — fight it by staying upright.",
    ],
    cues: ["Easier on the shoulders than a straight bar", "Builds upper back strength due to the forward pull", "Great for anyone with shoulder mobility issues"],
    mistakes: ["Letting the bar tip you forward", "Not bracing hard enough — the bar amplifies any weakness", "Going too deep before you're used to the balance"],
  },
  "Box Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Set a box at parallel depth behind you. Bar on back.",
      "Squat back and sit on the box — brief pause.",
      "Drive up explosively off the box.",
    ],
    cues: ["Sit back onto the box, don't plop down", "Brief pause — not a rest, stay braced", "Teaches you to squat to consistent depth"],
    mistakes: ["Crashing onto the box — sit with control", "Relaxing on the box and losing tension", "Rocking forward to stand up instead of driving through the legs"],
  },
  "Barbell RDL": {
    muscles: { primary: ["Hamstrings", "Glutes"], secondary: ["Erectors", "Forearms"] },
    steps: [
      "Same movement as the Romanian Deadlift — bar at hip height, hinge at hips.",
      "Lower until deep hamstring stretch, then drive hips forward.",
    ],
    cues: ["Identical to Romanian Deadlift", "Bar slides down your thighs", "Squeeze glutes at the top"],
    mistakes: ["Rounding the lower back", "Bending knees too much", "Hyperextending at the top"],
  },
  "45° Back Extension": {
    muscles: { primary: ["Erectors", "Glutes"], secondary: ["Hamstrings"] },
    steps: [
      "Position yourself face down on the 45-degree back extension bench.",
      "Cross arms over chest or behind head.",
      "Lower your torso until you feel a stretch, then extend back up.",
    ],
    cues: ["Squeeze glutes at the top — don't hyperextend", "Slow and controlled", "Add a weight plate for progression"],
    mistakes: ["Hyperextending at the top — stop when your body is straight", "Going too fast — this is about control", "Rounding excessively at the bottom"],
  },
  "Barbell Glute Bridge": {
    muscles: { primary: ["Glutes"], secondary: ["Hamstrings"] },
    steps: [
      "Lie on the floor, barbell across hip crease.",
      "Knees bent, feet flat.",
      "Drive hips up, squeeze glutes at the top.",
      "Lower back down.",
    ],
    cues: ["Like a hip thrust but on the floor — less range of motion", "Pelvic tilt at the top", "Good for very heavy loads"],
    mistakes: ["Hyperextending the back", "Pushing through toes instead of heels", "Not squeezing at the top"],
  },
  "Rear-Foot-Elevated RDL": {
    muscles: { primary: ["Hamstrings", "Glutes"], secondary: ["Erectors", "Core"] },
    steps: [
      "Rear foot elevated on a bench behind you.",
      "Hinge forward at the hips, lowering a dumbbell toward the floor.",
      "Drive hips forward to return to standing.",
    ],
    cues: ["Single-leg hip hinge — very challenging for balance", "Keep hips square — don't rotate", "Go lighter than you think"],
    mistakes: ["Rounding the back", "Rotating the hips", "Losing balance — use a wall for support initially"],
  },
  "Step-Up (loaded)": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Hold dumbbells or a barbell. Step onto a box with one foot.",
      "Drive through the top foot to stand up.",
      "Lower back down under control.",
    ],
    cues: ["All the work comes from the top leg", "Don't push off the ground foot", "Heavier load than regular step-ups"],
    mistakes: ["Using the bottom foot to push off", "Leaning forward excessively", "Box too high for controlled form"],
  },
  "Stiff-Leg Deadlift": {
    muscles: { primary: ["Hamstrings", "Erectors"], secondary: ["Glutes"] },
    steps: [
      "Stand with barbell at hip height. Legs stay nearly straight.",
      "Hinge forward, lowering bar toward the floor.",
      "Go until hamstring stretch limits you, then stand up.",
    ],
    cues: ["Straighter legs than an RDL — more hamstring emphasis", "Back stays flat", "Bar stays close to legs"],
    mistakes: ["Rounding the back", "Locking knees completely — slight softness is fine", "Going too heavy before hamstring flexibility allows it"],
  },
  "DB RDL": {
    muscles: { primary: ["Hamstrings", "Glutes"], secondary: ["Erectors"] },
    steps: [
      "Hold dumbbells in front of thighs.",
      "Hinge at hips, lowering dumbbells along your legs.",
      "Drive hips forward to stand.",
    ],
    cues: ["Same as Dumbbell RDL — identical movement", "DBs allow more natural wrist angle", "Great for lighter loads or home training"],
    mistakes: ["Rounding the back", "Bending knees too much", "Not hinging deep enough"],
  },
  "Leg Press (heavy)": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings"] },
    steps: [
      "Sit in the leg press. Feet shoulder-width, mid-platform.",
      "Lower until knees reach about 90 degrees.",
      "Press through your whole foot.",
    ],
    cues: ["Go heavy — this is a strength substitute for squats", "Back stays pressed into the pad", "Don't lock knees at the top"],
    mistakes: ["Going too deep and lower back rounding", "Locking out knees", "Pushing through toes only"],
  },
  "French Press": {
    muscles: { primary: ["Triceps (all heads)"], secondary: [] },
    steps: [
      "Lie on a bench holding an EZ bar or dumbbells above your chest.",
      "Lower the weight toward your forehead by bending at the elbows.",
      "Extend back up to the start.",
    ],
    cues: ["Also called skull crushers", "Elbows stay pointing at the ceiling", "Go slightly behind your head for more long head stretch"],
    mistakes: ["Elbows flaring wide", "Dropping the weight too fast toward your face", "Not getting full extension at the top"],
  },
  "Tricep Dips (weighted)": {
    muscles: { primary: ["Triceps", "Chest", "Front delts"], secondary: [] },
    steps: [
      "Grip parallel bars, hang with arms extended. Add weight via belt or DB between feet.",
      "Lower until upper arms are parallel to the floor.",
      "Press back up to full extension.",
    ],
    cues: ["Slight forward lean for more chest, upright for more triceps", "Full lockout at the top", "Controlled descent — don't drop"],
    mistakes: ["Going too deep — stresses the shoulder", "Flaring elbows excessively", "Swinging the weight"],
  },
  "Push Press": {
    muscles: { primary: ["Front delts", "Triceps"], secondary: ["Quads", "Core"] },
    steps: [
      "Bar on front delts, feet hip-width.",
      "Dip slightly by bending knees, then drive up explosively.",
      "Use the leg drive to push the bar overhead. Lock out.",
    ],
    cues: ["Short, sharp dip — not a squat", "Leg drive initiates, arms finish", "Great for getting more weight overhead than strict press"],
    mistakes: ["Dipping too deep — loses power", "Pressing before the drive finishes", "Not locking out overhead"],
  },
  "Seated BB Press": {
    muscles: { primary: ["Front delts", "Lateral delts"], secondary: ["Triceps"] },
    steps: [
      "Sit on a bench with back support, barbell at shoulder height.",
      "Press the bar overhead to lockout.",
      "Lower back to shoulder height.",
    ],
    cues: ["Seated removes the leg drive — pure pressing strength", "Keep your back against the pad", "Full lockout at the top"],
    mistakes: ["Arching excessively off the pad", "Pressing the bar forward instead of straight up", "Not using full range"],
  },
  "Incline BB Press": {
    muscles: { primary: ["Upper chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Bench at 30–45 degrees. Unrack bar with grip slightly wider than shoulders.",
      "Lower to upper chest, press up.",
    ],
    cues: ["Same as Incline Barbell Press", "Shoulder blades retracted", "Touch upper chest"],
    mistakes: ["Bench too steep", "Bar drifting forward", "Bouncing off chest"],
  },
  "Cable Fly": {
    muscles: { primary: ["Chest"], secondary: ["Front delts"] },
    steps: [
      "Stand between two cable pulleys set at mid-height.",
      "Arms extended with slight elbow bend, bring handles together in front.",
      "Open arms wide for a stretch, then squeeze back together.",
    ],
    cues: ["Squeeze at the midpoint — peak contraction", "Constant tension from the cables", "Slight forward lean"],
    mistakes: ["Bending elbows too much — it's a fly, not a press", "Standing too far forward or back", "Going too heavy"],
  },
  "DB Bench Press": {
    muscles: { primary: ["Chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Sit on bench, kick dumbbells up as you lie back.",
      "Press up, lower with control, elbows at 45 degrees.",
    ],
    cues: ["Same as Dumbbell Bench Press", "Greater ROM than barbell", "Squeeze shoulder blades"],
    mistakes: ["Uneven pressing", "Elbows flaring to 90 degrees", "Dropping too fast"],
  },
  "Smith Machine Press": {
    muscles: { primary: ["Chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Position bench so bar path hits mid-chest.",
      "Grip, twist to unrack, lower to chest, press up.",
    ],
    cues: ["Same as Smith Machine Bench Press", "Fixed path — focus on pressing force", "Good for going to failure safely"],
    mistakes: ["Wrong bench position", "Not retracting shoulder blades", "Relying on Smith only — use free weights too"],
  },
  // ─── Power regime exercises ───────────────────────────────────────────────
  "Medicine Ball Chest Pass": {
    muscles: { primary: ["Chest", "Front delts", "Triceps"], secondary: ["Core"] },
    steps: [
      "Stand facing a wall, med ball at chest height.",
      "Explosively push the ball into the wall.",
      "Catch the rebound and immediately repeat.",
    ],
    cues: ["Maximum velocity on every rep", "Drive from the chest, not the arms", "Catch and throw in one smooth motion"],
    mistakes: ["Lobbing instead of throwing explosively", "Standing too far from the wall", "Not catching properly — risk of face impact"],
  },
  "Bench Press (speed)": {
    muscles: { primary: ["Chest", "Front delts", "Triceps"], secondary: [] },
    steps: [
      "Load 50–60% of your max. Set up as for a normal bench press.",
      "Lower the bar under control to your chest.",
      "Press up as fast as humanly possible.",
    ],
    cues: ["Speed is the stimulus — not the weight", "Compensatory acceleration — push harder as the bar moves", "Controlled down, explosive up"],
    mistakes: ["Going too heavy — defeats the purpose", "Not accelerating through the full range", "Bouncing off the chest"],
  },
  "Explosive Pull-Up": {
    muscles: { primary: ["Lats", "Biceps"], secondary: ["Rear delts", "Core"] },
    steps: [
      "Hang from the bar, arms fully extended.",
      "Pull up as fast and explosively as possible.",
      "Lower slowly — 3 second negative.",
    ],
    cues: ["Try to pull yourself above the bar, not just to it", "Fast up, slow down", "If possible, release the bar briefly at the top"],
    mistakes: ["Kipping instead of pulling explosively", "Dropping too fast on the negative", "Not going to full extension at the bottom"],
  },
  "Barbell Row (explosive)": {
    muscles: { primary: ["Lats", "Traps", "Rhomboids"], secondary: ["Biceps", "Erectors"] },
    steps: [
      "Hinge forward, bar hanging at arm's length.",
      "Explosively row the bar to your lower chest.",
      "Lower with control.",
    ],
    cues: ["Pull hard and fast — think about driving elbows through the ceiling", "Speed is the goal, not max weight", "Flat back throughout"],
    mistakes: ["Using too much weight and losing explosiveness", "Rounding the back", "Standing up during the pull"],
  },
  "Box Jump": {
    muscles: { primary: ["Quads", "Glutes", "Calves"], secondary: ["Core"] },
    steps: [
      "Stand facing a box, feet hip-width.",
      "Swing arms and jump onto the box.",
      "Land softly with both feet, knees bent.",
      "Stand up, step down — don't jump down.",
    ],
    cues: ["Land soft — absorb with your knees", "Step down, don't jump down — saves your joints", "Swing your arms to generate more height"],
    mistakes: ["Landing with stiff legs", "Jumping down — high impact on joints", "Using a box that's too high and landing in a deep squat"],
  },
  "Power Clean (from hang)": {
    muscles: { primary: ["Glutes", "Hamstrings", "Traps", "Quads"], secondary: ["Shoulders", "Core", "Forearms"] },
    steps: [
      "Bar at hip height, overhand grip just outside knees.",
      "Hinge to just above the knees — this is the hang position.",
      "Explosively extend hips and shrug, then pull yourself under the bar.",
      "Catch the bar on your front delts in a quarter squat. Stand up.",
    ],
    cues: ["The power comes from the hip extension, not the arms", "Fast elbows — whip them under the bar", "If unsure, use the DB version instead"],
    mistakes: ["Pulling with the arms instead of driving with hips", "Not getting under the bar — catching it too high", "Wrist flexibility limiting the catch position"],
  },
  "Jump Squat": {
    muscles: { primary: ["Quads", "Glutes", "Calves"], secondary: ["Core"] },
    steps: [
      "Bar on back with 20–30% of your squat max.",
      "Squat down to about parallel.",
      "Explode up and leave the ground.",
      "Land softly and absorb into the next rep.",
    ],
    cues: ["Light weight — speed is the stimulus", "Land with soft knees every time", "Arms stay on the bar — don't let it bounce on your back"],
    mistakes: ["Going too heavy — can't generate speed", "Landing with stiff legs", "Bar bouncing off your back on landing"],
  },
  "Trap Bar Deadlift (speed)": {
    muscles: { primary: ["Quads", "Glutes", "Hamstrings"], secondary: ["Erectors", "Traps"] },
    steps: [
      "Stand in trap bar, about 60% of max.",
      "Set up with flat back and tight brace.",
      "Pull as fast as possible to lockout.",
      "Lower with control and reset.",
    ],
    cues: ["Accelerate through the entire pull", "Think about jumping with the bar", "Reset between reps — each one is a fresh effort"],
    mistakes: ["Going too heavy for speed work", "Losing back position in the rush", "Not resetting between reps"],
  },
  "Broad Jump": {
    muscles: { primary: ["Quads", "Glutes", "Calves"], secondary: ["Core"] },
    steps: [
      "Stand with feet hip-width.",
      "Swing arms back, hinge slightly, then explode forward and up.",
      "Land with soft knees, absorb the impact.",
    ],
    cues: ["Drive both forward AND up — 45-degree takeoff angle", "Arm swing generates significant extra distance", "Stick the landing before the next rep"],
    mistakes: ["Jumping too flat — no height", "Landing with straight legs", "Not using the arm swing"],
  },
  "Med Ball Rotational Throw": {
    muscles: { primary: ["Obliques", "Core", "Hips"], secondary: ["Shoulders", "Chest"] },
    steps: [
      "Stand sideways to a wall, med ball at hip height.",
      "Rotate explosively from the hips, throwing the ball into the wall.",
      "Catch the rebound and repeat.",
    ],
    cues: ["Power comes from the hips, not the arms", "Feet pivot during the throw", "Like a golf swing or baseball bat swing"],
    mistakes: ["All arms, no hip rotation", "Not pivoting the feet", "Standing too far from the wall"],
  },
  "Push Jerk": {
    muscles: { primary: ["Front delts", "Triceps", "Quads"], secondary: ["Core"] },
    steps: [
      "Bar on front delts. Dip by bending knees.",
      "Drive up explosively and push yourself UNDER the bar.",
      "Catch overhead with a slight knee bend, then stand up.",
    ],
    cues: ["Faster and more technical than push press", "You move under the bar, not just push it up", "Lock out aggressively"],
    mistakes: ["Pressing instead of jerking — you should catch with straight arms", "Dipping forward instead of straight down", "Not committing to getting under the bar"],
  },
  "Plyo Push-Up": {
    muscles: { primary: ["Chest", "Triceps", "Front delts"], secondary: ["Core"] },
    steps: [
      "Start in a push-up position.",
      "Lower to the bottom, then push up explosively so hands leave the ground.",
      "Land softly and immediately go into the next rep.",
    ],
    cues: ["Hands should clear the ground on every rep", "Land with soft elbows to absorb", "Quality over quantity"],
    mistakes: ["Not generating enough force to leave the ground", "Landing with stiff arms — wrist injury risk", "Saggy hips — maintain a straight body line"],
  },
  "Lat Pulldown (explosive)": {
    muscles: { primary: ["Lats", "Biceps"], secondary: ["Rear delts"] },
    steps: [
      "Sit at the pulldown machine, grip slightly wider than shoulders.",
      "Pull the bar down as fast as possible to your upper chest.",
      "Return slowly — 3 second negative.",
    ],
    cues: ["Explosive concentric, slow eccentric", "Imagine ripping the bar down", "Moderate weight — speed is the priority"],
    mistakes: ["Going too heavy and losing speed", "Leaning way back to cheat", "Fast on both directions — the slow return is critical"],
  },
  "Depth Jump": {
    muscles: { primary: ["Quads", "Calves", "Glutes"], secondary: ["Core"] },
    steps: [
      "Stand on a box. Step off (don't jump off).",
      "The moment you land, jump up as high as possible.",
      "Minimal ground contact time — react instantly.",
    ],
    cues: ["Reactive power — you're training the stretch reflex", "Think about the ground being hot — spend as little time on it as possible", "Step off, don't jump off the box"],
    mistakes: ["Jumping off the box instead of stepping", "Spending too long on the ground before jumping", "Box too high — start at 40cm"],
  },
  "Single-Leg Hop": {
    muscles: { primary: ["Calves", "Quads"], secondary: ["Glutes", "Core"] },
    steps: [
      "Stand on one leg.",
      "Hop forward or in place with minimal ground contact.",
      "Stay on the same leg for all reps, then switch.",
    ],
    cues: ["Stiff ankle — spring off the ball of your foot", "Minimal knee bend", "Quick, reactive contacts"],
    mistakes: ["Too much knee bend — this is an ankle exercise", "Losing balance between hops", "Landing flat-footed"],
  },
  "Barbell Hip Thrust (explosive)": {
    muscles: { primary: ["Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Set up as for a normal hip thrust — back on bench, bar across hips.",
      "Drive hips up as fast as possible.",
      "Control the descent, then explode again.",
    ],
    cues: ["Speed is the stimulus — not max weight", "Squeeze glutes hard at the top", "Fast up, controlled down"],
    mistakes: ["Going too heavy and losing speed", "Hyperextending the back", "Bouncing instead of controlled explosive reps"],
  },
  "Sprint (treadmill/track)": {
    muscles: { primary: ["Quads", "Glutes", "Hamstrings", "Calves"], secondary: ["Core", "Hip flexors"] },
    steps: [
      "Warm up thoroughly — 5–10 min easy jogging.",
      "Sprint at maximum effort for 6–8 seconds.",
      "Rest 2 minutes between sprints.",
    ],
    cues: ["Full effort — nothing held back", "Drive knees high, pump arms hard", "Short duration means full recovery between reps"],
    mistakes: ["Not warming up enough — hamstring injury risk", "Sprinting too long — 6–8 seconds is plenty", "Not resting enough between efforts"],
  },
  "Lateral Bound": {
    muscles: { primary: ["Glutes", "Quads", "Adductors"], secondary: ["Core", "Calves"] },
    steps: [
      "Stand on one leg.",
      "Jump laterally as far as possible, landing on the other leg.",
      "Stick the landing, then bound back.",
    ],
    cues: ["Push off the outside of your foot", "Stick each landing before bounding back", "Great for lateral power and knee stability"],
    mistakes: ["Not sticking the landing — control matters", "Jumping too far and losing balance", "Knees caving in on landing"],
  },
  "Ankle Hops": {
    muscles: { primary: ["Calves"], secondary: ["Quads"] },
    steps: [
      "Stand tall, feet together.",
      "Hop up and down using only your ankles — minimal knee bend.",
      "Stay on the balls of your feet throughout.",
    ],
    cues: ["Stiff ankles — think pogo stick", "Quick ground contacts", "Develops tendon stiffness and reactive strength"],
    mistakes: ["Bending knees too much", "Landing flat-footed", "Going too slow — these should be fast"],
  },
  "Clap Push-Up": {
    muscles: { primary: ["Chest", "Triceps"], secondary: ["Front delts", "Core"] },
    steps: [
      "Start in push-up position.",
      "Lower, then push up explosively.",
      "Clap hands in the air, then land softly.",
    ],
    cues: ["Need enough airtime to clap and get hands back down", "Land with soft elbows", "Quality reps — stop when you can't get enough height"],
    mistakes: ["Landing with stiff arms — wrist injury", "Hips sagging", "Clapping too late and face-planting"],
  },
  "Band Press": {
    muscles: { primary: ["Chest", "Triceps", "Front delts"], secondary: [] },
    steps: [
      "Anchor a band behind you at chest height.",
      "Press forward explosively against the band resistance.",
      "Return slowly.",
    ],
    cues: ["Band increases resistance as you press — accommodating resistance", "Great for developing pressing speed", "Full extension each rep"],
    mistakes: ["Band too light or too heavy", "Not getting full extension", "Letting the band snap you back — control it"],
  },
  "DB Speed Press": {
    muscles: { primary: ["Chest", "Triceps"], secondary: ["Front delts"] },
    steps: [
      "Lie on a flat bench with moderate dumbbells.",
      "Press up as fast as possible.",
      "Lower under control, then explode up again.",
    ],
    cues: ["50–60% of your normal DB press weight", "Compensatory acceleration — push harder through the whole range", "Fast up, slow down"],
    mistakes: ["Going too heavy for speed work", "Losing control of the dumbbells", "Not enough acceleration"],
  },
  "Band-Resisted Press": {
    muscles: { primary: ["Chest", "Triceps"], secondary: ["Front delts"] },
    steps: [
      "Set up for bench press with bands looped over the bar and anchored below.",
      "Press up — the bands add resistance at the top.",
      "Control the descent.",
    ],
    cues: ["Forces you to accelerate through the whole range", "Top of the press is hardest — push through it", "Great for developing lockout strength"],
    mistakes: ["Bands too tight — can't control the bar", "Not accelerating aggressively enough", "Bands poorly anchored — safety risk"],
  },
  "Jumping Pull-Up": {
    muscles: { primary: ["Lats", "Biceps"], secondary: ["Core"] },
    steps: [
      "Stand under a bar you can reach with a small jump.",
      "Jump up and grab the bar, immediately pulling yourself over.",
      "Lower slowly, drop, and repeat.",
    ],
    cues: ["The jump gives you momentum — focus on a fast pull at the top", "Slow negative on the way down", "Great for building toward strict pull-ups"],
    mistakes: ["All jump, no pull — make the upper body work", "Dropping too fast from the top", "Bar too high — you should barely need to jump"],
  },
  "Band Pull-Up": {
    muscles: { primary: ["Lats", "Biceps"], secondary: ["Rear delts"] },
    steps: [
      "Loop a resistance band over the bar.",
      "Place foot or knee in the band and hang.",
      "Pull up with the band assisting at the bottom.",
    ],
    cues: ["Band helps most at the bottom where you're weakest", "Work toward thinner bands over time", "Full dead hang at the bottom"],
    mistakes: ["Relying too much on the band", "Kipping", "Not going to full extension"],
  },
  "Band Pulldown": {
    muscles: { primary: ["Lats"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Attach a band high, grip both ends.",
      "Pull down to your chest, squeezing lats.",
      "Return slowly.",
    ],
    cues: ["Great for home training or warm-ups", "Variable resistance — hardest at the bottom", "Focus on the lat squeeze"],
    mistakes: ["Using a band that's too light", "Pulling with arms instead of lats", "Rushing through reps"],
  },
  "Seal Row": {
    muscles: { primary: ["Lats", "Rhomboids", "Traps"], secondary: ["Biceps"] },
    steps: [
      "Lie face down on an elevated bench (plates under the bench legs).",
      "Dumbbells or barbell hanging below, row up.",
      "Squeeze at the top, lower to full extension.",
    ],
    cues: ["Zero momentum — pure back contraction", "Chest stays flat on the bench", "Great for isolating the back"],
    mistakes: ["Bench not high enough — weights hit the floor", "Lifting chest off the bench", "Going too heavy and losing contraction"],
  },
  "Band Rotational Press": {
    muscles: { primary: ["Chest", "Core", "Obliques"], secondary: ["Triceps", "Front delts"] },
    steps: [
      "Anchor a band at chest height to your side.",
      "Press forward while rotating your torso.",
      "Return under control.",
    ],
    cues: ["Rotation comes from the hips and core", "Press and rotate simultaneously", "Great for rotational power development"],
    mistakes: ["All arms, no rotation", "Not bracing the core", "Band too light to challenge rotation"],
  },
  "Cable Woodchop": {
    muscles: { primary: ["Obliques", "Core"], secondary: ["Shoulders"] },
    steps: [
      "Cable at high position. Grip with both hands.",
      "Rotate from high to low across your body in a chopping motion.",
      "Control the return.",
    ],
    cues: ["Power comes from hip rotation", "Arms stay relatively straight — they're just levers", "Exhale forcefully during the chop"],
    mistakes: ["Pulling with arms instead of rotating", "Moving too fast on the return", "Standing too close to the cable"],
  },
  "Cable Press": {
    muscles: { primary: ["Chest", "Front delts", "Triceps"], secondary: [] },
    steps: [
      "Cable at chest height behind you.",
      "Press forward to full arm extension.",
      "Return slowly.",
    ],
    cues: ["Constant cable tension throughout", "Unilateral version builds anti-rotation strength", "Great for finishing chest workouts"],
    mistakes: ["Leaning too far forward", "Not getting full extension", "Going too heavy"],
  },
  "Single-Arm DB Press": {
    muscles: { primary: ["Chest", "Front delts", "Triceps"], secondary: ["Core"] },
    steps: [
      "Lie on a bench with one dumbbell.",
      "Press up to full extension.",
      "Lower under control.",
    ],
    cues: ["Core has to work hard to prevent rotation", "Great for finding and fixing imbalances", "Brace against the bench with your free hand if needed"],
    mistakes: ["Rotating off the bench", "Not bracing properly", "Going too heavy initially"],
  },
  "DB Push Press": {
    muscles: { primary: ["Front delts", "Triceps"], secondary: ["Quads", "Core"] },
    steps: [
      "Dumbbells at shoulder height.",
      "Dip and drive with legs, press overhead.",
      "Lock out, then lower to shoulders.",
    ],
    cues: ["Use leg drive to get heavier DBs overhead", "Short, sharp dip", "Lock out aggressively"],
    mistakes: ["Dipping too deep", "Pressing before the drive finishes", "Dumbbells drifting forward"],
  },
  "DB Split Jerk": {
    muscles: { primary: ["Front delts", "Triceps", "Quads"], secondary: ["Core"] },
    steps: [
      "Dumbbells at shoulder height.",
      "Dip and drive, split one foot forward and one back as you press overhead.",
      "Lock out overhead, then bring feet together.",
    ],
    cues: ["Split stance catches the weight in a strong position", "Lock out aggressively as you split", "Practice the footwork with light weight first"],
    mistakes: ["Not splitting wide enough", "Pressing instead of catching — should be a jerk", "Losing balance in the split"],
  },
  "Incline Plyo Push-Up": {
    muscles: { primary: ["Chest", "Triceps"], secondary: ["Core", "Front delts"] },
    steps: [
      "Hands on a bench or elevated surface in push-up position.",
      "Lower, then push up explosively so hands leave the surface.",
      "Land softly and repeat.",
    ],
    cues: ["Easier than floor plyo push-ups — good progression", "The incline reduces bodyweight load", "Focus on explosive intent"],
    mistakes: ["Not generating enough force to leave the surface", "Landing with stiff arms", "Surface too high — should still be challenging"],
  },
  "DB Hang Power Clean": {
    muscles: { primary: ["Glutes", "Hamstrings", "Traps"], secondary: ["Shoulders", "Core"] },
    steps: [
      "Stand with dumbbells at hip height.",
      "Hinge to just above the knees.",
      "Explosively extend hips, shrug, and flip the DBs to your shoulders.",
    ],
    cues: ["Easier to learn than barbell cleans", "Hip drive is everything — arms are just hooks", "Catch on front delts with elbows high"],
    mistakes: ["Curling the weights instead of using hip drive", "Not finishing the hip extension", "Catching with elbows low"],
  },
  "Kettlebell Swing": {
    muscles: { primary: ["Glutes", "Hamstrings"], secondary: ["Core", "Shoulders", "Erectors"] },
    steps: [
      "Stand with feet wider than shoulders, KB on the floor slightly ahead.",
      "Hike the KB back between your legs.",
      "Drive hips forward explosively to swing the KB to chest height.",
      "Let it swing back between legs and repeat.",
    ],
    cues: ["It's a hip hinge, not a squat — power comes from the hips", "Arms are ropes — don't pull with them", "Squeeze glutes hard at the top"],
    mistakes: ["Squatting the swing instead of hinging", "Pulling with arms", "Hyperextending the back at the top"],
  },
  "Squat Jump (BW)": {
    muscles: { primary: ["Quads", "Glutes", "Calves"], secondary: ["Core"] },
    steps: [
      "Stand with feet shoulder-width.",
      "Squat to about parallel.",
      "Jump up as high as possible.",
      "Land softly, absorb into the next squat.",
    ],
    cues: ["No external load — focus on max height", "Use arm swing for extra height", "Soft landing every rep"],
    mistakes: ["Landing with stiff legs", "Not squatting deep enough", "Rushing — reset between reps"],
  },
  "Trap Bar Jump": {
    muscles: { primary: ["Quads", "Glutes", "Calves"], secondary: ["Core", "Traps"] },
    steps: [
      "Stand inside a trap bar with light weight.",
      "Squat slightly, then jump explosively.",
      "Land softly and absorb.",
    ],
    cues: ["Very light load — 20–30% of deadlift max", "Neutral grip makes landing easier", "Explosive intent on every rep"],
    mistakes: ["Going too heavy — can't leave the ground properly", "Poor landing mechanics", "Not resetting between reps"],
  },
  "Speed Conventional DL": {
    muscles: { primary: ["Glutes", "Hamstrings", "Quads", "Erectors"], secondary: ["Core", "Traps"] },
    steps: [
      "Set up as for a conventional deadlift at 50–60% of max.",
      "Pull as fast as possible to lockout.",
      "Lower with control and reset.",
    ],
    cues: ["Speed is the goal — not grinding reps", "Accelerate through the entire pull", "Reset fully between reps"],
    mistakes: ["Going too heavy for speed", "Losing position in the rush", "Not resetting"],
  },
  "KB Deadlift": {
    muscles: { primary: ["Glutes", "Hamstrings", "Quads"], secondary: ["Core", "Erectors"] },
    steps: [
      "Kettlebell on the floor between your feet.",
      "Hinge down, grip the handle, flat back.",
      "Drive through the floor to stand up.",
    ],
    cues: ["Great for learning the deadlift pattern", "Same movement as barbell — just smaller", "Squeeze glutes at the top"],
    mistakes: ["Rounding the back", "Squatting instead of hinging", "Not bracing the core"],
  },
  "Standing Long Jump": {
    muscles: { primary: ["Quads", "Glutes", "Calves"], secondary: ["Core"] },
    steps: [
      "Same as broad jump — stand, swing arms, jump forward for max distance.",
      "Land with soft knees.",
    ],
    cues: ["Identical to broad jump", "45-degree takeoff angle", "Arm swing is critical"],
    mistakes: ["Jumping flat", "Stiff landing", "No arm swing"],
  },
  "Bounding": {
    muscles: { primary: ["Quads", "Glutes", "Calves"], secondary: ["Core", "Hip flexors"] },
    steps: [
      "Run with exaggerated strides — driving knees high and pushing off hard.",
      "Each stride should cover maximum distance.",
      "Land on one foot and immediately drive into the next bound.",
    ],
    cues: ["Think of running in slow motion with huge strides", "Drive the knee up high", "Spend minimal time on the ground"],
    mistakes: ["Bounds too short — really exaggerate", "Landing heavily instead of springing", "Not driving the knee"],
  },
  "Drop Jump": {
    muscles: { primary: ["Quads", "Calves"], secondary: ["Glutes"] },
    steps: [
      "Step off a box, land, and immediately jump as high as possible.",
    ],
    cues: ["Same as depth jump — reactive power training", "Minimal ground contact time", "Step off, don't jump off"],
    mistakes: ["Jumping off the box", "Too much time on the ground", "Box too high"],
  },
  "Hurdle Hop": {
    muscles: { primary: ["Quads", "Calves", "Glutes"], secondary: ["Core"] },
    steps: [
      "Set up low hurdles in a line.",
      "Jump over each one with both feet, minimal ground contact.",
    ],
    cues: ["Continuous hops — don't pause between hurdles", "Quick ground contacts", "Knees drive up to clear the hurdles"],
    mistakes: ["Pausing between hurdles", "Landing flat-footed", "Hurdles too high initially"],
  },
  "Ankle Hop": {
    muscles: { primary: ["Calves"], secondary: [] },
    steps: [
      "Stand tall. Hop using only ankle flexion — minimal knee bend.",
    ],
    cues: ["Same as Ankle Hops — pogo stick motion", "Quick, stiff contacts", "Develops reactive ankle stiffness"],
    mistakes: ["Bending knees", "Going too slow", "Landing flat-footed"],
  },
  "Side Hop": {
    muscles: { primary: ["Calves", "Glutes"], secondary: ["Core"] },
    steps: [
      "Hop side to side over a line or small obstacle.",
      "Minimal ground contact time.",
    ],
    cues: ["Quick feet — like a skier", "Stay on the balls of your feet", "Great for lateral ankle stability"],
    mistakes: ["Hopping too wide and losing balance", "Landing flat", "Going too slow"],
  },
  "Lateral Hurdle Jump": {
    muscles: { primary: ["Glutes", "Quads", "Adductors"], secondary: ["Core", "Calves"] },
    steps: [
      "Stand beside a hurdle.",
      "Jump laterally over it, land on both feet.",
      "Jump back immediately.",
    ],
    cues: ["Drive laterally off the outside foot", "Soft landings", "Continuous reps — no pausing"],
    mistakes: ["Not jumping high enough to clear the hurdle", "Pausing between jumps", "Landing off balance"],
  },
  "Vertical Jump": {
    muscles: { primary: ["Quads", "Glutes", "Calves"], secondary: ["Core"] },
    steps: [
      "Stand with feet shoulder-width.",
      "Dip and swing arms, then jump as high as possible.",
      "Land softly.",
    ],
    cues: ["Full arm swing for maximum height", "Drive through the balls of your feet", "Reach for the ceiling"],
    mistakes: ["No arm swing", "Stiff landing", "Not squatting deep enough in the countermovement"],
  },
  "Stationary Bike Sprint": {
    muscles: { primary: ["Quads", "Glutes", "Hamstrings"], secondary: ["Calves", "Core"] },
    steps: [
      "Set resistance moderately high.",
      "Sprint all-out for 6–8 seconds.",
      "Rest 2 minutes, repeat.",
    ],
    cues: ["Maximum effort — RPE 10", "Low impact alternative to running sprints", "Great for developing leg power without joint stress"],
    mistakes: ["Resistance too low — spinning without load", "Sprinting too long — keep it under 10 seconds", "Not enough rest between efforts"],
  },
  "Assault Bike Sprint": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Arms", "Core"] },
    steps: [
      "Sit on the assault bike.",
      "Sprint all-out for 6–8 seconds using both arms and legs.",
      "Rest, repeat.",
    ],
    cues: ["Arms and legs work together — total body", "Air resistance increases with speed", "Max effort, short duration"],
    mistakes: ["Going too long — stay under 10 seconds for power", "Arms not contributing", "Not enough recovery between sets"],
  },
  "Jump Rope": {
    muscles: { primary: ["Calves"], secondary: ["Shoulders", "Forearms", "Core"] },
    steps: [
      "Hold rope handles at hip height, elbows close.",
      "Jump just high enough to clear the rope.",
      "Stay on the balls of your feet.",
    ],
    cues: ["Wrists turn the rope, not your arms", "Small jumps — efficiency matters", "Great warm-up and conditioning tool"],
    mistakes: ["Jumping too high", "Using arms instead of wrists", "Landing flat-footed"],
  },
  "Pogos": {
    muscles: { primary: ["Calves"], secondary: ["Quads"] },
    steps: [
      "Stand tall, hop rapidly in place with stiff ankles.",
      "Minimal knee bend — all the work is in the calves.",
    ],
    cues: ["Same concept as ankle hops", "Rapid ground contacts", "Builds reactive calf strength and tendon stiffness"],
    mistakes: ["Bending knees too much", "Going too slow", "Not staying on balls of feet"],
  },
  "KB Swing": {
    muscles: { primary: ["Glutes", "Hamstrings"], secondary: ["Core", "Shoulders"] },
    steps: [
      "Same as Kettlebell Swing — hike, hinge, drive hips.",
    ],
    cues: ["Hip hinge power movement", "Arms are ropes", "Squeeze glutes at the top"],
    mistakes: ["Squatting instead of hinging", "Pulling with arms", "Hyperextending"],
  },
  "Box Step-Down": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core"] },
    steps: [
      "Stand on a box on one leg.",
      "Slowly lower the other foot toward the ground — 3 seconds down.",
      "Lightly tap the floor, then stand back up.",
    ],
    cues: ["Control the descent — that's the exercise", "Standing leg does all the work", "Builds single-leg control for landing"],
    mistakes: ["Dropping too fast", "Using the lower foot to push off", "Leaning excessively"],
  },
  "Mini Band Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hip abductors"] },
    steps: [
      "Place a mini band above your knees.",
      "Squat with explosive intent — drive up fast.",
      "Push knees out against the band throughout.",
    ],
    cues: ["The band forces glute activation", "Explosive intent even though it's low load", "Safe alternative to jump squats"],
    mistakes: ["Letting knees cave in", "Not pushing out against the band", "Going too slow — this is a power substitute"],
  },
  "Push-Up to Shoulder Tap": {
    muscles: { primary: ["Chest", "Triceps", "Core"], secondary: ["Front delts"] },
    steps: [
      "Do a push-up.",
      "At the top, lift one hand and tap the opposite shoulder.",
      "Place hand back down, do another push-up, tap other side.",
    ],
    cues: ["Anti-rotation — don't let hips twist during the tap", "Core stays braced throughout", "Removes impact stress of plyo push-ups"],
    mistakes: ["Hips rotating during the tap", "Rushing through reps", "Not doing a full push-up before the tap"],
  },
  "Step-Up (fast pace)": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Calves", "Core"] },
    steps: [
      "Step onto a box briskly with one foot.",
      "Drive up quickly, step down, repeat.",
    ],
    cues: ["Faster pace than normal step-ups — explosive intent", "Drive through the top foot", "Replaces box jumps for joint-friendly power training"],
    mistakes: ["Pushing off the ground foot", "Going so fast form breaks down", "Box too high for quick reps"],
  },
  "Seated Battle Ropes / Arm Ergometer": {
    muscles: { primary: ["Shoulders", "Arms"], secondary: ["Core"] },
    steps: [
      "Sit in a chair or on a box with battle ropes or arm ergometer.",
      "Work arms vigorously for the prescribed duration.",
    ],
    cues: ["Seated removes spinal loading", "Same cardio stimulus as standing battle ropes", "Great for those with back issues"],
    mistakes: ["Slouching in the seat", "Not working hard enough — max effort", "Poor posture"],
  },
  // ─── Endurance regime exercises ───────────────────────────────────────────
  "DB Shoulder Press": {
    muscles: { primary: ["Front delts", "Lateral delts"], secondary: ["Triceps"] },
    steps: [
      "Seated or standing, dumbbells at shoulder height.",
      "Press overhead to lockout.",
      "Lower to shoulders.",
    ],
    cues: ["Same as Seated DB Shoulder Press", "In endurance context — high reps, short rest", "Full lockout each rep"],
    mistakes: ["Arching the back", "Pressing unevenly", "Cutting range short"],
  },
  "Push-Up": {
    muscles: { primary: ["Chest", "Triceps"], secondary: ["Front delts", "Core"] },
    steps: [
      "Hands slightly wider than shoulders, body straight from head to heels.",
      "Lower until chest nearly touches the floor.",
      "Push up to full extension.",
    ],
    cues: ["Body stays rigid — no hip sag or pike", "Elbows at about 45 degrees, not flared", "Full range of motion every rep"],
    mistakes: ["Sagging hips", "Not touching the bottom", "Flaring elbows to 90 degrees"],
  },
  "Machine Shoulder Press": {
    muscles: { primary: ["Front delts", "Lateral delts"], secondary: ["Triceps"] },
    steps: [
      "Adjust seat so handles are at shoulder height.",
      "Press up to full extension.",
      "Lower under control.",
    ],
    cues: ["Machine guides the path — focus on pressing", "Safe for high reps", "Don't lock out aggressively"],
    mistakes: ["Seat too low — shoulders stressed", "Rushing reps", "Not using full ROM"],
  },
  "Pike Push-Up": {
    muscles: { primary: ["Front delts", "Triceps"], secondary: ["Upper chest"] },
    steps: [
      "Start in a downward dog position — hips high, hands and feet on floor.",
      "Bend elbows to lower your head toward the floor.",
      "Press back up.",
    ],
    cues: ["The more vertical your torso, the more it targets shoulders", "Feet closer to hands = harder", "Great overhead press substitute without weights"],
    mistakes: ["Not piking enough — becomes a regular push-up", "Flaring elbows", "Head hitting the floor too hard"],
  },
  "Bodyweight Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core"] },
    steps: [
      "Stand with feet shoulder-width.",
      "Squat to parallel or below.",
      "Stand back up.",
    ],
    cues: ["Arms forward for balance", "Knees track over toes", "Full depth if mobility allows"],
    mistakes: ["Knees caving in", "Heels lifting", "Not going deep enough"],
  },
  "Air Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core"] },
    steps: [
      "Same as bodyweight squat.",
    ],
    cues: ["Another name for bodyweight squat", "High reps — great for endurance", "Keep it controlled"],
    mistakes: ["Same as bodyweight squat — watch knees and depth"],
  },
  "Plank": {
    muscles: { primary: ["Core", "Rectus abdominis"], secondary: ["Shoulders", "Glutes"] },
    steps: [
      "Forearms on the floor, body straight from head to heels.",
      "Hold the position — don't let hips sag or pike.",
    ],
    cues: ["Squeeze glutes and brace abs — don't just hang there", "Breathe — don't hold your breath", "Look at the floor to keep neck neutral"],
    mistakes: ["Hips sagging — most common error", "Hips piking up", "Holding breath"],
  },
  "Dead Bug": {
    muscles: { primary: ["Core", "Deep stabilisers"], secondary: [] },
    steps: [
      "Lie on your back, arms extended toward ceiling, knees bent at 90 degrees.",
      "Lower opposite arm and leg toward the floor simultaneously.",
      "Return to start, then switch sides.",
    ],
    cues: ["Lower back STAYS on the floor the entire time", "Slow and controlled — 2 seconds out, 2 seconds back", "Breathe out as you extend"],
    mistakes: ["Lower back arching off the floor — reduce range if this happens", "Going too fast", "Not coordinating opposite arm/leg"],
  },
  "Ab Wheel": {
    muscles: { primary: ["Core", "Lats"], secondary: ["Shoulders"] },
    steps: [
      "Kneel with ab wheel in front of you.",
      "Roll forward as far as you can while keeping a flat back.",
      "Pull back to the start using your core.",
    ],
    cues: ["Tuck your pelvis — posterior pelvic tilt throughout", "Go only as far as you can control", "Squeeze abs to pull back, not your hip flexors"],
    mistakes: ["Lower back arching — go shorter", "Collapsing at the bottom", "Pulling back with hips instead of core"],
  },
  "Battle Ropes": {
    muscles: { primary: ["Shoulders", "Arms", "Core"], secondary: ["Legs"] },
    steps: [
      "Hold one end of the rope in each hand.",
      "Create waves by alternating arm slams or doing double slams.",
      "Maintain for the prescribed time.",
    ],
    cues: ["Full body effort — use legs and core too", "Keep the waves going to the end of the rope", "Don't just use your arms — generate force from the ground up"],
    mistakes: ["Only using arms — involve the whole body", "Standing too close to the anchor", "Letting the waves die out halfway"],
  },
  "Mountain Climber": {
    muscles: { primary: ["Core", "Hip flexors"], secondary: ["Shoulders", "Quads"] },
    steps: [
      "Start in a push-up position.",
      "Drive one knee toward your chest, then switch.",
      "Alternate rapidly.",
    ],
    cues: ["Hips stay level — don't bounce up and down", "Drive the knees forward, not just up", "Keep a strong plank throughout"],
    mistakes: ["Hips piking up", "Going too slow to get a cardio effect", "Feet not returning fully between reps"],
  },
  "Walking Lunge": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Step forward into a lunge, then drive through to step into the next lunge.",
    ],
    cues: ["Same as Walking Lunges", "Continuous forward movement", "Keep torso upright"],
    mistakes: ["Steps too short", "Leaning forward", "Back knee slamming the ground"],
  },
  "Farmer's Carry": {
    muscles: { primary: ["Grip", "Core", "Traps"], secondary: ["Shoulders", "Legs"] },
    steps: [
      "Pick up heavy dumbbells or kettlebells.",
      "Walk with upright posture for the prescribed distance.",
    ],
    cues: ["Shoulders back and down", "Core braced — walk like the weight isn't there", "Go as heavy as you can while maintaining posture"],
    mistakes: ["Leaning to one side", "Shrugging shoulders up", "Taking too-small steps"],
  },
  "Farmers Carry": {
    muscles: { primary: ["Grip", "Core", "Traps"], secondary: ["Shoulders", "Legs"] },
    steps: [
      "Same as Farmer's Carry — heavy weights, walk with upright posture.",
    ],
    cues: ["Shoulders back, core braced", "Heavy is better", "Maintain perfect posture throughout"],
    mistakes: ["Leaning", "Shrugging", "Short steps"],
  },
  "Single-Leg RDL (DB)": {
    muscles: { primary: ["Hamstrings", "Glutes"], secondary: ["Core", "Erectors"] },
    steps: [
      "Stand on one leg holding a dumbbell in the opposite hand.",
      "Hinge forward, extending the free leg behind you.",
      "Lower until torso is roughly parallel, then stand back up.",
    ],
    cues: ["Hips stay square — don't rotate", "Reach the DB toward the floor", "Balance leg has a slight knee bend"],
    mistakes: ["Rotating the hips open", "Rounding the back", "Rushing — balance takes time"],
  },
  "DB Chest Press": {
    muscles: { primary: ["Chest", "Front delts"], secondary: ["Triceps"] },
    steps: [
      "Lie on bench, press dumbbells up from shoulder level.",
    ],
    cues: ["Same as Dumbbell Bench Press", "Control each rep", "Full range of motion"],
    mistakes: ["Bouncing", "Uneven pressing", "Elbows flaring"],
  },
  "Resistance Band Row": {
    muscles: { primary: ["Lats", "Rhomboids"], secondary: ["Biceps"] },
    steps: [
      "Anchor a band in front of you at chest height.",
      "Pull toward your stomach, squeezing shoulder blades.",
      "Return slowly.",
    ],
    cues: ["Great for home training or high-rep endurance work", "Squeeze at the end", "Constant tension"],
    mistakes: ["Band too light", "Rounding shoulders forward", "Rushing through reps"],
  },
  "DB Row": {
    muscles: { primary: ["Lats", "Rhomboids"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Same as Dumbbell Row — one hand on bench, row DB to hip.",
    ],
    cues: ["Pull to the hip", "Keep torso parallel", "Full stretch at the bottom"],
    mistakes: ["Twisting torso", "Rowing to chest instead of hip", "Short range of motion"],
  },
  "Push-Up (weighted vest)": {
    muscles: { primary: ["Chest", "Triceps"], secondary: ["Front delts", "Core"] },
    steps: [
      "Wear a weighted vest. Perform push-ups as normal.",
    ],
    cues: ["Same form as regular push-ups — just heavier", "Adjust vest weight to hit your rep target", "Great for progressive overload without a bench"],
    mistakes: ["Sagging hips under the extra weight", "Not using full range", "Vest shifting during the movement"],
  },
  "Goblet Squat + Press": {
    muscles: { primary: ["Quads", "Glutes", "Shoulders"], secondary: ["Core", "Triceps"] },
    steps: [
      "Hold a KB or DB at chest height. Squat down.",
      "Stand up, then press the weight overhead.",
      "Lower to chest, squat again.",
    ],
    cues: ["Full body movement — great for conditioning", "Squat deep, press fully", "Keep core braced throughout the transition"],
    mistakes: ["Not squatting deep enough", "Pressing before fully standing", "Losing core tension between squat and press"],
  },
  "Renegade Row": {
    muscles: { primary: ["Lats", "Core"], secondary: ["Biceps", "Shoulders"] },
    steps: [
      "Start in a push-up position with hands on dumbbells.",
      "Row one DB to your hip while balancing on the other.",
      "Lower, then row the other side.",
    ],
    cues: ["Anti-rotation — hips stay square to the floor", "Wide foot stance helps balance", "Don't rotate to row heavier — stay flat"],
    mistakes: ["Hips rotating with the row", "Feet too close together — lose balance", "Going too heavy and losing plank position"],
  },
  "Thruster": {
    muscles: { primary: ["Quads", "Glutes", "Shoulders"], secondary: ["Triceps", "Core"] },
    steps: [
      "Hold dumbbells or barbell at shoulder height.",
      "Squat to parallel, then drive up and press overhead in one fluid motion.",
    ],
    cues: ["The squat powers the press — use momentum", "One continuous movement, not squat then press", "Great conditioning exercise"],
    mistakes: ["Pausing between the squat and press", "Not squatting deep enough", "Pressing before the legs finish driving"],
  },
  "DB Squat to Press": {
    muscles: { primary: ["Quads", "Glutes", "Shoulders"], secondary: ["Triceps", "Core"] },
    steps: [
      "Same as Thruster — squat with DBs at shoulders, stand and press overhead.",
    ],
    cues: ["Fluid movement — squat flows into press", "Great for total body endurance", "Controlled speed"],
    mistakes: ["Separating the squat and press", "Not pressing fully overhead", "Losing core tension"],
  },
  "Single-Arm Row": {
    muscles: { primary: ["Lats", "Rhomboids"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "One hand on support, row DB or cable to hip with the other.",
    ],
    cues: ["Same as Dumbbell Row", "Pull to hip, not chest", "Full stretch and squeeze"],
    mistakes: ["Twisting torso", "Short range of motion", "Too heavy"],
  },
  "Row Machine": {
    muscles: { primary: ["Legs", "Back", "Arms"], secondary: ["Core"] },
    steps: [
      "Strap feet in, grip the handle.",
      "Drive with legs, lean back slightly, pull handle to lower chest.",
      "Return arms, lean forward, bend knees — fluid cycle.",
    ],
    cues: ["Legs-back-arms on the drive, arms-back-legs on the recovery", "Power comes from the legs — 60% legs, 20% back, 20% arms", "Smooth, rhythmic strokes"],
    mistakes: ["Pulling with arms first", "Bending knees before arms are extended on recovery", "Hunching over"],
  },
  "Ski Erg": {
    muscles: { primary: ["Lats", "Triceps", "Core"], secondary: ["Shoulders"] },
    steps: [
      "Stand at the ski erg, grip handles overhead.",
      "Pull down forcefully, hinging slightly at the hips.",
      "Return arms overhead and repeat.",
    ],
    cues: ["Drive through the pull — explosive", "Hinge at the hips for more power", "Great upper body and core cardio"],
    mistakes: ["All arms, no body", "Standing too upright — slight hinge adds power", "Going too slow"],
  },
  "Assault Bike / Row Erg": {
    muscles: { primary: ["Legs", "Arms"], secondary: ["Core"] },
    steps: [
      "Sit on the assault bike or row erg.",
      "Work at maximum effort for the prescribed duration.",
    ],
    cues: ["Total body output — arms and legs together", "All-out effort for conditioning", "Air/water resistance scales with your effort"],
    mistakes: ["Holding back — this should be max effort", "Poor posture on the rower", "Not using arms on the bike"],
  },
  "Elliptical": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Arms", "Core"] },
    steps: [
      "Stand on the pedals, grip handles.",
      "Stride smoothly, using arms and legs together.",
    ],
    cues: ["Low impact — great for high-volume conditioning", "Push and pull with arms", "Adjust resistance for challenge"],
    mistakes: ["Leaning on the handles — stand upright", "Going too easy — increase resistance", "Slouching"],
  },
  "Stationary Bike": {
    muscles: { primary: ["Quads", "Hamstrings", "Glutes"], secondary: ["Calves"] },
    steps: [
      "Adjust seat height — slight bend at bottom of pedal stroke.",
      "Pedal at prescribed cadence and resistance.",
    ],
    cues: ["Great low-impact conditioning", "Adjust resistance to match your target effort", "Keep upper body relaxed"],
    mistakes: ["Seat too high or low", "Bouncing in the saddle — too little resistance", "Hunching over"],
  },
  "TRX Row / Inverted Row": {
    muscles: { primary: ["Lats", "Rhomboids"], secondary: ["Biceps", "Rear delts", "Core"] },
    steps: [
      "Hold TRX handles or hang under a bar, body straight.",
      "Pull your chest to the handles/bar.",
      "Lower under control.",
    ],
    cues: ["The more horizontal your body, the harder it is", "Squeeze shoulder blades at the top", "Keep body rigid — don't sag at the hips"],
    mistakes: ["Sagging hips", "Not going to full extension", "Body not staying straight"],
  },
  "Ab Circuit": {
    muscles: { primary: ["Core"], secondary: [] },
    steps: [
      "Perform 3–4 ab exercises back-to-back with minimal rest.",
      "Common options: crunches, leg raises, russian twists, planks.",
    ],
    cues: ["Quality over speed — feel each rep", "Breathe out on the contraction", "Cycle through different movements to hit all areas"],
    mistakes: ["Rushing through with poor form", "Only doing crunches — vary the movements", "Holding breath"],
  },
  // ─── Stability regime exercises ───────────────────────────────────────────
  "Pallof Press": {
    muscles: { primary: ["Core", "Obliques"], secondary: ["Shoulders"] },
    steps: [
      "Stand sideways to a cable or band at chest height.",
      "Hold the handle at your chest, then press straight out.",
      "Hold with arms extended — resist the rotation.",
      "Return to chest.",
    ],
    cues: ["The exercise is resisting the pull — anti-rotation", "Arms extended is the hard part — hold it", "Stand tall, don't lean"],
    mistakes: ["Rotating toward the cable", "Pressing too fast — slow and controlled", "Standing too close to the anchor"],
  },
  "Band Pallof Press": {
    muscles: { primary: ["Core", "Obliques"], secondary: ["Shoulders"] },
    steps: [
      "Same as Pallof Press but with a resistance band.",
    ],
    cues: ["Band version is great for home training", "Same anti-rotation principle", "Step further from anchor to increase resistance"],
    mistakes: ["Band too light", "Rotating toward the band", "Rushing through reps"],
  },
  "Half-Kneeling Pallof": {
    muscles: { primary: ["Core", "Obliques", "Hip stabilisers"], secondary: ["Shoulders"] },
    steps: [
      "Kneel with the inside knee down, outside knee up.",
      "Press the cable or band straight out from your chest.",
      "Hold and resist the rotation.",
    ],
    cues: ["Half-kneeling adds hip stability demand", "Squeeze the down-side glute", "Don't lean or rotate"],
    mistakes: ["Leaning toward the cable", "Not engaging the glute", "Losing upright posture"],
  },
  "Copenhagen Plank": {
    muscles: { primary: ["Adductors", "Obliques"], secondary: ["Core"] },
    steps: [
      "Side plank position with top leg on a bench, bottom leg hanging.",
      "Lift hips and hold — bottom leg hangs free or rests on bench.",
    ],
    cues: ["Top inner thigh does the work", "Great for groin injury prevention", "Keep hips stacked — don't rotate"],
    mistakes: ["Hips rotating forward or back", "Bench too high — start low", "Not holding long enough to feel the adductors"],
  },
  "Side Plank": {
    muscles: { primary: ["Obliques", "Core"], secondary: ["Shoulders", "Glutes"] },
    steps: [
      "Lie on your side, forearm on the floor, feet stacked.",
      "Lift hips until body is straight from head to heels.",
      "Hold for prescribed time.",
    ],
    cues: ["Don't let hips sag", "Stack shoulders — top shoulder directly over bottom", "Breathe normally"],
    mistakes: ["Hips sagging", "Rotating forward or back", "Holding breath"],
  },
  "Glute Bridge (single leg)": {
    muscles: { primary: ["Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Lie on back, one foot flat on floor, other leg extended or held up.",
      "Drive through the planted foot to lift hips.",
      "Squeeze glute at the top, lower slowly.",
    ],
    cues: ["Keep hips level — don't let one side drop", "All the work on one glute", "Pause at the top"],
    mistakes: ["Hips tilting to one side", "Pushing through toes", "Hyperextending the back"],
  },
  "Hip Thrust (SL)": {
    muscles: { primary: ["Glutes"], secondary: ["Hamstrings", "Core"] },
    steps: [
      "Set up as for a hip thrust, but one foot on the floor, other leg extended.",
      "Drive hips up on one leg.",
      "Lower and repeat.",
    ],
    cues: ["Single-leg hip thrust — very challenging", "Keep hips level", "Great for fixing glute imbalances"],
    mistakes: ["Hips rotating", "Using the back instead of the glute", "Not going through full range"],
  },
  "Bottoms-Up KB Press": {
    muscles: { primary: ["Shoulders", "Grip", "Rotator cuff"], secondary: ["Triceps", "Core"] },
    steps: [
      "Hold a kettlebell upside down by the handle at shoulder height.",
      "Press overhead while keeping the KB balanced.",
      "Lower under control.",
    ],
    cues: ["The instability forces incredible shoulder stabilisation", "Crush the handle — grip hard", "Go light — this is harder than it looks"],
    mistakes: ["Going too heavy — KB will flip", "Loose grip — squeeze hard", "Not controlling the descent"],
  },
  "Band External Rotation": {
    muscles: { primary: ["Rotator cuff (infraspinatus, teres minor)"], secondary: [] },
    steps: [
      "Stand with elbow bent 90 degrees, band anchored at elbow height.",
      "Rotate your forearm outward, keeping elbow pinned to your side.",
      "Return slowly.",
    ],
    cues: ["Slow and controlled — this is a small muscle", "Elbow stays at your side throughout", "Essential for shoulder health"],
    mistakes: ["Moving the elbow away from your side", "Using too much resistance", "Going too fast"],
  },
  "Cable External Rotation": {
    muscles: { primary: ["Rotator cuff"], secondary: [] },
    steps: [
      "Same as Band External Rotation but with a cable.",
    ],
    cues: ["Cable provides constant tension", "Light weight, high reps", "Elbow stays pinned"],
    mistakes: ["Going too heavy", "Elbow drifting", "Rushing"],
  },
  "Light DB ER": {
    muscles: { primary: ["Rotator cuff"], secondary: [] },
    steps: [
      "Lie on your side with a light dumbbell.",
      "Elbow at 90 degrees on your side. Rotate forearm up toward ceiling.",
      "Lower slowly.",
    ],
    cues: ["Very light weight — 1–3kg", "Slow and controlled", "Great pre-hab exercise"],
    mistakes: ["Too heavy", "Rolling the body to help", "Going too fast"],
  },
  "TRX Y-T-W": {
    muscles: { primary: ["Rear delts", "Rotator cuff", "Traps"], secondary: ["Rhomboids"] },
    steps: [
      "Hold TRX handles, lean back with body straight.",
      "Pull into a Y position (arms overhead), T (arms out), W (arms bent back).",
      "Do all three positions as one set.",
    ],
    cues: ["8 reps of each position", "Squeeze shoulder blades on every rep", "Adjust body angle to control difficulty"],
    mistakes: ["Going too horizontal — too hard to maintain form", "Rushing through positions", "Not squeezing the shoulder blades"],
  },
  "DB Y-T-W (prone)": {
    muscles: { primary: ["Rear delts", "Traps", "Rotator cuff"], secondary: ["Rhomboids"] },
    steps: [
      "Lie face down on an incline bench with light dumbbells.",
      "Raise arms into Y, T, then W positions.",
    ],
    cues: ["Very light weight — 1–3kg per hand", "Squeeze shoulder blades on every rep", "Great for shoulder health and posture"],
    mistakes: ["Going too heavy", "Lifting with momentum", "Not differentiating the three positions"],
  },
  "Band Y-T-W": {
    muscles: { primary: ["Rear delts", "Traps", "Rotator cuff"], secondary: [] },
    steps: [
      "Anchor a band at chest height. Perform Y, T, and W pulls.",
    ],
    cues: ["Same positions as TRX/DB version", "Light resistance, high quality", "Focus on scapular control"],
    mistakes: ["Band too heavy", "Rushing", "Poor scapular control"],
  },
  "Push-Up to T-Rotation": {
    muscles: { primary: ["Chest", "Core", "Obliques"], secondary: ["Shoulders", "Triceps"] },
    steps: [
      "Do a push-up. At the top, rotate into a side plank, extending top arm to ceiling.",
      "Return to push-up position. Repeat on the other side.",
    ],
    cues: ["Smooth transition from push-up to rotation", "Stack hips in the side plank", "Core stays braced throughout"],
    mistakes: ["Not rotating fully", "Hips sagging during the push-up", "Rushing the transition"],
  },
  "Side Plank + Row": {
    muscles: { primary: ["Obliques", "Lats"], secondary: ["Core", "Biceps"] },
    steps: [
      "Side plank position with top hand on a cable or dumbbell.",
      "Row the weight toward your hip while maintaining the side plank.",
    ],
    cues: ["Anti-rotation meets rowing — full body stability", "Don't rotate toward the row", "Keep hips stacked"],
    mistakes: ["Rotating toward the weight", "Hips dropping", "Going too heavy and losing plank position"],
  },
  "Cable Push-Pull": {
    muscles: { primary: ["Chest", "Back", "Core"], secondary: ["Shoulders"] },
    steps: [
      "Stand between two cables. Push with one arm while pulling with the other.",
      "Switch directions.",
    ],
    cues: ["Simultaneous push and pull — total body stability", "Core has to resist rotation", "Great for functional strength"],
    mistakes: ["Rotating the torso", "Not controlling both movements", "Going too heavy"],
  },
  "Single-Arm Cable Row": {
    muscles: { primary: ["Lats", "Rhomboids"], secondary: ["Biceps", "Core"] },
    steps: [
      "Stand facing a cable. Pull one handle to your hip.",
      "Pause at the end, then return slowly.",
    ],
    cues: ["Anti-rotation — don't let your body twist", "Pause at peak contraction", "Great for finding side-to-side imbalances"],
    mistakes: ["Rotating toward the pulling arm", "Rushing through reps", "Not pausing at the contraction"],
  },
  "Single-Arm DB Row": {
    muscles: { primary: ["Lats", "Rhomboids"], secondary: ["Biceps", "Rear delts"] },
    steps: [
      "Same as Dumbbell Row — one hand on bench, row with the other.",
    ],
    cues: ["Pull to hip", "Keep torso parallel", "Full stretch at the bottom"],
    mistakes: ["Twisting torso", "Rowing to chest", "Short ROM"],
  },
  "TRX Row (single arm)": {
    muscles: { primary: ["Lats", "Core"], secondary: ["Biceps", "Obliques"] },
    steps: [
      "Hold one TRX handle, lean back.",
      "Row yourself up with one arm while maintaining body alignment.",
    ],
    cues: ["Huge core demand — resist rotation", "Adjust body angle for difficulty", "Free hand can be at your side or behind your back"],
    mistakes: ["Rotating toward the pulling arm", "Body not staying straight", "Leaning back too far for your strength level"],
  },
  "Quadruped Reach": {
    muscles: { primary: ["Core", "Glutes"], secondary: ["Shoulders"] },
    steps: [
      "Start on all fours — hands under shoulders, knees under hips.",
      "Extend opposite arm and leg simultaneously.",
      "Hold for 2 seconds, return, switch sides.",
    ],
    cues: ["Same concept as Bird Dog", "Don't let hips rotate or shift", "Slow and controlled"],
    mistakes: ["Hips shifting to one side", "Arching the back", "Rushing"],
  },
  "Bird Dog": {
    muscles: { primary: ["Core", "Glutes", "Erectors"], secondary: [] },
    steps: [
      "On all fours. Extend opposite arm and leg.",
      "Hold 2–3 seconds. Return and switch.",
    ],
    cues: ["Hips stay level — don't rotate", "Reach long — extend fully", "Excellent for low-back health"],
    mistakes: ["Hips rotating", "Arching the back", "Going too fast"],
  },
  "Superman Hold": {
    muscles: { primary: ["Erectors", "Glutes"], secondary: ["Shoulders"] },
    steps: [
      "Lie face down. Lift arms, chest, and legs off the floor simultaneously.",
      "Hold for prescribed time.",
    ],
    cues: ["Squeeze glutes and upper back", "Don't hyperextend the neck — look at the floor", "Breathe normally"],
    mistakes: ["Cranking the neck up", "Not squeezing glutes", "Holding breath"],
  },
  "Hollow Body Hold": {
    muscles: { primary: ["Core", "Hip flexors"], secondary: [] },
    steps: [
      "Lie on your back. Raise arms overhead and legs off the floor.",
      "Press your lower back into the floor and hold.",
    ],
    cues: ["Lower back must stay on the floor", "The closer your limbs are to the floor, the harder it is", "Tuck chin slightly"],
    mistakes: ["Lower back arching — bend knees to make it easier", "Holding breath", "Letting limbs drop to the floor"],
  },
  "Single-Leg Squat (pistol assist)": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core", "Hip stabilisers"] },
    steps: [
      "Hold a TRX or rail for support. Stand on one leg.",
      "Squat as low as you can on one leg, other leg extended forward.",
      "Drive back up using the working leg.",
    ],
    cues: ["Use support as little as possible — it's a guide, not a crutch", "Work toward unassisted over time", "Knee tracks over toes"],
    mistakes: ["Relying too much on the support", "Knee caving in", "Not going deep enough"],
  },
  "Supported Single-Leg Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core"] },
    steps: [
      "Same as pistol assist — hold TRX or rail throughout the full range.",
    ],
    cues: ["More support than a pistol assist — use throughout", "Focus on control and depth", "Great for building single-leg strength safely"],
    mistakes: ["Pulling too much with arms", "Knee caving in", "Not controlling the descent"],
  },
  "Lateral Band Walk": {
    muscles: { primary: ["Glute medius", "Hip abductors"], secondary: [] },
    steps: [
      "Band above knees or ankles. Quarter squat position.",
      "Step laterally, maintaining tension on the band.",
      "Don't let feet come together — constant tension.",
    ],
    cues: ["Stay low — quarter squat throughout", "Push knees out against the band", "Great for warming up and glute activation"],
    mistakes: ["Standing too upright", "Letting the trail foot snap back — controlled steps", "Band too low (ankles) before building strength"],
  },
  "Clamshell": {
    muscles: { primary: ["Glute medius"], secondary: ["Hip rotators"] },
    steps: [
      "Lie on your side, knees bent at 45 degrees, feet together.",
      "Open your top knee like a clamshell, keeping feet together.",
      "Lower slowly.",
    ],
    cues: ["Don't roll your hips back — they stay stacked", "Squeeze the glute at the top", "Add a band for more resistance"],
    mistakes: ["Rolling hips backward to open further", "Lifting the feet apart", "Going too fast"],
  },
  "Hip Abduction Machine": {
    muscles: { primary: ["Glute medius", "Hip abductors"], secondary: [] },
    steps: [
      "Sit in the machine, pads on the outside of your knees.",
      "Push your legs apart against the resistance.",
      "Return slowly.",
    ],
    cues: ["Squeeze at the end range", "Controlled return — don't let the weight slam", "Great for targeting the hip abductors directly"],
    mistakes: ["Slamming the weight on the return", "Leaning forward to cheat", "Going too heavy and losing control"],
  },
  "Hip Adduction Machine": {
    muscles: { primary: ["Adductors"], secondary: [] },
    steps: [
      "Sit in the machine, pads on the inside of your knees.",
      "Squeeze your legs together against the resistance.",
      "Return slowly.",
    ],
    cues: ["Squeeze at the midpoint", "Controlled in both directions", "Good for groin strength and injury prevention"],
    mistakes: ["Slamming weight shut", "Going too heavy", "Rushing through reps"],
  },
  "Terminal Knee Extension": {
    muscles: { primary: ["Quads (VMO)"], secondary: [] },
    steps: [
      "Anchor a band behind your knee. Stand facing the anchor.",
      "Start with a slight knee bend and extend to full lockout against the band.",
    ],
    cues: ["Targets the VMO — the inner quad near the kneecap", "Excellent for knee health and rehab", "Full extension each rep"],
    mistakes: ["Band too light to challenge", "Not reaching full knee extension", "Going too fast"],
  },
  "Leg Extension (light)": {
    muscles: { primary: ["Quads"], secondary: [] },
    steps: [
      "Sit in the leg extension machine.",
      "Extend your legs to full lockout with light weight.",
      "Lower slowly.",
    ],
    cues: ["Light weight, focused contraction", "Great for VMO and knee stability", "Slow eccentric — 3 seconds down"],
    mistakes: ["Going too heavy — this is for control, not strength", "Kicking the weight up", "Not reaching full extension"],
  },
  "Seated Knee Press": {
    muscles: { primary: ["Quads"], secondary: [] },
    steps: [
      "Sit with a band around your knees.",
      "Press knees apart, then press one knee straight forward against band resistance.",
    ],
    cues: ["Builds knee tracking control", "Light resistance, focused movement", "Great for knee rehab"],
    mistakes: ["Too much resistance", "Jerky movements", "Not focusing on the knee tracking"],
  },
  "Single-Leg Calf Raise": {
    muscles: { primary: ["Gastrocnemius", "Soleus"], secondary: [] },
    steps: [
      "Stand on one foot on the edge of a step.",
      "Lower heel for a deep stretch, then rise as high as possible.",
      "Slow tempo — 3 seconds up, 3 seconds down.",
    ],
    cues: ["Much harder than bilateral — start with bodyweight", "Full range every rep", "Hold something for balance"],
    mistakes: ["Going too fast", "Not using full range", "Bouncing at the bottom"],
  },
  "Balance Board Squat": {
    muscles: { primary: ["Quads", "Core"], secondary: ["Ankles", "Glutes"] },
    steps: [
      "Stand on a balance board or wobble board.",
      "Perform slow bodyweight squats while maintaining balance.",
    ],
    cues: ["Proprioception training — your ankles and knees learn to stabilise", "Go slowly — speed is not the point", "Start shallow, go deeper as balance improves"],
    mistakes: ["Going too deep before stability is established", "Rushing", "Not engaging core"],
  },
  "Bosu Squat": {
    muscles: { primary: ["Quads", "Core"], secondary: ["Ankles", "Glutes"] },
    steps: [
      "Stand on the flat or dome side of a Bosu ball.",
      "Perform bodyweight squats.",
    ],
    cues: ["Similar to balance board — unstable surface builds proprioception", "Slower than regular squats", "Flat side up is harder"],
    mistakes: ["Going too deep and losing balance", "Rushing", "Not engaging core"],
  },
  "Single-Leg Stand": {
    muscles: { primary: ["Ankles", "Core"], secondary: ["Glutes", "Hip stabilisers"] },
    steps: [
      "Stand on one leg. Hold for prescribed time.",
      "Close eyes for added difficulty.",
    ],
    cues: ["Sounds simple — try it with eyes closed", "Great for balance and proprioception", "Engage your core and glute"],
    mistakes: ["Locking the standing knee — keep a slight bend", "Looking down — look forward", "Not engaging the glute"],
  },
  "Reverse Step-Up": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core"] },
    steps: [
      "Stand on a box. Step one foot backward off the box.",
      "Lower slowly until your foot touches the ground.",
      "Drive through the top foot to stand back up.",
    ],
    cues: ["Control the descent — that's the exercise", "Same concept as slow eccentric step-up", "Great for knee stability"],
    mistakes: ["Dropping too fast", "Using the lower foot to push off", "Not controlling the descent"],
  },
  "Box Step": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core"] },
    steps: [
      "Step onto a box with one foot, stand up, step down.",
    ],
    cues: ["Basic step-up pattern", "Drive through the top foot", "Controlled up and down"],
    mistakes: ["Pushing off the ground foot", "Box too high", "Rushing"],
  },
  "Turkish Get-Up": {
    muscles: { primary: ["Core", "Shoulders", "Glutes", "Quads"], secondary: ["Everything else"] },
    steps: [
      "Lie on your back holding a KB or DB overhead with one arm.",
      "Roll to elbow, then to hand, bridge hips up, sweep leg through to kneel.",
      "Stand up, then reverse the entire sequence.",
    ],
    cues: ["Each step is deliberate — don't rush any transition", "Eyes on the weight the entire time", "Start light — this is complex"],
    mistakes: ["Rushing through steps", "Losing eye contact with the weight", "Going too heavy before mastering the pattern"],
  },
  "Segmented TGU": {
    muscles: { primary: ["Core", "Shoulders"], secondary: ["Glutes", "Quads"] },
    steps: [
      "Same as Turkish Get-Up but pause 3–5 seconds at each position.",
    ],
    cues: ["The pauses build stability at each stage", "Even lighter than regular TGU", "Focus on perfect positions"],
    mistakes: ["Not holding each position long enough", "Losing alignment", "Going too heavy"],
  },
  "Half Get-Up": {
    muscles: { primary: ["Core", "Shoulders"], secondary: ["Obliques"] },
    steps: [
      "Same start as TGU — lie down, press weight up.",
      "Roll to elbow, then to hand, bridge hips up.",
      "Reverse back down. Stop here — no standing.",
    ],
    cues: ["First half of the TGU — builds the foundation", "Great starting point before attempting full TGUs", "Weight stays locked out overhead"],
    mistakes: ["Weight drifting out of alignment", "Hips not bridging high enough", "Rushing the transitions"],
  },
  "Windmill": {
    muscles: { primary: ["Obliques", "Core", "Shoulders"], secondary: ["Hamstrings", "Hips"] },
    steps: [
      "Hold a KB or DB overhead with one arm.",
      "Push your hip out to the side of the weight.",
      "Reach your free hand down your front leg toward the floor.",
      "Return to standing.",
    ],
    cues: ["Eyes stay on the weight overhead the entire time", "It's a hip hinge to the side, not a bend", "Go light — this requires flexibility"],
    mistakes: ["Losing sight of the weight", "Bending instead of hinging", "Going too heavy"],
  },
  "Bear Crawl": {
    muscles: { primary: ["Core", "Shoulders", "Quads"], secondary: ["Hip flexors"] },
    steps: [
      "Start on all fours, knees hovering just off the ground.",
      "Move forward — opposite hand and foot advance together.",
      "Keep knees close to the floor throughout.",
    ],
    cues: ["Knees stay 2–3 inches off the ground", "Small steps — don't rush", "Incredible core exercise despite looking simple"],
    mistakes: ["Hips rising too high", "Steps too big", "Knees touching the floor"],
  },
  "Commando Crawl": {
    muscles: { primary: ["Core", "Shoulders", "Arms"], secondary: ["Chest"] },
    steps: [
      "Start in a low plank on forearms.",
      "Crawl forward using elbows and toes.",
    ],
    cues: ["Stay low — belly nearly touches the ground", "Military-style crawl", "Great for core endurance"],
    mistakes: ["Hips rising too high", "Not using arms and legs together", "Going too fast"],
  },
  "Inchworm": {
    muscles: { primary: ["Core", "Hamstrings", "Shoulders"], secondary: [] },
    steps: [
      "Stand tall. Bend forward and walk hands out to a plank.",
      "Walk feet toward hands. Stand up. Repeat.",
    ],
    cues: ["Great warm-up movement", "Legs as straight as hamstrings allow", "Walk hands out slowly"],
    mistakes: ["Bending knees too much", "Rushing", "Not reaching full plank position"],
  },
  "Hollow Body Rock": {
    muscles: { primary: ["Core"], secondary: ["Hip flexors"] },
    steps: [
      "Get into a hollow body hold position.",
      "Rock gently forward and back while maintaining the position.",
    ],
    cues: ["Lower back stays on the floor the entire time", "Rock is small and controlled", "Don't break the hollow position"],
    mistakes: ["Breaking the hollow — back arching", "Rocking too aggressively", "Legs or arms dropping"],
  },
  "Hollow Hold": {
    muscles: { primary: ["Core"], secondary: ["Hip flexors"] },
    steps: [
      "Same as Hollow Body Hold — lie on back, arms overhead, legs raised, lower back pressed to floor.",
    ],
    cues: ["Lower back MUST stay on the floor", "Tuck chin, look at toes", "Modify by bending knees if needed"],
    mistakes: ["Back arching", "Holding breath", "Limbs too close to floor before you're ready"],
  },
  "Ab Mat Crunch": {
    muscles: { primary: ["Rectus abdominis"], secondary: [] },
    steps: [
      "Lie back over an ab mat, arms overhead.",
      "Crunch up, reaching forward.",
    ],
    cues: ["The ab mat extends your range of motion", "Full stretch at the bottom, full crunch at the top", "Controlled speed"],
    mistakes: ["Using momentum to swing up", "Pulling on neck", "Not using full range the mat provides"],
  },
  "Cable Chop (high to low)": {
    muscles: { primary: ["Obliques", "Core"], secondary: ["Shoulders"] },
    steps: [
      "Cable set high. Grip with both hands.",
      "Chop diagonally from high to low across your body.",
      "Control the return.",
    ],
    cues: ["Rotation comes from hips and core, not arms", "Same as Cable Woodchop", "Exhale on the chop"],
    mistakes: ["Pulling with arms", "Not rotating from the hips", "Going too fast on return"],
  },
  "Band Chop": {
    muscles: { primary: ["Obliques", "Core"], secondary: ["Shoulders"] },
    steps: [
      "Band anchored high. Same chopping motion as cable version.",
    ],
    cues: ["Same as cable chop — band version for home training", "Hip rotation drives the movement", "Exhale on the chop"],
    mistakes: ["All arms", "Not enough resistance", "Rushing"],
  },
  "Med Ball Slam": {
    muscles: { primary: ["Lats", "Core", "Shoulders"], secondary: ["Quads"] },
    steps: [
      "Hold a slam ball overhead.",
      "Slam it into the ground as hard as possible.",
      "Squat down to pick it up and repeat.",
    ],
    cues: ["Full body power — use everything", "Slam with anger — max force", "Great for stress relief and conditioning"],
    mistakes: ["Not using the whole body — engage legs and core", "Using a bouncy ball — use a dead ball/slam ball", "Not slamming hard enough"],
  },
  "Loaded Carry (overhead)": {
    muscles: { primary: ["Shoulders", "Core", "Traps"], secondary: ["Triceps"] },
    steps: [
      "Press a KB or DB overhead with one arm. Lock out.",
      "Walk with the weight overhead, maintaining perfect posture.",
    ],
    cues: ["Arm fully locked — bicep by your ear", "Core braced hard to prevent lateral lean", "Fixes shoulder stability like nothing else"],
    mistakes: ["Arm not locked out — elbow fully extended", "Leaning to the opposite side", "Walking too fast"],
  },
  "Waiter Carry": {
    muscles: { primary: ["Shoulders", "Core"], secondary: ["Traps", "Rotator cuff"] },
    steps: [
      "Hold a KB bottoms-up or plate flat on your palm overhead.",
      "Walk with arm extended overhead.",
    ],
    cues: ["Like carrying a tray of drinks — the instability is the exercise", "Core braces against the asymmetric load", "Go light"],
    mistakes: ["Weight tipping over", "Leaning away from the weight", "Going too heavy"],
  },
  "Shoulder Carry": {
    muscles: { primary: ["Core", "Shoulders"], secondary: ["Traps"] },
    steps: [
      "Hold a KB or DB at shoulder height (rack position) with one arm.",
      "Walk for prescribed distance.",
    ],
    cues: ["Core fights the asymmetric load", "Stay upright — don't lean away", "Switch sides each set"],
    mistakes: ["Leaning away from the weight", "Elbow dropping", "Walking too fast"],
  },
  "Suitcase Carry": {
    muscles: { primary: ["Obliques", "Core", "Grip"], secondary: ["Traps"] },
    steps: [
      "Hold a heavy dumbbell or KB in one hand at your side.",
      "Walk with perfect upright posture — no leaning.",
    ],
    cues: ["Your body wants to lean — don't let it", "Like carrying a heavy suitcase with perfect posture", "Obliques work overtime"],
    mistakes: ["Leaning toward the weight", "Shrugging the loaded shoulder", "Weight too light to challenge the core"],
  },
  "KB Carry": {
    muscles: { primary: ["Core", "Grip", "Shoulders"], secondary: ["Traps"] },
    steps: [
      "Hold KBs in various positions — overhead, rack, or farmer's.",
      "Walk for prescribed distance.",
    ],
    cues: ["Different positions challenge different muscles", "Maintain perfect posture regardless of carry type", "Core stays braced"],
    mistakes: ["Losing posture", "Walking too fast", "Not varying carry positions"],
  },
  "Cable Single-Leg RDL": {
    muscles: { primary: ["Hamstrings", "Glutes"], secondary: ["Core"] },
    steps: [
      "Stand facing a low cable. Single-leg hinge forward.",
      "Let the cable pull you into the stretch, then drive hips forward.",
    ],
    cues: ["Cable provides constant tension through the range", "Great for balance and hamstring control", "Keep hips square"],
    mistakes: ["Rotating the hips", "Rounding the back", "Pulling with the arms instead of hinging"],
  },
  "Assisted SL RDL": {
    muscles: { primary: ["Hamstrings", "Glutes"], secondary: ["Core"] },
    steps: [
      "Hold a support with one hand. Single-leg RDL with the other hand holding a DB.",
    ],
    cues: ["The support helps with balance while you build strength", "Same hip hinge pattern", "Work toward unassisted over time"],
    mistakes: ["Relying too much on the support", "Not hinging deep enough", "Rotating hips"],
  },
  "Split Squat": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core"] },
    steps: [
      "Staggered stance — one foot forward, one back.",
      "Lower straight down until back knee nearly touches the floor.",
      "Drive through front foot to stand.",
    ],
    cues: ["Like a lunge but stationary — feet don't move", "Torso stays upright", "Front shin roughly vertical"],
    mistakes: ["Leaning forward", "Front knee shooting past toes excessively", "Back knee slamming the floor"],
  },
  "Step-Up (DB)": {
    muscles: { primary: ["Quads", "Glutes"], secondary: ["Core"] },
    steps: [
      "Hold DBs at sides. Step onto a box, drive through top foot, stand up.",
      "Step down under control.",
    ],
    cues: ["Same as regular step-ups with dumbbell load", "All work from the top leg", "Don't push off the bottom foot"],
    mistakes: ["Pushing off ground foot", "Leaning forward", "Box too high"],
  },
  "DB Swing": {
    muscles: { primary: ["Glutes", "Hamstrings"], secondary: ["Core", "Shoulders"] },
    steps: [
      "Same as KB swing but holding one DB with both hands.",
      "Hinge, hike, drive hips, swing to chest height.",
    ],
    cues: ["Same hip hinge pattern as KB swing", "Power from the hips", "Good substitute when no KBs available"],
    mistakes: ["Squatting instead of hinging", "Using arms", "Hyperextending"],
  },
  "Machine Fly": {
    muscles: { primary: ["Chest"], secondary: ["Front delts"] },
    steps: [
      "Sit in the pec deck machine, grip handles with arms open.",
      "Squeeze handles together in front of your chest.",
      "Return slowly.",
    ],
    cues: ["Squeeze hard at the midpoint — peak chest contraction", "Controlled opening — don't let the weight yank your arms back", "Slight bend in elbows"],
    mistakes: ["Going too heavy and losing the squeeze", "Opening too wide — shoulder injury risk", "Rushing"],
  },
  "Cable Crossover": {
    muscles: { primary: ["Chest"], secondary: ["Front delts"] },
    steps: [
      "Stand between two cable pulleys set high.",
      "Bring handles together in front of you in a downward arc.",
      "Squeeze chest at the bottom, return slowly.",
    ],
    cues: ["Cross your hands slightly at the bottom for peak contraction", "Slight forward lean", "Constant cable tension throughout"],
    mistakes: ["Using too much weight and turning it into a press", "Standing too upright", "Not crossing at the bottom"],
  },
  // ─── Flexibility regime exercises ─────────────────────────────────────────
  "World's Greatest Stretch": {
    muscles: { primary: ["Hip flexors", "Hamstrings", "T-spine"], secondary: ["Quads", "Shoulders"] },
    steps: [
      "Lunge forward with your right foot.",
      "Place left hand on the ground, rotate right arm to the ceiling.",
      "Hold, then switch sides.",
    ],
    cues: ["Covers hips, hamstrings, and thoracic spine in one move", "5 slow reps per side", "Breathe into each rotation"],
    mistakes: ["Rushing through it", "Not rotating fully", "Back knee crashing to the floor"],
  },
  "Cat-Cow Flow": {
    muscles: { primary: ["Spine", "Core"], secondary: [] },
    steps: [
      "On all fours. Inhale — drop belly, lift head (cow).",
      "Exhale — round back, tuck chin (cat).",
      "Flow between the two positions.",
    ],
    cues: ["Match movement to breath", "Move through the entire spine", "Excellent warm-up for any session"],
    mistakes: ["Moving too fast", "Only moving from the lower back — articulate the whole spine", "Holding breath"],
  },
  "Cat-Cow": {
    muscles: { primary: ["Spine", "Core"], secondary: [] },
    steps: [
      "Same as Cat-Cow Flow.",
    ],
    cues: ["Inhale cow, exhale cat", "Full spinal movement", "Great warm-up"],
    mistakes: ["Rushing", "Partial range", "Not breathing with the movement"],
  },
  "Hip 90/90 Flow": {
    muscles: { primary: ["Hip rotators", "Glutes"], secondary: [] },
    steps: [
      "Sit on floor with both legs bent at 90 degrees — one in front, one behind.",
      "Rotate your legs to switch which leg is in front.",
      "Flow back and forth.",
    ],
    cues: ["Great for hip internal and external rotation", "Keep torso upright", "Go slowly through the transition"],
    mistakes: ["Leaning back to compensate for tight hips", "Lifting off the ground during transition", "Rushing"],
  },
  "Thread the Needle": {
    muscles: { primary: ["T-spine", "Shoulders"], secondary: ["Core"] },
    steps: [
      "On all fours. Reach one arm under your body, rotating your thoracic spine.",
      "Return and reach that same arm toward the ceiling.",
    ],
    cues: ["Full rotation in both directions", "Follow your hand with your eyes", "Breathe into the stretch"],
    mistakes: ["Only going in one direction", "Moving from the lower back instead of T-spine", "Rushing"],
  },
  "Leg Swing (front/back)": {
    muscles: { primary: ["Hip flexors", "Hamstrings"], secondary: ["Glutes"] },
    steps: [
      "Stand on one leg, hold support.",
      "Swing the free leg forward and back in a controlled arc.",
      "Increase range each rep.",
    ],
    cues: ["Dynamic stretch — no holding", "Keep the swinging leg straight", "Great before squats or running"],
    mistakes: ["Rotating the torso", "Swinging too aggressively", "Bending the swinging leg"],
  },
  "Deep Squat Hold + Reach": {
    muscles: { primary: ["Hips", "Ankles", "T-spine"], secondary: ["Core"] },
    steps: [
      "Squat to the bottom and hold.",
      "Rotate one arm toward the ceiling, then the other.",
    ],
    cues: ["Use elbows to push knees out", "Add thoracic rotation for extra mobility", "Hold for 30–45 seconds total"],
    mistakes: ["Heels lifting — elevate them if needed", "Rounding the back excessively", "Not rotating"],
  },
  "Kneeling Hip Flexor Stretch": {
    muscles: { primary: ["Hip flexors", "Quads"], secondary: [] },
    steps: [
      "Kneel with one foot forward, back knee on the floor.",
      "Push hips forward gently.",
      "Hold for 60 seconds per side.",
    ],
    cues: ["Squeeze the back-side glute for a deeper stretch", "Posterior pelvic tilt — tuck your tailbone", "Don't lean forward — stay upright"],
    mistakes: ["Arching the lower back", "Leaning forward instead of pushing hips forward", "Not holding long enough"],
  },
  "Seated Hamstring Stretch": {
    muscles: { primary: ["Hamstrings"], secondary: [] },
    steps: [
      "Sit with one leg extended. Other foot against inner thigh.",
      "Hinge forward from the hips toward the extended foot.",
      "Hold for 45 seconds per side.",
    ],
    cues: ["Flex the foot of the extended leg", "Hinge from the hips, not the waist", "Don't round your upper back — lead with the chest"],
    mistakes: ["Rounding the back to reach further", "Bouncing", "Not holding long enough"],
  },
  "Pigeon Pose": {
    muscles: { primary: ["Glutes", "Hip rotators"], secondary: ["Hip flexors"] },
    steps: [
      "From a lunge, bring your front shin across your body on the floor.",
      "Back leg extends behind you.",
      "Fold forward over the front leg and hold.",
    ],
    cues: ["Front shin doesn't need to be parallel — work toward it", "Hold for 60–90 seconds", "Breathe and relax into it"],
    mistakes: ["Forcing the shin parallel when hips aren't ready", "Leaning to one side", "Not relaxing into the stretch"],
  },
  "Couch Stretch": {
    muscles: { primary: ["Quads", "Hip flexors"], secondary: [] },
    steps: [
      "Kneel with your back foot elevated against a wall behind you.",
      "Front foot forward in a lunge position.",
      "Push hips forward and upright.",
    ],
    cues: ["Intense quad and hip flexor stretch", "Squeeze the back glute for stability", "Hold for 60 seconds per side"],
    mistakes: ["Arching the lower back instead of squeezing the glute", "Not pressing hips forward enough", "Giving up too early — it's supposed to be intense"],
  },
  "Adductor Stretch (wide squat)": {
    muscles: { primary: ["Adductors", "Groin"], secondary: ["Hips"] },
    steps: [
      "Stand in a wide stance. Squat down, elbows inside your knees.",
      "Use your elbows to push your knees outward.",
      "Hold for 45–60 seconds.",
    ],
    cues: ["Chest stays up", "Push knees out gently with elbows", "Great for inner thigh flexibility"],
    mistakes: ["Rounding the back", "Not pushing knees out enough", "Bouncing"],
  },
  "Calf + Ankle Stretch": {
    muscles: { primary: ["Calves", "Ankle"], secondary: [] },
    steps: [
      "Wall calf stretch — foot behind you, heel on floor, lean into wall.",
      "Follow with slow ankle circles in both directions.",
    ],
    cues: ["Straight back leg for gastrocnemius, bent for soleus", "Ankle circles improve mobility", "45 seconds per side"],
    mistakes: ["Not pressing the heel down", "Rushing through ankle circles", "Forgetting to stretch both gastrocnemius and soleus"],
  },
  "Doorway Chest Stretch": {
    muscles: { primary: ["Chest", "Front delts"], secondary: [] },
    steps: [
      "Stand in a doorway, arm at 90 degrees against the frame.",
      "Step through gently until you feel the chest stretch.",
      "Hold for 45 seconds per side.",
    ],
    cues: ["Change arm height to target different portions of the pecs", "Don't lean too aggressively", "Breathe into the stretch"],
    mistakes: ["Pushing too hard and straining the shoulder", "Not holding long enough", "Arm too high or too low"],
  },
  "Sleeper Stretch": {
    muscles: { primary: ["Posterior shoulder capsule"], secondary: ["Rotator cuff"] },
    steps: [
      "Lie on your side with bottom arm extended at 90 degrees.",
      "Use your top hand to gently push the bottom forearm toward the floor.",
      "Hold for 45 seconds per side.",
    ],
    cues: ["Very gentle — don't force this stretch", "Targets the back of the shoulder", "Important for overhead athletes and desk workers"],
    mistakes: ["Pushing too hard — can irritate the shoulder", "Rolling off the shoulder", "Bouncing"],
  },
  "Thoracic Extension over Foam Roller": {
    muscles: { primary: ["T-spine"], secondary: ["Chest"] },
    steps: [
      "Place a foam roller under your upper back (T4–T8 area).",
      "Hands behind head, let your upper back extend over the roller.",
      "Hold for 30–45 seconds, then reposition higher or lower.",
    ],
    cues: ["Only extend through the thoracic spine — not the lower back", "Arms behind head acts as a counterweight", "Breathe and relax into the extension"],
    mistakes: ["Extending the lower back instead of the upper", "Rolling too fast — hold the positions", "Roller on the neck — stay on the upper back"],
  },
  "Lat Stretch (overhead grip)": {
    muscles: { primary: ["Lats"], secondary: ["Teres major", "Obliques"] },
    steps: [
      "Grip a bar or rack overhead. Sit your hips back and down.",
      "Let your chest drop toward the floor.",
      "Hold for 45 seconds.",
    ],
    cues: ["You should feel a deep stretch along the side of your back", "Relax into it — let gravity do the work", "Shift your hips to one side to emphasise each lat"],
    mistakes: ["Not sitting back enough", "Shrugging shoulders", "Rushing"],
  },
  "Neck Flexion/Extension Flow": {
    muscles: { primary: ["Neck"], secondary: [] },
    steps: [
      "Slowly look down (chin to chest), then up (look at ceiling).",
      "Flow between the two positions.",
    ],
    cues: ["Extremely slow — never force range", "10 reps each direction", "Stop immediately if any pain or dizziness"],
    mistakes: ["Going too fast", "Forcing range", "Cranking the neck"],
  },
  "Child's Pose to Cobra Flow": {
    muscles: { primary: ["Spine", "Hip flexors", "Chest"], secondary: ["Shoulders"] },
    steps: [
      "Start in child's pose — hips on heels, arms extended.",
      "Flow forward into cobra — hips to floor, chest up.",
      "Return to child's pose.",
    ],
    cues: ["Breathe through each transition", "Smooth, wave-like movement through the spine", "Great spinal mobility drill"],
    mistakes: ["Jumping between positions instead of flowing", "Holding breath", "Forcing cobra position too aggressively"],
  },
  "Supine Spinal Twist": {
    muscles: { primary: ["Spine", "Obliques"], secondary: ["Chest", "Glutes"] },
    steps: [
      "Lie on your back, arms out. Pull one knee across your body.",
      "Keep both shoulders on the floor.",
      "Hold for 60–90 seconds per side.",
    ],
    cues: ["Let gravity do the work — relax into it", "Both shoulders stay on the floor", "Look away from the knee for more stretch"],
    mistakes: ["Shoulders lifting off the floor", "Forcing the knee down too aggressively", "Not holding long enough"],
  },
  "Full Splits Progression": {
    muscles: { primary: ["Hamstrings", "Hip flexors", "Adductors"], secondary: [] },
    steps: [
      "Slide into the split position slowly — go to YOUR edge.",
      "Support yourself with hands or blocks.",
      "Hold at your maximum comfortable depth for 60 seconds.",
    ],
    cues: ["Never bounce or force it", "Use blocks or hands for support as needed", "Consistency over weeks is what gets you there"],
    mistakes: ["Bouncing — risk of muscle tear", "Going too deep too fast", "Comparing yourself to others — flexibility is individual"],
  },
  "Pancake Stretch": {
    muscles: { primary: ["Adductors", "Hamstrings"], secondary: ["Spine"] },
    steps: [
      "Sit with legs spread wide. Fold forward from the hips.",
      "Aim to get your chest toward the floor.",
      "Hold for 60–90 seconds.",
    ],
    cues: ["Lead with the chest, not the head", "Hinge from the hips", "Very challenging — progress is slow but real"],
    mistakes: ["Rounding the back to get lower — hinge from hips", "Bouncing", "Giving up too soon — this takes months"],
  },
  "Loaded Progressive Stretch": {
    muscles: { primary: ["Hamstrings", "Hip flexors"], secondary: [] },
    steps: [
      "Hold a light plate or DB and use it for gravity-assisted stretching.",
      "Get into a hamstring or hip flexor stretch, let the weight gently deepen it.",
      "Hold for 45 seconds.",
    ],
    cues: ["Very gentle weight — 3–10kg", "The weight assists gravity, not forces the stretch", "Breathe and relax into it"],
    mistakes: ["Weight too heavy — should be gentle assistance only", "Forcing the stretch", "Bouncing"],
  },
  "PNF Hamstring": {
    muscles: { primary: ["Hamstrings"], secondary: [] },
    steps: [
      "Lie on your back, leg extended toward ceiling (use a band or partner).",
      "Contract the hamstring against resistance for 5 seconds.",
      "Relax, then gently push the stretch deeper.",
      "Repeat 3 cycles.",
    ],
    cues: ["Contract-relax method — the gold standard for flexibility", "5 second contraction, then go deeper on the relaxation", "3 cycles per side"],
    mistakes: ["Contracting too hard — 50–70% effort is enough", "Not relaxing fully between contractions", "Rushing through cycles"],
  },
  "Savasana / Breathing": {
    muscles: { primary: [], secondary: [] },
    steps: [
      "Lie flat on your back, arms at sides, eyes closed.",
      "Breathe deeply into your belly — 4 seconds in, 6 seconds out.",
      "Hold for 5 minutes.",
    ],
    cues: ["Complete relaxation — scan your body and release tension", "Diaphragmatic breathing — belly rises, not chest", "Great way to end any session"],
    mistakes: ["Chest breathing instead of belly breathing", "Fidgeting — commit to stillness", "Cutting it short"],
  },
  "Hip Flexor + Twist": {
    muscles: { primary: ["Hip flexors", "T-spine"], secondary: [] },
    steps: [
      "Deep lunge position. Rotate your torso toward the front knee.",
      "Reach the arm up toward the ceiling.",
      "Hold, then switch sides.",
    ],
    cues: ["Combines hip flexor stretch with thoracic rotation", "Similar to World's Greatest Stretch", "Hold each side 30 seconds"],
    mistakes: ["Not rotating enough", "Back knee not down", "Rushing"],
  },
  "Deep Lunge Flow": {
    muscles: { primary: ["Hip flexors", "Quads", "Hamstrings"], secondary: [] },
    steps: [
      "Flow between deep lunge positions — forward, side, back.",
      "Move slowly and with control.",
    ],
    cues: ["Dynamic stretching through multiple planes", "Great warm-up for lower body", "Controlled speed throughout"],
    mistakes: ["Moving too fast", "Not going deep enough into each lunge", "Losing balance"],
  },
  "Spine Wave": {
    muscles: { primary: ["Spine"], secondary: ["Core"] },
    steps: [
      "On all fours, create a wave-like motion through your spine.",
      "Start from the pelvis and roll through to the head.",
    ],
    cues: ["Fluid, wave-like motion — like a cat stretching", "Articulate each vertebra", "Breathe with the movement"],
    mistakes: ["Moving as one block instead of articulating", "Going too fast", "Not engaging the full spine"],
  },
  "Segmental Roll": {
    muscles: { primary: ["Spine", "Core"], secondary: [] },
    steps: [
      "Lie on your back. Roll to your side by initiating with your head, then shoulders, then hips.",
      "Reverse the order to roll back.",
    ],
    cues: ["The roll should flow through each spinal segment", "Very slow — each segment follows the previous", "Great for spinal awareness"],
    mistakes: ["Rolling as one unit instead of segmentally", "Going too fast", "Skipping segments"],
  },
  "Seated Hip Rotation": {
    muscles: { primary: ["Hip rotators"], secondary: [] },
    steps: [
      "Sit on the floor with knees bent. Rotate knees side to side.",
    ],
    cues: ["Similar to 90/90 but simpler", "Smooth, controlled rotations", "Good for hip warm-up"],
    mistakes: ["Forcing range", "Rushing", "Leaning back excessively"],
  },
  "Open Book": {
    muscles: { primary: ["T-spine"], secondary: ["Chest"] },
    steps: [
      "Lie on your side, knees stacked and bent. Arms extended in front.",
      "Open your top arm to the other side like a book opening.",
      "Follow with your eyes. Return slowly.",
    ],
    cues: ["Great thoracic rotation drill", "Keep knees together — only the upper body rotates", "Breathe into the rotation"],
    mistakes: ["Knees separating", "Forcing the rotation", "Not following with the eyes"],
  },
  "Seated Rotation": {
    muscles: { primary: ["T-spine", "Obliques"], secondary: [] },
    steps: [
      "Sit upright, legs crossed or extended.",
      "Rotate your torso to one side, using your hand on your knee for leverage.",
      "Hold, then rotate to the other side.",
    ],
    cues: ["Rotate from the thoracic spine, not the lower back", "Sit tall throughout", "Gentle leverage — don't force it"],
    mistakes: ["Rounding the back", "Forcing with the arms", "Rotating from the lumbar spine"],
  },
  "Standing Hip Flexor": {
    muscles: { primary: ["Hip flexors"], secondary: [] },
    steps: [
      "Stand in a staggered stance. Push hips forward on the back leg.",
    ],
    cues: ["Similar to kneeling version but standing", "Squeeze the back glute for a deeper stretch", "Tuck the tailbone"],
    mistakes: ["Arching the lower back", "Not pushing hips far enough forward", "Not squeezing the glute"],
  },
  "Straight-Leg Raise": {
    muscles: { primary: ["Hamstrings"], secondary: ["Hip flexors"] },
    steps: [
      "Lie on your back. Raise one straight leg toward the ceiling.",
      "Hold at the top and switch.",
    ],
    cues: ["Active flexibility drill", "Go only as high as you can with a straight leg", "Excellent for hamstring mobility"],
    mistakes: ["Bending the knee to go higher", "Jerking the leg up", "Lower back arching off the floor"],
  },
  "Goblet Squat Hold": {
    muscles: { primary: ["Hips", "Ankles"], secondary: ["Core"] },
    steps: [
      "Hold a KB or DB at your chest. Squat to the bottom and hold.",
    ],
    cues: ["The weight acts as a counterbalance", "Use elbows to push knees out", "Hold for 30–45 seconds"],
    mistakes: ["Not going deep enough", "Heels lifting", "Rounding the back"],
  },
  "Squat to Stand": {
    muscles: { primary: ["Hamstrings", "Hips"], secondary: ["Core"] },
    steps: [
      "Bend forward, grab your toes.",
      "Squat your hips down while holding your toes.",
      "Lift your chest, then stand up.",
    ],
    cues: ["Combines hamstring stretch with squat mobility", "Great warm-up drill", "Smooth transition between positions"],
    mistakes: ["Letting go of toes", "Not lifting chest in the squat", "Rushing"],
  },
  "Lying Hamstring Stretch": {
    muscles: { primary: ["Hamstrings"], secondary: [] },
    steps: [
      "Lie on your back. Use a strap or hands to pull one straight leg toward you.",
      "Hold for 45 seconds per side.",
    ],
    cues: ["Keep the stretching leg straight", "Don't pull too aggressively — ease into it", "Other leg stays flat on the floor"],
    mistakes: ["Bending the stretching knee", "Pulling too hard", "Lifting the other leg"],
  },
  "Supine Pigeon": {
    muscles: { primary: ["Glutes", "Hip rotators"], secondary: [] },
    steps: [
      "Lie on back. Cross one ankle over the opposite knee.",
      "Pull the bottom leg toward your chest.",
      "Hold for 60 seconds per side.",
    ],
    cues: ["Also called Figure-4 stretch — lying down version", "Keep head on the floor", "Relax into it"],
    mistakes: ["Not pulling enough to feel the stretch", "Head lifting off the floor", "Rushing"],
  },
  "Figure-4 Stretch": {
    muscles: { primary: ["Glutes", "Hip rotators"], secondary: [] },
    steps: [
      "Same as Supine Pigeon — cross ankle over knee, pull toward chest.",
    ],
    cues: ["Lying version of pigeon pose", "Great for tight hips and glutes", "Hold 60 seconds"],
    mistakes: ["Not pulling enough", "Forcing it", "Rushing"],
  },
  "Kneeling Quad Stretch": {
    muscles: { primary: ["Quads", "Hip flexors"], secondary: [] },
    steps: [
      "Kneel with one foot forward. Reach back and grab the back foot.",
      "Pull heel toward glute.",
      "Hold for 60 seconds per side.",
    ],
    cues: ["Squeeze the back glute for a deeper stretch", "Stay upright", "Use a wall or support if balance is difficult"],
    mistakes: ["Arching the lower back", "Leaning forward", "Pulling too aggressively on the ankle"],
  },
  "Prone Quad Stretch": {
    muscles: { primary: ["Quads"], secondary: [] },
    steps: [
      "Lie face down. Reach back and pull one heel toward your glute.",
      "Hold for 45 seconds per side.",
    ],
    cues: ["Simpler than kneeling version", "Squeeze glute on the stretching side", "Don't force the heel down — let it come over time"],
    mistakes: ["Arching the back to compensate", "Pulling too hard", "Not relaxing"],
  },
  "Butterfly Stretch": {
    muscles: { primary: ["Adductors", "Groin"], secondary: ["Hips"] },
    steps: [
      "Sit with soles of feet together, knees out to sides.",
      "Gently press knees toward the floor.",
      "Hold for 45–60 seconds.",
    ],
    cues: ["Don't bounce your knees — gentle, sustained pressure", "Sit tall — don't round your back", "Closer feet to body = more intense"],
    mistakes: ["Bouncing knees aggressively", "Rounding the back", "Forcing knees to the floor"],
  },
  "Side Lunge Hold": {
    muscles: { primary: ["Adductors", "Glutes"], secondary: ["Quads"] },
    steps: [
      "Step wide to one side and sink into a lateral lunge.",
      "Hold at the bottom. Straight leg should feel the stretch.",
    ],
    cues: ["Sit back into the lunge — like a single-leg squat to the side", "Heel stays flat on the bent leg", "Great for inner thigh flexibility"],
    mistakes: ["Bending knee past toes excessively", "Heel lifting", "Not going low enough"],
  },
  "Downward Dog": {
    muscles: { primary: ["Calves", "Hamstrings", "Shoulders"], secondary: ["Core"] },
    steps: [
      "Start on all fours. Push hips up and back into an inverted V.",
      "Press heels toward the floor, push through the hands.",
      "Hold or pedal feet.",
    ],
    cues: ["Classic yoga position — full posterior chain stretch", "Head between arms, ears in line with biceps", "Pedal feet to dynamically stretch each calf"],
    mistakes: ["Rounding the back — push hips up and back", "Not pressing through the hands", "Head hanging — keep it aligned"],
  },
  "Standing Calf Stretch": {
    muscles: { primary: ["Gastrocnemius", "Soleus"], secondary: [] },
    steps: [
      "Stand facing a wall, one foot behind you.",
      "Press back heel into floor, lean forward.",
      "Straight back leg = gastrocnemius. Bent back knee = soleus.",
    ],
    cues: ["Do both versions — straight leg AND bent knee", "Hold each for 30–45 seconds", "Simple but effective"],
    mistakes: ["Not pressing the heel down fully", "Only doing one version", "Bouncing"],
  },
  "Cable Chest Stretch": {
    muscles: { primary: ["Chest", "Front delts"], secondary: [] },
    steps: [
      "Hold a cable column or upright with one hand at shoulder height.",
      "Turn your body away to feel a chest stretch.",
      "Hold for 45 seconds per side.",
    ],
    cues: ["Similar to doorway stretch but using a cable column", "Vary hand height to target different chest fibres", "Gentle — don't overstretch"],
    mistakes: ["Turning too aggressively", "Shrugging the shoulder", "Bouncing"],
  },
  "Band Chest Stretch": {
    muscles: { primary: ["Chest", "Front delts"], secondary: [] },
    steps: [
      "Hold a band behind you with both hands.",
      "Lift the band overhead and behind, stretching the chest.",
    ],
    cues: ["Similar to band pass-throughs", "Go only as far as comfortable", "Great for chest and shoulder flexibility"],
    mistakes: ["Band too tight — should be comfortable", "Forcing range", "Jerking the movement"],
  },
  "Cross-Body Shoulder Stretch": {
    muscles: { primary: ["Posterior delt", "Shoulder"], secondary: [] },
    steps: [
      "Pull one arm across your chest with the other hand.",
      "Hold for 30–45 seconds per side.",
    ],
    cues: ["Keep the stretching arm straight", "Don't shrug — keep the shoulder down", "Common stretch — effective when done properly"],
    mistakes: ["Shrugging the shoulder up", "Bending the arm", "Not holding long enough"],
  },
  "Child's Pose": {
    muscles: { primary: ["Lats", "Lower back"], secondary: ["Hips", "Shoulders"] },
    steps: [
      "Kneel and sit back on your heels, arms extended forward on the floor.",
      "Let your forehead rest on the ground.",
      "Hold for 30–60 seconds.",
    ],
    cues: ["Breathe deeply into your lower back", "Walk hands to one side for a lat stretch", "Classic resting/stretching pose"],
    mistakes: ["Not sitting back on heels", "Tensing up instead of relaxing", "Rushing through it"],
  },
  "Seated T-Spine Rotation": {
    muscles: { primary: ["T-spine"], secondary: ["Obliques"] },
    steps: [
      "Sit upright in a chair or on the floor.",
      "Rotate your torso, using your hands on your knees for leverage.",
    ],
    cues: ["Rotate from the thoracic spine, not lumbar", "Sit tall throughout", "Great for desk workers"],
    mistakes: ["Rotating from the lower back", "Slouching", "Forcing the rotation"],
  },
  "Banded Lat Stretch": {
    muscles: { primary: ["Lats"], secondary: ["Teres major"] },
    steps: [
      "Attach a band to a high point. Grip the band and step back.",
      "Let the band pull your arm overhead, stretching the lat.",
    ],
    cues: ["The band provides traction — decompresses the shoulder", "Sit your hips back for more stretch", "Hold 45 seconds per side"],
    mistakes: ["Band too strong — should be gentle pull", "Shrugging", "Not relaxing into it"],
  },
  "Neck Side Bend": {
    muscles: { primary: ["Neck", "Upper traps"], secondary: [] },
    steps: [
      "Tilt your ear toward your shoulder.",
      "Hold for 30 seconds per side.",
    ],
    cues: ["Gentle — never force neck stretches", "Can use hand for gentle assist", "Keep the opposite shoulder down"],
    mistakes: ["Pulling too hard on the head", "Raising the opposite shoulder", "Jerking"],
  },
  "Levator Scap Stretch": {
    muscles: { primary: ["Levator scapulae", "Neck"], secondary: [] },
    steps: [
      "Look down toward one armpit.",
      "Use hand on the back of your head for gentle assist.",
      "Hold 30 seconds per side.",
    ],
    cues: ["Targets that tight spot between neck and shoulder blade", "Very gentle pressure — don't force", "Great for desk workers"],
    mistakes: ["Pulling too hard", "Looking straight down instead of toward the armpit", "Rushing"],
  },
  "Prayer Stretch": {
    muscles: { primary: ["Lats", "Lower back"], secondary: [] },
    steps: [
      "Kneel on the floor, arms extended forward.",
      "Sit hips back and let your chest sink toward the floor.",
    ],
    cues: ["Similar to child's pose but with more forward reach", "Breathe into the stretch", "Walk hands to each side for lateral stretch"],
    mistakes: ["Not reaching far enough forward", "Not sitting back on heels", "Tensing up"],
  },
  "Seal Stretch": {
    muscles: { primary: ["Abs", "Hip flexors"], secondary: ["Spine"] },
    steps: [
      "Lie face down. Press up with arms straight, hips on the floor.",
      "Hold with arms locked and head looking forward.",
    ],
    cues: ["Like cobra but with straight arms — more extension", "Don't force — go only as far as comfortable", "Great for opening up the front of the body"],
    mistakes: ["Hips lifting off the floor", "Forcing extension in the lower back", "Neck cranking back"],
  },
  "Seated Spinal Twist": {
    muscles: { primary: ["Spine", "Obliques"], secondary: [] },
    steps: [
      "Sit with legs extended. Cross one foot over the other knee.",
      "Rotate toward the bent knee using opposite elbow for leverage.",
      "Hold 45–60 seconds per side.",
    ],
    cues: ["Sit tall throughout", "Gentle leverage — don't crank it", "Breathe into the rotation"],
    mistakes: ["Rounding the back", "Forcing the rotation", "Holding breath"],
  },
  "Lying Figure-4": {
    muscles: { primary: ["Glutes", "Hip rotators"], secondary: [] },
    steps: [
      "Same as Supine Pigeon / Figure-4 Stretch.",
    ],
    cues: ["Cross ankle over knee, pull toward chest", "Hold 60 seconds", "Relax into it"],
    mistakes: ["Not pulling enough", "Head lifting", "Rushing"],
  },
  "Half Split": {
    muscles: { primary: ["Hamstrings"], secondary: ["Hip flexors"] },
    steps: [
      "From a kneeling position, extend the front leg straight.",
      "Hinge forward from the hips over the straight leg.",
      "Hold for 60 seconds per side.",
    ],
    cues: ["Half of a full split — great progression", "Flex the front foot", "Hinge from hips, not waist"],
    mistakes: ["Rounding the back", "Bending the front knee", "Bouncing"],
  },
  "Wide-Leg Fold": {
    muscles: { primary: ["Hamstrings", "Adductors"], secondary: [] },
    steps: [
      "Stand with feet wide apart.",
      "Fold forward from the hips.",
      "Let your head hang and relax into the stretch.",
    ],
    cues: ["Gravity does the work — just relax", "Hands on the floor or holding elbows", "Great for hamstrings and inner thighs"],
    mistakes: ["Rounding excessively — hinge from hips", "Bouncing", "Forcing depth"],
  },
  "Wide-Leg Forward Fold": {
    muscles: { primary: ["Hamstrings", "Adductors"], secondary: [] },
    steps: [
      "Same as Wide-Leg Fold.",
    ],
    cues: ["Relax and breathe", "Let gravity deepen the stretch", "Hold for 60 seconds"],
    mistakes: ["Forcing it", "Bouncing", "Rounding through the lower back"],
  },
  "Seated Straddle": {
    muscles: { primary: ["Adductors", "Hamstrings"], secondary: [] },
    steps: [
      "Sit with legs spread wide.",
      "Fold forward from the hips.",
    ],
    cues: ["Same as Pancake Stretch — seated version", "Lead with the chest", "Hold for 60–90 seconds"],
    mistakes: ["Rounding the back", "Not hinging from hips", "Bouncing"],
  },
  "DB Romanian Stretch": {
    muscles: { primary: ["Hamstrings", "Glutes"], secondary: [] },
    steps: [
      "Hold light DBs. Perform a very slow RDL, holding the bottom for 45 seconds.",
    ],
    cues: ["The weight provides gentle gravity assist", "Very light — 3–5kg per hand", "Focus on the stretch, not the lift"],
    mistakes: ["Going too heavy", "Not holding long enough", "Rounding the back"],
  },
  "Pulley Hip Flexor": {
    muscles: { primary: ["Hip flexors"], secondary: [] },
    steps: [
      "Attach a cable to your ankle. Face away from the machine.",
      "Step into a lunge position — the cable gently pulls your hip into flexor stretch.",
    ],
    cues: ["Cable provides gentle traction", "Squeeze the glute for a deeper stretch", "Light cable weight — this is a stretch, not strength"],
    mistakes: ["Cable too heavy", "Not squeezing the glute", "Arching the lower back"],
  },
  "Partner Hamstring": {
    muscles: { primary: ["Hamstrings"], secondary: [] },
    steps: [
      "Lie on back. Partner raises your straight leg toward the ceiling.",
      "Contract against partner for 5 seconds, then relax as they push deeper.",
    ],
    cues: ["PNF with a partner — very effective", "Communication is key — say 'stop' at your edge", "3 cycles of contract-relax"],
    mistakes: ["Partner pushing too aggressively", "Not communicating limits", "Contracting too hard"],
  },
  "Rope Stretch": {
    muscles: { primary: ["Hamstrings"], secondary: [] },
    steps: [
      "Lie on back with a rope or strap looped around one foot.",
      "Pull the straight leg toward you.",
    ],
    cues: ["Same as lying hamstring stretch but with a rope", "Can add PNF contract-relax", "Hold 45 seconds per side"],
    mistakes: ["Bending the knee", "Pulling too aggressively", "Not relaxing into it"],
  },
  "Meditation": {
    muscles: { primary: [], secondary: [] },
    steps: [
      "Sit or lie comfortably. Close your eyes.",
      "Focus on your breath. Let thoughts pass without engagement.",
      "5–10 minutes.",
    ],
    cues: ["Not about thinking nothing — about not engaging with thoughts", "Great for recovery and stress management", "Consistent practice is more important than duration"],
    mistakes: ["Getting frustrated with wandering thoughts — that's normal", "Trying too hard to clear your mind", "Cutting it short"],
  },
  "Progressive Muscle Relaxation": {
    muscles: { primary: [], secondary: [] },
    steps: [
      "Lie down. Tense each muscle group for 5 seconds, then release.",
      "Start from your toes and work up to your face.",
    ],
    cues: ["The contrast between tension and release teaches your body to relax", "5 seconds tension, 10 seconds release", "Great before bed"],
    mistakes: ["Tensing too hard — 50–70% effort", "Rushing through body parts", "Not releasing fully"],
  },
  "Barbell Push Press": {
    muscles: { primary: ["Front delts", "Triceps"], secondary: ["Quads", "Core"] },
    steps: [
      "Bar on front delts. Dip by bending knees, then drive up explosively.",
      "Use leg drive to push the bar overhead. Lock out.",
    ],
    cues: ["Same as Push Press — barbell version", "Short, sharp dip", "Leg drive initiates, arms finish"],
    mistakes: ["Dipping too deep", "Pressing before the drive finishes", "Not locking out"],
  },
  "Lateral Flexion": {
    muscles: { primary: ["Obliques"], secondary: ["Core"] },
    steps: [
      "Stand with a KB or DB in one hand.",
      "Lean to the weighted side, then use your obliques to pull back upright.",
    ],
    cues: ["Controlled lean — don't just flop to the side", "Squeeze the opposite oblique to return", "Great for oblique strength"],
    mistakes: ["Leaning forward or back instead of directly to the side", "Going too fast", "Using too much weight"],
  },
  "Side Bend + Reach": {
    muscles: { primary: ["Obliques", "Lats"], secondary: ["Core"] },
    steps: [
      "Stand tall, one arm overhead.",
      "Lean to the opposite side, reaching overhead.",
      "Return to upright.",
    ],
    cues: ["Combines lateral flexion with an overhead reach for a deeper stretch", "Hold at the end range", "Breathe into the stretch"],
    mistakes: ["Rotating instead of bending laterally", "Not reaching far enough", "Rushing"],
  },

};

// ─── Session map ──────────────────────────────────────────────────────────────

export const ALL_SESSIONS = {
  hypertrophy: HYPERTROPHY_SESSIONS,
  strength:    STRENGTH_SESSIONS,
  power:       POWER_SESSIONS,
  endurance:   ENDURANCE_SESSIONS,
  stability:   STABILITY_SESSIONS,
  flexibility: FLEXIBILITY_SESSIONS,
};

// ─── Age overrides (per regime where relevant) ────────────────────────────────

export const AGE_OVERRIDES = {
  hypertrophy: {
    "Barbell Bench Press":     { "Under 18": { name:"Dumbbell Bench Press", note:"DBs safer for developing joints", reps:"10–12", sets:"3" }, "50+": { name:"Machine Chest Press", note:"Machine removes shoulder instability risk", reps:"12–15", sets:"3" } },
    "Barbell Bent-Over Row":   { "Under 18": { name:"Chest-Supported DB Row", note:"Removes lower back stress" }, "36–49": { name:"Chest-Supported DB Row", note:"Eliminates lower back fatigue" }, "50+": { name:"Seated Cable Row", note:"Supported — no spinal compression", reps:"12–15" } },
    "Overhead Press":          { "Under 18": { name:"Seated DB Shoulder Press", note:"Seated version for safety" }, "50+": { name:"Landmine Press", note:"Angled press — easier on rotator cuff", reps:"12–15" } },
    "Weighted Pull-Up":        { "Under 18": { name:"Lat Pulldown", note:"Build the pattern before adding load", reps:"10–12" }, "36–49": { name:"Lat Pulldown", note:"Less shoulder stress than weighted pull-ups" }, "50+": { name:"Assisted Pull-Up / Lat Pulldown", note:"3s negative each rep", reps:"10–15" } },
    "Barbell Back Squat":      { "Under 18": { name:"Goblet Squat", note:"Teaches squat mechanics safely", reps:"12–15", sets:"3" }, "36–49": { note:"Add 2 warm-up sets. Belt optional for working sets", reps:"8–10" }, "50+": { name:"Leg Press", note:"Full quad work, zero spinal compression", reps:"15–20" } },
    "Romanian Deadlift":       { "Under 18": { name:"Dumbbell RDL", note:"DBs allow more natural hip hinge" }, "50+": { name:"Cable Pull-Through", note:"Hip hinge with cable — no spinal loading", reps:"15–20" } },
    "Walking Lunges":          { "36–49": { name:"Reverse Lunge", note:"Less knee stress than forward lunge" }, "50+": { name:"Step-Up (slow eccentric)", note:"Controlled — 3s down", reps:"12–15" } },
    "Conventional Deadlift":   { "Under 18": { name:"Trap Bar Deadlift", note:"Neutral spine — safer to learn", reps:"8–10", sets:"3" }, "36–49": { name:"Trap Bar Deadlift", note:"Less lower back stress", reps:"6–8" }, "50+": { name:"Hip Thrust", note:"Full glute stimulus, zero spinal compression", reps:"15–20" } },
    "Bulgarian Split Squat":   { "Under 18": { name:"Reverse Lunge", note:"Build single-leg strength gradually" }, "50+": { name:"Single-Leg Leg Press", note:"Same stimulus, machine guides the path", reps:"12–15" } },
  },
  strength: {
    "Barbell Bench Press":     { "Under 18": { name:"Dumbbell Bench Press", note:"Safer for young joints — still heavy", reps:"6–8" }, "50+": { name:"Machine Chest Press", note:"Heavy machine work — joint-safe", reps:"8–10" } },
    "Deadlift":                { "Under 18": { name:"Trap Bar Deadlift", note:"Neutral spine — build the pattern first" }, "50+": { name:"Trap Bar Deadlift", note:"Safer for spine at heavy loads" } },
    "Barbell Back Squat":      { "Under 18": { name:"Safety Bar Squat", note:"Upright torso — less spinal stress" }, "50+": { name:"Leg Press (heavy)", note:"Heavy load, no spinal compression", reps:"5–8" } },
    "Good Morning":            { "50+": { name:"45° Back Extension", note:"Less spinal compression", reps:"10–12" } },
    "Sumo Deadlift":           { "50+": { name:"Trap Bar Deadlift", note:"Neutral spine, same stimulus", reps:"5–6" } },
    "Overhead Press":          { "50+": { name:"Landmine Press", note:"Angled — much kinder on rotator cuff" } },
  },
  power: {
    "Power Clean (from hang)": { "Under 18": { name:"DB Hang Power Clean", note:"Learn the pattern with DBs first" }, "50+": { name:"Kettlebell Swing", note:"Hip hinge power — no technical overhead receiving" } },
    "Box Jump":                { "50+": { name:"Step-Up (fast pace)", note:"Step up briskly — no jumping impact on joints" } },
    "Jump Squat":              { "50+": { name:"Mini Band Squat", note:"Resistance band — explosive intent, controlled landing" } },
    "Depth Jump":              { "50+": { name:"Box Step-Down", note:"Step off box, land controlled — no rebound" } },
    "Plyo Push-Up":            { "50+": { name:"Push-Up to Shoulder Tap", note:"Removes landing impact — same intent" } },
  },
  endurance: {
    "Battle Ropes":            { "50+": { name:"Seated Battle Ropes / Arm Ergometer", note:"Same cardio stimulus without spinal load" } },
    "Romanian Deadlift":       { "50+": { name:"Cable Pull-Through", note:"Light load, hip hinge pattern — joint safe" } },
  },
  stability: {
    "Single-Leg Squat (pistol assist)": { "50+": { name:"Supported Single-Leg Squat", note:"Use TRX or rail for support throughout" } },
    "Copenhagen Plank":        { "Under 18": { name:"Side Plank", note:"Build baseline first" } },
  },
  flexibility: {}, // No age overrides needed — all flexibility work is body weight and self-regulating
};

// ─── Mobility warm-ups ────────────────────────────────────────────────────────

export const MOBILITY_WARMUPS = {
  "50+": {
    "upper-a":      ["Band shoulder dislocates × 10", "Wall slides × 10", "Thoracic rotations × 8/side", "Light band pull-apart × 15"],
    "lower-a":      ["Hip circles × 10/side", "Leg swings × 10/side", "Ankle circles × 10", "Bodyweight squat to stand × 10"],
    "upper-b":      ["Arm circles × 15 each direction", "Cat-cow × 10", "Band pull-apart × 15", "Doorway pec stretch × 30s"],
    "lower-b":      ["Glute bridge × 15 (no weight)", "Hip flexor stretch × 30s/side", "Hamstring walkouts × 8", "Lateral band walks × 10/side"],
    push:           ["Band shoulder dislocates × 10", "Wall slides × 10", "Thoracic rotation × 8/side", "Light push-up × 15"],
    pull:           ["Hip hinge practice × 10", "Band pull-apart × 15", "Cat-cow × 10", "Arm circles × 10"],
    "legs-a":       ["Hip circles × 10/side", "Leg swings × 10/side", "Ankle circles × 10", "BW squat × 15"],
    "legs-b":       ["Glute bridge × 15", "Hip flexor stretch × 30s/side", "Hamstring walkout × 8", "Lateral band walk × 10/side"],
  },
  "36–49": {
    "upper-a":      ["Band pull-apart × 15", "Shoulder circles × 10", "Light cable row × 15 (warm-up weight)"],
    "lower-a":      ["Hip circles × 10/side", "Leg swings × 10/side", "BW squat × 15"],
    "upper-b":      ["Arm circles × 10", "Band pull-apart × 12", "Light DB press × 12"],
    "lower-b":      ["Glute bridge × 15", "Hip flexor stretch × 20s/side", "Leg swing × 10/side"],
    push:           ["Band pull-apart × 12", "Shoulder circle × 10", "Light push-up × 10"],
    pull:           ["Hip hinge practice × 10", "Band pull-apart × 12", "Cat-cow × 8"],
    "legs-a":       ["Hip circle × 10/side", "Leg swing × 10/side", "BW squat × 12"],
    "legs-b":       ["Glute bridge × 12", "Hip flexor stretch × 20s/side", "Hamstring walkout × 6"],
  },
};

// ─── Apply age overrides to a session ────────────────────────────────────────

export function getSessionWithAge(regimeId, sessionId, ageClass) {
  const sessions = ALL_SESSIONS[regimeId];
  const session = sessions?.[sessionId];
  if (!session) return null;
  const overrides = AGE_OVERRIDES[regimeId] || {};
  return {
    ...session,
    exercises: session.exercises.map(ex => {
      const ov = overrides[ex.name]?.[ageClass];
      return ov ? { ...ex, ...ov } : ex;
    }),
  };
}

// ─── Sex profiles ─────────────────────────────────────────────────────────────

export const SEX_PROFILES = {
  male: {
    label: "Male",
    note: "Standard weight ranges apply.",
    repsNote: "Standard rep ranges.",
  },
  female: {
    label: "Female",
    note: "Weight ranges adjusted to female averages (approx. 55–65% of male). Reps slightly higher to reflect faster recovery and better volume tolerance.",
    repsNote: "+1–2 reps per set recommended.",
  },
};

// Adjust a weight string for female users.
// Parses strings like "60–80kg", "14–18kg ea", "BW–10kg DBs", "Bodyweight" etc.
// and scales numeric values by the given multiplier.
export function adjustWeightForSex(weightStr, sex) {
  if (!weightStr || sex !== "female") return weightStr;

  // Multiplier: females average ~60% of male strength on upper body,
  // ~70% on lower body. We use a blended 0.62 as a safe conservative default.
  // Users are always encouraged to adjust up/down based on feel.
  const MULT = 0.62;

  // Don't touch bodyweight-only strings
  if (/^bodyweight$/i.test(weightStr.trim())) return weightStr;

  // Extract prefix (BW, Bodyweight) and suffix (ea, DBs, kg ball, etc.)
  const prefix = weightStr.match(/^(BW[–-]|Bodyweight[–-])/i)?.[0] || "";
  const suffix = weightStr.match(/(kg ea|ea|DBs|kg ball|kg box|Max effort|Moderate|Light band|Med band|Foam roller|box|cm box|\+\d[\d–]+kg)$/i)?.[0] || "";

  // Find all numbers and scale them
  const scaled = weightStr.replace(/\d+(\.\d+)?/g, (n) => {
    const num = parseFloat(n);
    // Don't scale very small numbers that are likely counts (e.g. "3–4" for box cm heights or ball sizes under 10)
    if (num < 10) return n;
    return Math.round(num * MULT).toString();
  });

  return scaled;
}