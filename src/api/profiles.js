import express from "express";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import {
  createProfile,
  getProfileByUserId,
  updateProfile,
} from "#db/queries/profiles";
import { createUser } from "#db/queries/users";
import dataValidation from "#middleware/dataValidation";
import { calculateNutritionTargets } from "#utils/tdee";
import getUserFromToken from "#middleware/getUserFromToken";
import { NotFoundError } from "#utils/errors";

const router = express.Router();

router.post(
  "/register",
  requireBody([
    "email",
    "password",
    "age",
    "weight",
    "height",
    "sex",
    "activityLevel",
  ]),
  dataValidation([
    "email",
    "password",
    "age",
    "weight",
    "height",
    "sex",
    "activityLevel",
  ]),
  async (req, res, next) => {
    try {
      const {
        email,
        password,
        age,
        weight,
        height,
        sex,
        activityLevel,
        targetCalories,
      } = req.body;
      const nutritionTargets = calculateNutritionTargets({
        age,
        weight,
        height,
        sex,
        activityLevel,
        targetCalories,
      });
      const user = await createUser(email, password);
      const profile = await createProfile(user.id, {
        age,
        weight,
        height,
        sex,
        activityLevel,
        ...nutritionTargets,
      });
      const token = createToken({ id: user.id });
      res.status(201).send({ token, profile });
    } catch (err) {
      next(err);
    }
  },
);

router.get("/me", getUserFromToken, async (req, res, next) => {
  try {
    const profile = await getProfileByUserId(req.user.id);
    if (!profile) throw new NotFoundError("Profile not found.");
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
});

router.put("/me", getUserFromToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const existingProfile = await getProfileByUserId(userId);

    if (!existingProfile) throw new NotFoundError("Profile not found.");

    const mergedData = {
      age: req.body.age !== undefined ? req.body.age : existingProfile.age,
      weight:
        req.body.weight !== undefined
          ? req.body.weight
          : existingProfile.weight,
      height:
        req.body.height !== undefined
          ? req.body.height
          : existingProfile.height,
      sex: req.body.sex !== undefined ? req.body.sex : existingProfile.sex,
      activityLevel:
        req.body.activityLevel !== undefined
          ? req.body.activityLevel
          : existingProfile.activity_level,
      targetCalories:
        req.body.targetCalories !== undefined
          ? req.body.targetCalories
          : existingProfile.target_calories,
    };

    const nutritionTargets = calculateNutritionTargets(mergedData);

    const fieldsToUpdate = {
      age: mergedData.age,
      weight: mergedData.weight,
      height: mergedData.height,
      sex: mergedData.sex,
      activity_level: mergedData.activityLevel,
      calculated_tdee: nutritionTargets.calculatedTdee,
      target_calories: nutritionTargets.targetCalories,
      target_protein: nutritionTargets.targetProtein,
      target_carbs: nutritionTargets.targetCarbs,
      target_fat: nutritionTargets.targetFat,
      target_fiber: nutritionTargets.targetFiber,
      target_sodium: nutritionTargets.targetSodium,
      target_potassium: nutritionTargets.targetPotassium,
    };

    const updatedProfile = await updateProfile(userId, fieldsToUpdate);
    res.json(updatedProfile);
  } catch (err) {
    next(err);
  }
});

export default router;
