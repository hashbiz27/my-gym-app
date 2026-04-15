// ─── compatibility.js ─────────────────────────────────────────────────────────
// Scores a candidate exercise against the original exercise it replaces, and
// against the full session context to flag over/under-training of muscle groups.
//
// Returns a score 0–100 where:
//   100 = perfect drop-in replacement, no session balance issues
//    0  = completely different muscles + creates serious imbalance
// ─────────────────────────────────────────────────────────────────────────────

import { EXERCISE_GUIDES, ALL_SESSIONS, AGE_OVERRIDES } from "./gymData";

// ─── Muscle group normalisation ───────────────────────────────────────────────
// Maps every muscle name variant in the database to a canonical group name.
// This lets "Front delts", "Lateral delts", "Rear delts" all roll up to "Delts"
// for balance checking, while still preserving specificity for direct matching.

const MUSCLE_GROUPS = {
  // Chest
  "Chest":          "Chest",
  "Upper chest":    "Chest",
  "Lower chest":    "Chest",
  "Pec":            "Chest",

  // Delts
  "Front delts":    "Delts",
  "Lateral delts":  "Delts",
  "Rear delts":     "Delts",
  "Delts":          "Delts",

  // Back
  "Lats":           "Back",
  "Rhomboids":      "Back",
  "Traps":          "Back",
  "Teres major":    "Back",
  "Mid-back":       "Back",
  "Upper back":     "Back",

  // Arms
  "Biceps":         "Arms",
  "Triceps":        "Arms",
  "Forearms":       "Arms",
  "Brachialis":     "Arms",

  // Legs
  "Quads":          "Legs",
  "Hamstrings":     "Legs",
  "Glutes":         "Legs",
  "Calves":         "Legs",
  "Adductors":      "Legs",
  "Hip flexors":    "Legs",

  // Core
  "Core":           "Core",
  "Obliques":       "Core",
  "Abs":            "Core",
  "Erectors":       "Core",

  // Shoulder health / rotator cuff
  "Rotator cuff":   "Shoulder health",
  "Scapular":       "Shoulder health",

  // Posterior chain (used for power/stability exercises)
  "Posterior chain":"Posterior chain",

  // Other
  "Glute":          "Legs",
  "Hip adductors":  "Legs",
  "Hip abductors":  "Legs",
  "Spine":          "Core",
  "T-spine":        "Core",
  "Neck":           "Other",
  "Ankle":          "Other",
};

function toGroup(muscleName) {
  if (!muscleName) return "Other";
  const lower = muscleName.trim();
  // Direct match
  if (MUSCLE_GROUPS[lower]) return MUSCLE_GROUPS[lower];
  // Partial match
  for (const [key, group] of Object.entries(MUSCLE_GROUPS)) {
    if (lower.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(lower.toLowerCase())) {
      return group;
    }
  }
  return lower; // Keep unknown muscles as-is rather than losing them
}

// ─── Get muscles for a named exercise ────────────────────────────────────────

export function getMuscles(exerciseName) {
  const guide = EXERCISE_GUIDES[exerciseName];
  if (!guide) return { primary: [], secondary: [], groups: [] };
  const primary = (guide.muscles?.primary || []);
  const secondary = (guide.muscles?.secondary || []);
  const groups = [...new Set([...primary, ...secondary].map(toGroup))];
  return { primary, secondary, groups };
}

// ─── Get all exercise names across the entire database ────────────────────────
// Includes base sessions + all age override variants

export function getAllExerciseNamesWithMuscles() {
  const map = {}; // name → { primary, secondary, groups }

  // Base sessions
  Object.values(ALL_SESSIONS).forEach(regimeSessions => {
    Object.values(regimeSessions).forEach(session => {
      session.exercises.forEach(ex => {
        if (!map[ex.name]) map[ex.name] = getMuscles(ex.name);
      });
    });
  });

  // Age override variants (veteran exercises etc.)
  Object.values(AGE_OVERRIDES).forEach(regimeOverrides => {
    Object.values(regimeOverrides).forEach(exerciseOverrides => {
      Object.values(exerciseOverrides).forEach(override => {
        if (override.name && !map[override.name]) {
          map[override.name] = getMuscles(override.name);
        }
      });
    });
  });

  // Also include everything in EXERCISE_GUIDES directly
  Object.keys(EXERCISE_GUIDES).forEach(name => {
    if (!map[name]) map[name] = getMuscles(name);
  });

  return map;
}

// ─── Score a single candidate against the original exercise ──────────────────
// Returns 0–100 based on muscle overlap.
// Primary muscle match = high score, secondary = partial credit.

