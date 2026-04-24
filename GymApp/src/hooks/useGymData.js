import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useSyncContext } from "../context/SyncContext";

function isNetworkError(e) {
  const msg = String(e?.message ?? "").toLowerCase();
  return (
    msg.includes("network request failed") ||
    msg.includes("failed to fetch") ||
    msg.includes("network error") ||
    msg.includes("econnrefused") ||
    msg.includes("etimedout")
  );
}

async function currentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export function useGymData() {
  const {
    isOnlineRef,
    resolvedIds,
    enqueueInsertLog,
    enqueueDeleteLog,
    enqueueUpdateLog,
    enqueueFinishSession,
  } = useSyncContext();

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
    // Resolve a pending clientId to its real server logId if flush already ran
    const realLogId = resolvedIds[logId] ?? logId;

    if (!isOnlineRef.current) {
      await enqueueUpdateLog(realLogId, { reps, weight });
      return null;
    }
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
        .eq("id", realLogId)
        .select()
        .single();
      if (error) throw error;

      // Mirror update into local sessionHistory state
      setSessionHistory((prev) =>
        prev.map((s) => ({
          ...s,
          session_logs: s.session_logs?.map((log) =>
            log.id === realLogId ? { ...log, ...updates } : log
          ),
        }))
      );
      return data;
    } catch (e) {
      if (isNetworkError(e)) {
        await enqueueUpdateLog(realLogId, { reps, weight });
        return null;
      }
      setError(e.message);
      return null;
    }
  }, [resolvedIds, isOnlineRef, enqueueUpdateLog]);

  // ── Upsert a regime row by name, return its UUID ─────────────────────────
  // Used when starting a workout to ensure a matching row exists.
  const ensureRegime = useCallback(async (name) => {
    try {
      const userId = await currentUserId();
      const { data: existing } = await supabase
        .from("regimes")
        .select("id")
        .eq("user_id", userId)
        .eq("name", name)
        .maybeSingle();
      if (existing) return existing.id;
      const { data: created, error } = await supabase
        .from("regimes")
        .insert({ user_id: userId, name })
        .select("id")
        .single();
      if (error) throw error;
      return created.id;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  // ── Create a session row without logs (for real-time logging) ─────────────
  const createSession = useCallback(async ({ regimeId, date, notes, startedAt }) => {
    try {
      const userId = await currentUserId();
      const { data, error } = await supabase
        .from("sessions")
        .insert({
          user_id: userId,
          regime_id: regimeId ?? null,
          date,
          notes: notes ?? null,
          started_at: startedAt ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  // ── Mark a session finished ───────────────────────────────────────────────
  const finishSession = useCallback(async (sessionId) => {
    const finishedAt = new Date().toISOString();
    if (!isOnlineRef.current) {
      await enqueueFinishSession(sessionId, finishedAt);
      return true;
    }
    try {
      const { error } = await supabase
        .from("sessions")
        .update({ finished_at: finishedAt })
        .eq("id", sessionId);
      if (error) throw error;
      return true;
    } catch (e) {
      if (isNetworkError(e)) {
        await enqueueFinishSession(sessionId, finishedAt);
        return true;
      }
      setError(e.message);
      return false;
    }
  }, [isOnlineRef, enqueueFinishSession]);

  // ── Fetch a single session row by ID ─────────────────────────────────────
  const fetchSessionById = useCallback(async (sessionId) => {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  // ── Fetch all log entries for a session (used to restore in-progress state)
  const fetchLogsForSession = useCallback(async (sessionId) => {
    try {
      const { data, error } = await supabase
        .from("session_logs")
        .select("*")
        .eq("session_id", sessionId);
      if (error) throw error;
      return data ?? [];
    } catch (e) {
      setError(e.message);
      return [];
    }
  }, []);

  // ── Insert a single set log entry, return the new row id ─────────────────
  // Returns a real Supabase UUID when online, or a "pending_xxx" clientId
  // when offline (queued for later sync).
  const insertSessionLog = useCallback(
    async (sessionId, { exerciseName, setNumber, reps, weight }) => {
      if (!isOnlineRef.current) {
        return enqueueInsertLog(sessionId, { exerciseName, setNumber, reps, weight });
      }
      try {
        const { data, error } = await supabase
          .from("session_logs")
          .insert({
            session_id: sessionId,
            exercise_name: exerciseName,
            set_number: setNumber,
            reps: reps !== "" && reps != null ? parseInt(reps, 10) : null,
            weight: weight !== "" && weight != null ? parseFloat(weight) : null,
          })
          .select("id")
          .single();
        if (error) throw error;
        return data.id;
      } catch (e) {
        if (isNetworkError(e)) {
          return enqueueInsertLog(sessionId, { exerciseName, setNumber, reps, weight });
        }
        setError(e.message);
        return null;
      }
    },
    [isOnlineRef, enqueueInsertLog]
  );

  // ── Delete a single log entry (when a done set is un-checked) ────────────
  const deleteSessionLog = useCallback(async (logId) => {
    // Resolve a pending clientId to its real server logId if already flushed
    const realLogId = resolvedIds[logId] ?? logId;

    if (!isOnlineRef.current) {
      await enqueueDeleteLog(realLogId);
      return true;
    }
    // If still pending (not yet flushed), cancel the queued insert instead
    if (realLogId.startsWith("pending_")) {
      await enqueueDeleteLog(realLogId);
      return true;
    }
    try {
      const { error } = await supabase
        .from("session_logs")
        .delete()
        .eq("id", realLogId);
      if (error) throw error;
      return true;
    } catch (e) {
      if (isNetworkError(e)) {
        await enqueueDeleteLog(realLogId);
        return true;
      }
      setError(e.message);
      return false;
    }
  }, [resolvedIds, isOnlineRef, enqueueDeleteLog]);

  // ── Fetch the logged-in user's profile row ───────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await currentUserId();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Upsert profile preference fields ─────────────────────────────────────
  const saveProfile = useCallback(async (fields) => {
    setError(null);
    try {
      const userId = await currentUserId();
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ user_id: userId, ...fields }, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  // ── Patch session notes after a workout finishes ──────────────────────────
  const updateSessionNotes = useCallback(async (sessionId, notes) => {
    try {
      const { error } = await supabase
        .from("sessions")
        .update({ notes })
        .eq("id", sessionId);
      if (error) throw error;
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  return {
    // State
    regimes,
    sessions,
    sessionHistory,
    loading,
    error,
    // Bulk actions
    fetchRegimes,
    fetchSessions,
    saveSession,
    fetchSessionHistory,
    updateSessionLog,
    // Profile
    fetchProfile,
    saveProfile,
    // Real-time workout actions
    ensureRegime,
    createSession,
    finishSession,
    fetchSessionById,
    fetchLogsForSession,
    insertSessionLog,
    deleteSessionLog,
    updateSessionNotes,
  };
}
