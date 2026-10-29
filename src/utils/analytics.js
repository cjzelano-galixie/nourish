export const NUTRIENTS = [
  "calories",
  "protein",
  "carbs",
  "fat",
  "fiber",
  "sodium",
  "potassium",
];
export const MIN_DAYS = 3;

const key = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Map of local date -> summed nutrients for approved logs. */
export function dailyTotals(logs) {
  const days = new Map();
  for (const log of logs) {
    if (log.status !== "approved") continue;
    const k = key(new Date(log.logged_at));
    const day = days.get(k) ?? {
      burned: 0,
      ...Object.fromEntries(NUTRIENTS.map((n) => [n, 0])),
    };
    for (const n of NUTRIENTS) day[n] += Number(log[n]) || 0;
    day.burned += Number(log.calories_burned) || 0;
    days.set(k, day);
  }
  return days;
}

/** Stats for the `length` days ending `offset` days before today. */
export function windowStats(daily, length, offset = 0) {
  const list = [];
  for (let i = offset; i < offset + length; i++) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const k = key(d);
    list.push({ date: d, key: k, data: daily.get(k) ?? null });
  }
  list.reverse();
  const logged = list.filter((x) => x.data);
  const avg = {};
  for (const n of [...NUTRIENTS, "burned"]) {
    avg[n] = logged.length
      ? logged.reduce((s, x) => s + x.data[n], 0) / logged.length
      : null;
  }
  return { list, loggedDays: logged.length, length, avg };
}

const pct = (v, t) => (t ? v / t : null);

/** Up to two encouraging, judgment-free insights, biggest gaps first. */
export function recommendations(avg, profile) {
  const tips = [];
  const p = (n, t) => pct(avg[n], Number(profile[t]));

  if (p("calories", "target_calories") < 0.7)
    tips.push({
      score: 3,
      text: "Your intake has been on the lighter side lately. Make sure you're eating enough to feel energized. If you're unsure, a doctor or dietitian can help.",
    });
  else if (p("calories", "target_calories") > 1.15)
    tips.push({
      score: 1,
      text: "You've been a little above your calorie target on average. That's okay. Small steps add up.",
    });

  const protein = p("protein", "target_protein");
  if (protein < 0.8)
    tips.push({
      score: 1 - protein,
      text: "Protein has been a little under target. Greek yogurt, eggs, or beans at breakfast can help.",
    });

  const sodium = p("sodium", "target_sodium");
  if (sodium > 1.1)
    tips.push({
      score: sodium - 1,
      text: "Sodium has been running a bit high. Fresh versions of packaged foods can bring it down.",
    });

  const fiber = p("fiber", "target_fiber");
  if (fiber < 0.7)
    tips.push({
      score: 1 - fiber,
      text: "Fiber is a bit low. Oats, berries, beans, and veggies are easy wins.",
    });

  const potassium = p("potassium", "target_potassium");
  if (potassium < 0.7)
    tips.push({
      score: 1 - potassium,
      text: "Potassium has been low. Bananas, potatoes, and leafy greens can help.",
    });

  return tips
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((t) => t.text);
}
