// In-memory sliding-window rate limiter
// Shared across chat, v1 API, and other rate-limited endpoints

const buckets = new Map<string, number[]>();

/**
 * Check if a request is within rate limits.
 * Returns true if allowed, false if rate limit exceeded.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const timestamps = buckets.get(key) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= limit) return false;

  recent.push(now);
  buckets.set(key, recent);
  return true;
}

// Periodic cleanup to prevent memory leaks (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    buckets.forEach((timestamps, key) => {
      const recent = timestamps.filter((t) => now - t < 300_000);
      if (recent.length === 0) {
        buckets.delete(key);
      } else {
        buckets.set(key, recent);
      }
    });
  }, 300_000);
}
