import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import HowItWorks from "../common/HowItWorks";
import { updateMyProfile } from "../../services/profileService";
import "./Profile.css";

const LB = 2.20462;
const ACTIVITY = [
  [1, "Sedentary (little or no exercise)"],
  [2, "Lightly active (1-3 days/week)"],
  [3, "Moderately active (3-5 days/week)"],
  [4, "Very active (6-7 days/week)"],
  [5, "Extra active (very hard exercise & physical job)"],
];

const round1 = (n) => Math.round(n * 10) / 10;
const cmToFtIn = (cm) => {
  const total = Math.round(cm / 2.54);
  return { feet: Math.floor(total / 12), inches: total % 12 };
};
const fmt = (n) => Math.round(Number(n)).toLocaleString();

export default function Profile() {
  const { profile, setProfile } = useOutletContext();
  if (!profile) return <p role="status">Loading your profile...</p>;

  return (
    <section className="profile-page">
      <h1>My baseline</h1>
      <TargetsCard profile={profile} />
      <ProfileForm profile={profile} onSaved={setProfile} />
      <section className="profile-card">
        <h2>How Nourish works</h2>
        <HowItWorks />
      </section>
    </section>
  );
}

function TargetsCard({ profile }) {
  return (
    <section className="profile-card" aria-label="Current daily targets">
      <h2>Your daily targets</h2>
      <ul className="targets-list">
        <li>
          Calories <strong>{fmt(profile.target_calories)} kcal</strong>
        </li>
        <li>
          Protein <strong>{fmt(profile.target_protein)} g</strong>
        </li>
        <li>
          Carbs <strong>{fmt(profile.target_carbs)} g</strong>
        </li>
        <li>
          Fat <strong>{fmt(profile.target_fat)} g</strong>
        </li>
        <li>
          Fiber <strong>{fmt(profile.target_fiber)} g</strong>
        </li>
        <li>
          Sodium <strong>{fmt(profile.target_sodium)} mg</strong>
        </li>
        <li>
          Potassium <strong>{fmt(profile.target_potassium)} mg</strong>
        </li>
      </ul>
    </section>
  );
}

