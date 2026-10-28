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
import profileRanges from "#middleware/profileRanges";

const router = express.Router();

function withCalorieInfo(profile) {
  const { targetCalories: recommended } = calculateNutritionTargets({
    age: profile.age,
    weight: profile.weight,
    height: profile.height,
    sex: profile.sex,
    activityLevel: profile.activity_level,
  });
  return {
    ...profile,
    recommended_calories: recommended,
    uses_custom_calories: Number(profile.targetCalories) !== recommended,
  };
}

/**
 * Handles user registration by validating credentials, calculating nutrition targets, creating a user profile, and returning an authentication token.
 */
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
  profileRanges,
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

/**
 * Retrieves the profile details for the currently authenticated user.
 */
router.get("/me", getUserFromToken, async (req, res, next) => {
  try {
    const profile = await getProfileByUserId(req.user.id);
    if (!profile) throw new NotFoundError("Profile not found.");
    res.status(200).json(withCalorieInfo(profile));
  } catch (err) {
    next(err);
  }
});

/**
 * Updates the authenticated user's profile and recalculates their nutritional targets based on any modified physical data.
 */
router.put("/me", getUserFromToken, profileRanges, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const existingProfile = await getProfileByUserId(userId);
    const existingCustom =
      withCalorieInfo(existingProfile).uses_custom_calories;

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
          : existingCustom
            ? existingProfile.target_calories
            : undefined,
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
    res.json(withCalorieInfo(updatedProfile));
  } catch (err) {
    next(err);
  }
});

export default router;
