/**
 * Одноразовый pull редполитики + сброс кэша Next (нужен запущенный dev/start).
 * Usage: node scripts/pull-red-policy.mjs [baseUrl]
 */
const base = process.argv[2] ?? "http://localhost:3000";

const res = await fetch(`${base}/api/revalidate/red-policy`, { method: "POST" });

if (!res.ok) {
  console.error(`Failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}

const data = await res.json();
console.log("Red policy refreshed:", data);
