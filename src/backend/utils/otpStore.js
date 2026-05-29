/**
 * otpStore.js
 * -----------
 * Lightweight in-memory OTP store that replaces Redis.
 * Each entry auto-expires after `ttlSeconds` using a setTimeout.
 *
 * API mirrors the Redis commands previously used:
 *   otpStore.set(key, value, ttlSeconds)
 *   otpStore.get(key)         → value | null
 *   otpStore.del(key)
 */

const store = new Map(); // key → { value, timer }

/**
 * Store a value under `key` that expires after `ttlSeconds`.
 * Calling set() on an existing key resets its timer.
 */
const set = (key, value, ttlSeconds) => {
  // Clear any existing timer to avoid duplicates
  if (store.has(key)) {
    clearTimeout(store.get(key).timer);
  }

  const timer = setTimeout(() => {
    store.delete(key);
  }, ttlSeconds * 1000);

  // Allow the process to exit even if this timer is pending
  if (timer.unref) timer.unref();

  store.set(key, { value, timer });
};

/** Retrieve a stored value, or null if it has expired / doesn't exist. */
const get = (key) => {
  const entry = store.get(key);
  return entry ? entry.value : null;
};

/** Delete a key manually (e.g. after successful OTP verification). */
const del = (key) => {
  const entry = store.get(key);
  if (entry) {
    clearTimeout(entry.timer);
    store.delete(key);
  }
};

module.exports = { set, get, del };