function scoreDirectMatch(originalName, candidateName) {
  const orig = getMuscles(originalName);
  const cand = getMuscles(candidateName);

  if (!orig.primary.length && !cand.primary.length) return 50; // both unknown → neutral
  if (!orig.primary.length || !cand.primary.length) return 30;

  const origPrimaryGroups = new Set(orig.primary.map(toGroup));
  const origAllGroups     = new Set([...orig.primary, ...orig.secondary].map(toGroup));
  const candPrimaryGroups = new Set(cand.primary.map(toGroup));
  const candAllGroups     = new Set([...cand.primary, ...cand.secondary].map(toGroup));

  // Primary overlap: how many of the original's primary groups does the candidate hit?
  let primaryHits = 0;
  origPrimaryGroups.forEach(g => { if (candPrimaryGroups.has(g)) primaryHits++; });
  const primaryScore = origPrimaryGroups.size > 0
    ? (primaryHits / origPrimaryGroups.size) * 70
    : 0;

  // Secondary overlap: partial credit for hitting secondary muscles
  let secondaryHits = 0;
  origAllGroups.forEach(g => { if (candAllGroups.has(g)) secondaryHits++; });
  const totalUnique = new Set([...origAllGroups, ...candAllGroups]).size;
  const secondaryScore = totalUnique > 0
    ? (secondaryHits / totalUnique) * 30
    : 0;

  return Math.round(primaryScore + secondaryScore);
}

// ─── Score session balance impact ────────────────────────────────────────────
// Analyses the full session to check if replacing the original with the candidate
// would cause any muscle group to be over-trained (3+ primary exercises on same group)
// or under-trained (a group that was covered now disappears).
// Returns a penalty 0–40 (subtracted from final score).

function scoreSessionBalance(sessionExercises, originalName, candidateName, slotIndex) {
  // Build muscle group frequency for the session with the swap applied
  const withSwap = sessionExercises.map((ex, i) =>
    i === slotIndex ? candidateName : ex.name
  );
  const withOriginal = sessionExercises.map(ex => ex.name);

  function groupFrequency(names) {
    const freq = {};
    names.forEach(name => {
      const m = getMuscles(name);
      m.primary.map(toGroup).forEach(g => {
        freq[g] = (freq[g] || 0) + 1;
      });
    });
    return freq;
  }

  const origFreq = groupFrequency(withOriginal);
  const swapFreq = groupFrequency(withSwap);

  let penalty = 0;

  // Over-training penalty: if a group now has 3+ primary exercises (was < 3 before)
  Object.entries(swapFreq).forEach(([group, count]) => {
    const before = origFreq[group] || 0;
    if (count >= 3 && before < 3) penalty += 15;
    else if (count >= 4 && before < 4) penalty += 10;
  });

  // Under-training penalty: if a group that was covered now has 0 primary exercises
  Object.entries(origFreq).forEach(([group, count]) => {
    if (count > 0 && !swapFreq[group]) penalty += 15;
  });

  return Math.min(penalty, 40); // cap at 40
}

// ─── Main export: score all exercises for a given slot ───────────────────────
// Returns sorted array of { name, score, label, muscles } for displaying in the picker.
//
// sessionExercises: array of exercise objects from the current session
// originalName: the exercise being replaced
// slotIndex: which position in the session this is

export function scoreAllExercises(sessionExercises, originalName, slotIndex) {
  const allExercises = getAllExerciseNamesWithMuscles();

  return Object.entries(allExercises)
    .map(([name, muscles]) => {
      const directScore   = scoreDirectMatch(originalName, name);
      const balancePenalty = scoreSessionBalance(
        sessionExercises.map(ex => ex.name),
        originalName,
        name,
        slotIndex
      );
      const finalScore = Math.max(0, Math.min(100, directScore - balancePenalty));

      // Human-readable label
      const label =
        finalScore >= 85 ? "Excellent match" :
        finalScore >= 70 ? "Good match" :
        finalScore >= 50 ? "Partial match" :
        finalScore >= 30 ? "Different muscles" :
                           "No overlap";

      return { name, score: finalScore, label, muscles };
    })
    .filter(e => e.name !== originalName) // exclude the exercise itself
    .sort((a, b) => b.score - a.score);
}

// ─── Colour helper for score badges ──────────────────────────────────────────

export function scoreColor(score) {
  if (score >= 85) return { bg: "#e8f5e9", text: "#1b5e20" };
  if (score >= 70) return { bg: "#f0fdf4", text: "#166534" };
  if (score >= 50) return { bg: "#fff8e1", text: "#b45309" };
  if (score >= 30) return { bg: "#fff3e0", text: "#e65100" };
  return { bg: "#fce8e8", text: "#991b1b" };
}