function ProfileForm({ profile, onSaved }) {
  const initialHeight = cmToFtIn(Number(profile.height));

  const [age, setAge] = useState(String(profile.age));
  const [weightUnit, setWeightUnit] = useState("lbs");
  const [weight, setWeight] = useState(
    String(round1(Number(profile.weight) * LB)),
  );
  const [heightUnit, setHeightUnit] = useState("ft");
  const [feet, setFeet] = useState(String(initialHeight.feet));
  const [inches, setInches] = useState(String(initialHeight.inches));
  const [heightCm, setHeightCm] = useState("");
  const [sex, setSex] = useState(String(profile.sex).toLowerCase());
  const [activity, setActivity] = useState(String(profile.activity_level));
  const [calorieMode, setCalorieMode] = useState(
    profile.uses_custom_calories ? "custom" : "recommended",
  );
  const [customCalories, setCustomCalories] = useState(
    String(profile.target_calories),
  );
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const changeWeightUnit = (unit) => {
    const n = Number(weight);
    if (unit !== weightUnit && weight !== "" && !Number.isNaN(n)) {
      setWeight(String(unit === "kgs" ? round1(n / LB) : round1(n * LB)));
    }
    setWeightUnit(unit);
  };

  const currentCm = () =>
    heightUnit === "ft"
      ? (Number(feet) * 12 + Number(inches || 0)) * 2.54
      : Number(heightCm);

  const changeHeightUnit = (unit) => {
    if (unit === heightUnit) return;
    const cm = currentCm();
    if (cm > 0) {
      if (unit === "cms") setHeightCm(String(Math.round(cm)));
      else {
        const { feet: f, inches: i } = cmToFtIn(cm);
        setFeet(String(f));
        setInches(String(i));
      }
    }
    setHeightUnit(unit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const weightKg =
      weightUnit === "lbs" ? Number(weight) / LB : Number(weight);
    const height = currentCm();

    if (!(Number(age) >= 14 && Number(age) <= 90))
      return setError("Please enter an age between 14 and 90");
    if (!(weightKg >= 25 && weightKg <= 300))
      return setError("Please enter a valid weight");
    if (!(height >= 100 && height <= 250))
      return setError("Please enter a height between 3ft and 8ft");
    if (
      calorieMode === "custom" &&
      !(Number(customCalories) >= 1200 && Number(customCalories) <= 5000)
    )
      return setError("Target calories must be between 1,200 & 5,000");

    setSaving(true);
    try {
      const updated = await updateMyProfile({
        age: Number(age),
        weight: Number(weightKg.toFixed(2)),
        height: Number(height.toFixed(1)),
        sex,
        activityLevel: Number(activity),
        targetCalories:
          calorieMode === "custom" ? Number(customCalories) : null,
      });
      onSaved(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-card profile-form">
      <h2> Edit my baseline</h2>
      <label>
        Age{" "}
        <input
          type="number"
          min="14"
          max="90"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </label>
      <label>
        Weight
        <div className="input-group">
          <input
            type="number"
            step="any"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          <select
            value={weightUnit}
            onChange={(e) => changeWeightUnit(e.target.value)}
            aria-label="Weight unit"
          >
            <option value="lbs">lbs</option>
            <option value="kgs">kgs</option>
          </select>
        </div>
      </label>
      <label>
        Height
        <div className="input-group">
          {heightUnit === "ft" ? (
            <>
              <input
                type="number"
                value={feet}
                placeholder="ft"
                onChange={(e) => setFeet(e.target.value)}
                required
                aria-label="Feet"
              />
              <input
                type="number"
                value={inches}
                placeholder="in"
                onChange={(e) => setInches(e.target.value)}
                aria-label="Inches"
              />
            </>
          ) : (
            <input
              type="number"
              value={heightCm}
              placeholder="cm"
              onChange={(e) => setHeightCm(e.target.value)}
              required
              aria-label="Centimeters"
            />
          )}
          <select
            value={heightUnit}
            onChange={(e) => changeHeightUnit(e.target.value)}
            aria-label="Height unit"
          >
            <option value="ft">ft</option>
            <option value="cms">cms</option>
          </select>
        </div>
      </label>
      <fieldset className="radio-group">
        <legend>Biological sex</legend>
        <label>
          <input
            type="radio"
            name="sex"
            value="female"
            checked={sex === "female"}
            onChange={(e) => setSex(e.target.value)}
          />
          Female
        </label>
        <label>
          <input
            type="radio"
            name="sex"
            value="male"
            checked={sex === "male"}
            onChange={(e) => setSex(e.target.value)}
          />
          Male
        </label>
      </fieldset>
      <label>
        Activity Level
        <select value={activity} onChange={(e) => setActivity(e.target.value)}>
          {ACTIVITY.map(([value, text]) => (
            <option key={value} value={value}>
              {value} - {text}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="radio-group">
        <legend>Daily calorie target</legend>
        <label>
          <input
            type="radio"
            name="calorieMode"
            value="recommended"
            checked={calorieMode === "recommended"}
            onChange={() => setCalorieMode("recommended")}
          />{" "}
          Recommended for me ({fmt(profile.recommended_calories)} kcal)
        </label>
        <p className="field-hint">
          A starting point: your estimated maintenance minus about 400 kcal,
          never below 1,200 (female) or 1,500 (male). It updates when you save
          new details.
        </p>
        <label>
          <input
            type="radio"
            name="calorieMode"
            value="custom"
            checked={calorieMode === "custom"}
            onChange={() => setCalorieMode("custom")}
          />{" "}
          I'll set my own
        </label>
        {calorieMode === "custom" && (
          <input
            type="number"
            min="1200"
            max="5000"
            value={customCalories}
            onChange={(e) => setCustomCalories(e.target.value)}
            aria-label="Custom calorie target"
            required
          />
        )}
      </fieldset>
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save my baseline"}
      </button>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="form-saved">
          Your targets are updated
        </p>
      )}
    </form>
  );
}
