import pool from "#db/client";

export async function createProfile(userId, profileData) {
  const {
    age,
    weight,
    height,
    sex,
    activityLevel,
    calculatedTdee,
    targetCalories,
    targetProtein,
    targetPotassium,
    targetSodium,
    targetFat,
    targetCarbs,
    targetFiber,
  } = profileData;
  const {
    rows: [profile],
  } = await pool.query(
    `
        INSERT INTO profiles
        (user_id,
  age,
  weight,
  height,
  sex,
  activity_level,
  calculated_tdee,
  target_calories,
  target_protein,
  target_potassium,
  target_sodium,
  target_fat,
  target_carbs,
  target_fiber) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *`,
    [
      userId,
      age,
      weight,
      height,
      sex,
      activityLevel,
      calculatedTdee,
      targetCalories,
      targetProtein,
      targetPotassium,
      targetSodium,
      targetFat,
      targetCarbs,
      targetFiber,
    ],
  );
  return profile;
}

export async function getProfileByUserId(userId) {
  const {
    rows: [profile],
  } = await pool.query(
    `SELECT * FROM profiles  
    WHERE user_id = $1`,
    [userId],
  );
  if (!profile) {
    const err = new Error(`Profile not found for user ID ${userId}`);
    err.status = 404;
    throw err;
  }
  return profile;
}

export async function updateProfile(userId, fields) {
  const UPDATEABLE = [
    "age",
    "weight",
    "height",
    "sex",
    "activity_level",
    "calculated_tdee",
    "target_calories",
    "target_protein",
    "target_potassium",
    "target_sodium",
    "target_fat",
    "target_carbs",
    "target_fiber",
  ];

  const cols = UPDATEABLE.filter((col) => Object.hasOwn(fields, col));
  if (cols.length === 0) return getProfileByUserId(userId);
  const values = cols.map((col) => fields[col]);
  const setClauses = cols.map((col, i) => `${col} = $${i + 1}`);
  values.push(userId);

  const {
    rows: [updated],
  } = await pool.query(
    `UPDATE profiles SET ${setClauses.join(", ")} 
    WHERE user_id = $${values.length} 
    RETURNING *`,
    values,
  );
  return updated || null;
}
