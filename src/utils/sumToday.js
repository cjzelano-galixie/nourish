export function sumToday(logs) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
    potassium: 0,
  };
  for (const log of logs) {
    if (log.status !== "approved") continue;
    if (new Date(log.logged_at) < start) continue;
    for (const key in totals) totals[key] += Number(log[key]) || 0;
  }
  return totals;
}
