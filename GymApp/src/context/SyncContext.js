import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import NetInfo from "@react-native-community/netinfo";
import { supabase } from "../lib/supabase";
import {
  enqueueItem,
  getAllItems,
  getItemCount,
  removeByClientId,
  removeItem,
} from "../lib/writeQueue";

const SyncContext = createContext(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isConnected(state) {
  // isInternetReachable can be null on some devices — treat null as reachable
  return !!(state.isConnected && state.isInternetReachable !== false);
}

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

function parseReps(v) {
  return v != null && v !== "" ? parseInt(v, 10) : null;
}
function parseWeight(v) {
  return v != null && v !== "" ? parseFloat(v) : null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SyncProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  // Maps offline clientIds ("pending_xxx") → real Supabase logIds after flush
  const [resolvedIds, setResolvedIds] = useState({});

  const isOnlineRef = useRef(true);
  const isSyncingRef = useRef(false);

  const refreshCount = useCallback(async () => {
    const count = await getItemCount();
    setPendingCount(count);
  }, []);

  // ── Flush: drain the queue while online ──────────────────────────────────
  const flush = useCallback(async () => {
    if (isSyncingRef.current) return;

    const items = await getAllItems();
    if (!items.length) return;

    isSyncingRef.current = true;
    setIsSyncing(true);

    const newResolved = {};

    for (const item of items) {
      try {
        if (item.type === "insert_log") {
          const { data, error } = await supabase
            .from("session_logs")
            .insert({
              session_id: item.sessionId,
              exercise_name: item.exerciseName,
              set_number: item.setNumber,
              reps: parseReps(item.reps),
              weight: parseWeight(item.weight),
            })
            .select("id")
            .single();
          if (error) throw error;
          await removeItem(item.id);
          // Record the clientId → real logId mapping so the UI can resolve it
          newResolved[item.clientId] = data.id;

        } else if (item.type === "delete_log") {
          const { error } = await supabase
            .from("session_logs")
            .delete()
            .eq("id", item.logId);
          if (error) throw error;
          await removeItem(item.id);

        } else if (item.type === "update_log") {
          const updates = {};
          if (item.reps !== undefined) updates.reps = parseReps(item.reps);
          if (item.weight !== undefined) updates.weight = parseWeight(item.weight);
          const { error } = await supabase
            .from("session_logs")
            .update(updates)
            .eq("id", item.logId);
          if (error) throw error;
          await removeItem(item.id);

        } else if (item.type === "finish_session") {
          const { error } = await supabase
            .from("sessions")
            .update({ finished_at: item.finishedAt })
            .eq("id", item.sessionId);
          if (error) throw error;
          await removeItem(item.id);
        }

      } catch (e) {
        if (isNetworkError(e)) {
          // Stop processing — will retry on next reconnect
          break;
        }
        // Non-network error (e.g. row not found): discard to unblock queue
        await removeItem(item.id);
      }
    }

    if (Object.keys(newResolved).length > 0) {
      setResolvedIds((prev) => ({ ...prev, ...newResolved }));
    }

    await refreshCount();
    isSyncingRef.current = false;
    setIsSyncing(false);
  }, [refreshCount]);

  // ── NetInfo subscription ──────────────────────────────────────────────────
  useEffect(() => {
    refreshCount();

    NetInfo.fetch().then((state) => {
      const online = isConnected(state);
      isOnlineRef.current = online;
      setIsOnline(online);
      if (online) flush();
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = isConnected(state);
      const wasOffline = !isOnlineRef.current;
      isOnlineRef.current = online;
      setIsOnline(online);
      if (online && wasOffline) flush();
    });

    return () => unsubscribe();
  }, [flush, refreshCount]);

  // ── Enqueue helpers used by useGymData ────────────────────────────────────

  const enqueueInsertLog = useCallback(
    async (sessionId, { exerciseName, setNumber, reps, weight }) => {
      const clientId = `pending_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      await enqueueItem({
        type: "insert_log",
        sessionId,
        exerciseName,
        setNumber,
        reps,
        weight,
        clientId,
      });
      await refreshCount();
      return clientId;
    },
    [refreshCount]
  );

  const enqueueDeleteLog = useCallback(
    async (logId) => {
      if (logId?.startsWith("pending_")) {
        // The insert never reached Supabase — cancel it from the queue
        await removeByClientId(logId);
      } else {
        await enqueueItem({ type: "delete_log", logId });
      }
      await refreshCount();
    },
    [refreshCount]
  );

  const enqueueUpdateLog = useCallback(
    async (logId, fields) => {
      if (logId?.startsWith("pending_")) {
        // Insert hasn't flushed yet; the original values from checkbox time
        // will be used. A future improvement could patch the queue entry.
        return;
      }
      await enqueueItem({ type: "update_log", logId, ...fields });
      await refreshCount();
    },
    [refreshCount]
  );

  const enqueueFinishSession = useCallback(
    async (sessionId, finishedAt) => {
      await enqueueItem({ type: "finish_session", sessionId, finishedAt });
      await refreshCount();
    },
    [refreshCount]
  );

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        isOnlineRef,
        isSyncing,
        pendingCount,
        resolvedIds,
        enqueueInsertLog,
        enqueueDeleteLog,
        enqueueUpdateLog,
        enqueueFinishSession,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncContext() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error("useSyncContext must be used within SyncProvider");
  return ctx;
}
