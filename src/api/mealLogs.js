import express from "express";
import requireBody from "#middleware/requireBody";
import getUserFromToken from "#middleware/getUserFromToken";
import {
  createMealLogWithNutrients,
  deleteById,
  getMealLogsById,
  getMealLogsByUserId,
  updateMealLogById,
} from "#db/queries/mealLogs";
import { NotFoundError, ForbiddenError } from "#utils/errors";

const router = express.Router();

router.post(
  "/",
  getUserFromToken,
  requireBody([
    "mealDescription",
    "status",
    "calories",
    "protein",
    "carbs",
    "fat",
    "fiber",
    "sodium",
    "potassium",
  ]),
  async (req, res, next) => {
    try {
      const {
        mealDescription,
        status,
        calories,
        protein,
        carbs,
        fat,
        fiber,
        sodium,
        potassium,
      } = req.body;

      const mealData = { mealDescription, status };
      const nutrientData = {
        calories,
        protein,
        carbs,
        fat,
        fiber,
        sodium,
        potassium,
      };

      const mealLog = await createMealLogWithNutrients(
        req.user.id,
        mealData,
        nutrientData,
      );

      res.status(201).json(mealLog);
    } catch (err) {
      next(err);
    }
  },
);

router.get("/", getUserFromToken, async (req, res, next) => {
  try {
    const mealLog = await getMealLogsByUserId(req.user.id);
    res.status(200).json(mealLog);
  } catch (err) {
    next(err);
  }
});

router.param("id", async (req, res, next, id) => {
  try {
    const log = await getMealLogsById(id);
    if (!log) throw new NotFoundError("Meal log not found.");
    req.log = log;
    next();
  } catch (err) {
    next(err);
  }
});

router.put("/:id", getUserFromToken, async (req, res, next) => {
  try {
    if (req.log.user_id !== req.user.id)
      throw new ForbiddenError(
        "You are not authorized to modify this meal log.",
      );
    const update = await updateMealLogById(req.params.id);
    res.status(200).json(update);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", getUserFromToken, async (req, res, next) => {
  try {
    if (req.log.user_id !== req.user.id)
      throw new ForbiddenError(
        "You are not authorized to delete this meal log.",
      );
    await deleteById(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
