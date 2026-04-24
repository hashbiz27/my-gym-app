import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

async function currentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export function useGymData() {
  const [regimes, setRegimes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch all regimes for the logged-in user ──────────────────────────────
  const fetchRegimes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("regimes")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      setRegimes(data);
      return data;
    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch sessions, optionally filtered by regime ─────────────────────────
  const fetchSessions = useCallback(async (regimeId = null) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("sessions")
        .select("*")
        .order("date", { ascending: false });
      if (regimeId) query = query.eq("regime_id", regimeId);
      const { data, error } = await query;
      if (error) throw error;
      setSessions(data);
      return data;
    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Save a completed session and its per-set logs ─────────────────────────
  // logs: [{ exerciseName, setNumber, reps, weight }]
  // Only pass completed sets — omit sets the user left blank.
  const saveSession = useCallback(async ({ regimeId, date, notes, logs = [] }) => {
    setLoading(true);
    setError(null);
    try {
      const userId = await currentUserId();

      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          user_id: userId,
          regime_id: regimeId ?? null,
          date,
          notes: notes ?? null,
        })
        .select()
        .single();
      if (sessionError) throw sessionError;

      if (logs.length > 0) {
        const rows = logs.map(({ exerciseName, setNumber, reps, weight }) => ({
          session_id: session.id,
          exercise_name: exerciseName,
          set_number: setNumber,
          reps: reps !== "" && reps != null ? parseInt(reps, 10) : null,
          weight: weight !== "" && weight != null ? parseFloat(weight) : null,
        }));
        const { error: logsError } = await supabase
          .from("session_logs")
          .insert(rows);
        if (logsError) throw logsError;
      }

      return session;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch past sessions with their logs joined ────────────────────────────
  const fetchSessionHistory = useCallback(async (limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*, session_logs(*)")
        .order("date", { ascending: false })
        .limit(limit);
      if (error) throw error;
      setSessionHistory(data);
      return data;
    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Update reps/weight on a single log entry ──────────────────────────────
  const updateSessionLog = useCallback(async (logId, { reps, weight }) => {
    setError(null);
    try {
      const updates = {};
      if (reps !== undefined)
        updates.reps = reps !== "" && reps != null ? parseInt(reps, 10) : null;
      if (weight !== undefined)
        updates.weight =
          weight !== "" && weight != null ? parseFloat(weight) : null;

      const { data, error } = await supabase
        .from("session_logs")
        .update(updates)
        .eq("id", logId)
        .select()
        .single();
      if (error) throw error;

      // Mirror update into local sessionHistory state
      setSessionHistory((prev) =>
        prev.map((s) => ({
          ...s,
          session_logs: s.session_logs?.map((log) =>
            log.id === logId ? { ...log, ...updates } : log
          ),
        }))
      );
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  return {
    // State
    regimes,
    sessions,
    sessionHistory,
    loading,
    error,
    // Actions
    fetchRegimes,
    fetchSessions,
    saveSession,
    fetchSessionHistory,
    updateSessionLog,
  };
}
