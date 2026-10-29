const LIMITS = { age: [14, 90], weight: [25, 300], height: [100, 250] };

export default function profileRanges(req, res, next) {
  const { sex, activityLevel, targetCalories } = req.body;

  for (const [field, [min, max]] of Object.entries(LIMITS)) {
    if (req.body[field] === undefined) continue;
    const n = Number(req.body[field]);
    if (!Number.isFinite(n) || n < min || n > max) {
      return res
        .status(400)
        .send(`Please enter a valid ${field} (${min}-${max})`);
    }
  }

  if (
    sex !== undefined &&
    !["male", "female"].includes(String(sex).toLowerCase())
  ) {
    return res.status(400).send("Please choose a valid option for sex.");
  }

  if (
    activityLevel !== undefined &&
    ![1, 2, 3, 4, 5].includes(Number(activityLevel))
  ) {
    return res.status(400).send("Please choose a valid activity level.");
  }

  if (
    targetCalories !== undefined &&
    targetCalories !== null &&
    targetCalories !== ""
  ) {
    const n = Number(targetCalories);
    if (!Number.isFinite(n) || n < 1200 || n > 5000) {
      return res
        .status(400)
        .send("Target calories must be between 1,200 & 5,000");
    }
  }
  next();
}
