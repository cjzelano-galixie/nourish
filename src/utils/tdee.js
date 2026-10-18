/**
 *
 * @param {Object} profileData
 * @param {number} age - Age in years
 * @param {number} weight - Weight in kg will always be converted to kgs even though toggle on front end accepts lbs. Conversion made on front end
 * @param {number} height - Height in cm. Conversion made on front end
 * @param {string} sex - "male" or "female"
 * @param {number} activityLevel - activity multiplier scaled from 1-5 on front end
 * @returns {Object} Calculated TDEE & targets for macros
 */

export function calculateNutritionTargets(profileData) {
  const {
    age,
    weight,
    height,
    sex,
    activityLevel,
    targetCalories: userTargetCalories,
  } = profileData;

  const activityMap = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  };
  const multiplier =
    activityMap[Number(activityLevel)] || Number(activityLevel);

  const sexConstant = sex.toLowerCase() === "male" ? 5 : -161;
  const bmr =
    10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + sexConstant;

  const calculatedTdee = Math.round(bmr * multiplier);

  let targetCalories;
  if (
    userTargetCalories !== undefined &&
    userTargetCalories !== null &&
    userTargetCalories !== ""
  ) {
    targetCalories = Number(userTargetCalories);
  } else {
    const minCalories = sex.toLowerCase() === "male" ? 1500 : 1200;
    const suggestedDeficitCalories = calculatedTdee - 400;
    targetCalories = Math.max(suggestedDeficitCalories, minCalories);
  }

  const targetProtein = Math.round((targetCalories * 0.3) / 4);
  const targetCarbs = Math.round((targetCalories * 0.4) / 4);
  const targetFat = Math.round((targetCalories * 0.3) / 9);

  //   These are standards for recommended micro nutrients (mg) & fiber (g) target
  const targetFiber = 30;
  const targetSodium = 2300;
  const targetPotassium = 3500;

  return {
    calculatedTdee,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFat,
    targetFiber,
    targetSodium,
    targetPotassium,
  };
}
