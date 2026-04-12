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
};

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