import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_KEY = "gym_write_queue";

// ─── Storage helpers ──────────────────────────────────────────────────────────

async function loadQueue() {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveQueue(queue) {
  try {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {}
}

// Monotonically increasing sequence for stable ordering within the same ms
let _seq = 0;
function nextId() {
  return `wq_${Date.now()}_${++_seq}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Add an item to the end of the queue. Returns the assigned queue entry id. */
export async function enqueueItem(item) {
  const queue = await loadQueue();
  const entry = { ...item, id: nextId(), createdAt: new Date().toISOString() };
  queue.push(entry);
  await saveQueue(queue);
  return entry.id;
}

/** Remove a single entry by its queue id (after successful flush). */
export async function removeItem(id) {
  const queue = await loadQueue();
  await saveQueue(queue.filter((e) => e.id !== id));
}

/**
 * Remove any insert_log entry whose clientId matches.
 * Used to cancel a queued insert when the user unchecks the set before sync.
 */
export async function removeByClientId(clientId) {
  const queue = await loadQueue();
  await saveQueue(queue.filter((e) => e.clientId !== clientId));
}

/** Read all queued items in insertion order. */
export async function getAllItems() {
  return loadQueue();
}

/** How many items are currently queued. */
export async function getItemCount() {
  const q = await loadQueue();
  return q.length;
}
