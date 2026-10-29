import pool from "#db/client";
import { handlePgError } from "#utils/pgErrors";

export async function createMealLogWithNutrients(
  userId,
  mealData,
  nutrientData,
) {
  return handlePgError(async () => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const mealQuery = `
        INSERT INTO meal_logs (user_id, meal_description, status, calories_burned)
        VALUES ($1, $2, $3, $4)
        RETURNING *;`;

      const mealValues = [
        userId,
        mealData.mealDescription,
        mealData.status || "approved",
        mealData.caloriesBurned ?? 0,
      ];
      const mealResult = await client.query(mealQuery, mealValues);
      const newMealLog = mealResult.rows[0];

      const nutrientQuery = `
        INSERT INTO log_nutrients 
        (meal_log_id, calories, protein, carbs, fat, fiber, sodium, potassium)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`;

      const nutrientValues = [
        newMealLog.id,
        nutrientData.calories,
        nutrientData.protein,
        nutrientData.carbs,
        nutrientData.fat,
        nutrientData.fiber,
        nutrientData.sodium,
        nutrientData.potassium,
      ];

      const nutrientResult = await client.query(nutrientQuery, nutrientValues);

      await client.query("COMMIT");

      return {
        ...newMealLog,
        nutrients: nutrientResult.rows[0],
      };
    } catch (err) {
      console.error(
        "DB INSERT ERROR:",
        err.message,
        "| code:",
        err.code,
        "| detail:",
        err.detail,
      );
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  });
}

export async function getMealLogsByUserId(userId, days) {
  const params = [userId];
  let where = `WHERE m.user_id = $1`;
  if (days) {
    params.push(days);
    where += ` AND m.logged_at >= NOW() - make_interval(days => $2::int)`;
  }
  const result = await pool.query(
    `
        SELECT
        m.id AS meal_id,
        m.user_id,
        m.meal_description,
        m.status,
        m.logged_at,
        m.calories_burned,
        n.id AS nutrient_id,
        n.calories,
        n.protein,
        n.carbs,
        n.fat,
        n.fiber,
        n.sodium,
        n.potassium
        FROM meal_logs m
        LEFT JOIN log_nutrients n ON m.id = n.meal_log_id
        ${where}
        ORDER BY m.logged_at DESC;
        `,
    params,
  );
  return result.rows;
}

export async function getMealLogsById(id) {
  const {
    rows: [log],
  } = await pool.query(
    `
    SELECT m.id AS meal_id,
        m.user_id,
        m.meal_description,
        m.status,
        m.logged_at,
        m.calories_burned,
        n.id AS nutrient_id,
        n.calories,
        n.protein,
        n.carbs,
        n.fat,
        n.fiber,
        n.sodium,
        n.potassium
        FROM meal_logs m
        LEFT JOIN log_nutrients n ON m.id = n.meal_log_id 
        WHERE m.id = $1`,
    [id],
  );
  return log;
}

export async function updateMealLogById(id) {
  return handlePgError(async () => {
    const {
      rows: [log],
    } = await pool.query(
      `
    UPDATE meal_logs 
    SET status = 'approved' 
    WHERE id = $1 RETURNING *
    `,
      [id],
    );
    return log;
  });
}

export async function deleteById(id) {
  return handlePgError(async () => {
    const { rows } = await pool.query(
      `DELETE FROM meal_logs WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  });
}
