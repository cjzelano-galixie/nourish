import pool from "#db/db";

export async function createProfile(userId, profileData) {
  const {
    age,
    weight,
    height,
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
  activity_level,
  calculated_tdee,
  target_calories,
  target_protein,
  target_potassium,
  target_sodium,
  target_fat,
  target_carbs,
  target_fiber) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  RETURNING *`,
    [
      userId,
      age,
      weight,
      height,
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
  return profile;
}
