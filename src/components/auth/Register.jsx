import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

/**
 * Renders the multi-step user registration and profile creation form, handling unit conversions, validation, and baseline TDEE review.
 */
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [weightUnit, setWeightUnit] = useState("lbs");
  const [heightUnit, setHeightUnit] = useState("ft");
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setSlow(false);
      return;
    }
    const t = setTimeout(() => setSlow(true), 3000);
    return () => clearTimeout(t);
  }, [isLoading]);

  const tryRegister = async (formData) => {
    setError(null);

    const email = formData.get("email");
    const password = formData.get("password");
    const age = formData.get("age");
    if (age < 14) {
      setError("Please enter a valid age greater than 14.");
      return;
    }
    const sex = formData.get("sex");
    const activityLevel = formData.get("activity-level");
    const targetCalories = formData.get("target-calories");

    const rawWeight = Number(formData.get("weight"));
    const weight = weightUnit === "lbs" ? rawWeight / 2.20462 : rawWeight;

    let height;
    if (heightUnit === "ft") {
      const feet = Number(formData.get("feet")) || 0;
      const inches = Number(formData.get("inches")) || 0;
      height = (feet * 12 + inches) * 2.54;
    } else {
      height = Number(formData.get("heightCm"));
    }

    if (weight < 25 || weight > 300) {
      setError("Please enter a valid weight");
      return;
    }

    if (height < 100 || height > 250) {
      setError("Please enter a valid height");
      return;
    }

    setIsLoading(true);
    try {
      const data = await register({
        email,
        password,
        age,
        weight,
        height,
        sex,
        activityLevel,
        targetCalories,
      });
      // console.log("Registration successful! Token Saved");
      setProfile(data.profile);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <img
        className="auth-logo"
        src={`${import.meta.env.BASE_URL}img/wordmark.png`}
        alt="Nourish: Better choices. Brighter days."
      />

      <article className="auth-container">
        {step === 1 ? (
          <form action={tryRegister} className="auth-form">
            <h1>Create your account</h1>
            <label>
              Email Address <input type="email" name="email" required />
            </label>
            <label>
              Password <input type="password" name="password" required />
            </label>
            <label>
              Age <input type="number" name="age" min="14" max="90" required />
            </label>
            <label>
              Weight
              <div className="input-group">
                <input
                  type="number"
                  name="weight"
                  step="any"
                  required
                  placeholder="e.g. 150"
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
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
                      name="feet"
                      placeholder="ft"
                      required
                    />
                    <input type="number" name="inches" placeholder="in" />
                  </>
                ) : (
                  <input
                    type="number"
                    name="heightCm"
                    placeholder="cm"
                    required
                  />
                )}
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value)}
                >
                  <option value="ft">ft</option>
                  <option value="cms">cms</option>
                </select>
              </div>
            </label>
            <fieldset className="radio-group">
              <legend>Biological Sex </legend>
              <label>
                <input type="radio" name="sex" value="female" required /> Female
              </label>
              <label>
                <input type="radio" name="sex" value="male" required /> Male
              </label>
            </fieldset>
            <label>
              Activity Level
              <select name="activity-level" required defaultValue="">
                <option value="" disabled>
                  Select your activity level...
                </option>
                <option value="1">1 - Sedentary (little or no exercise)</option>
                <option value="2">2 - Lightly active (1-3 days/week)</option>
                <option value="3">3 - Moderately active (3-5 days/week)</option>
                <option value="4">4 - Very active (6-7 days/week)</option>
                <option value="5">
                  5 - Extra active (very hard exercise & physical job)
                </option>
              </select>
            </label>
            <label>
              Target Calories (optional)
              <input type="number" name="target-calories" />
            </label>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Calculating Baseline..." : "Calculate my baseline"}
            </button>
            {slow && (
              <p role="status" className="slow-note">
                Still working. The server is waking up, which can take up to a
                minute the first time. Thanks for waiting!
              </p>
            )}
            {error && <p role="alert">{error}</p>}
          </form>
        ) : (
          <div className="baseline-review-card">
            <h2>Your Daily Maintenance Baseline</h2>
            <p>Calculated TDEE: {profile?.calculated_tdee} kcal</p>
            <p>Target Calories: {profile?.target_calories} kcal</p>
            <p>Protein: {profile?.target_protein}g</p>
            <p>Fat: {profile?.target_fat}g</p>
            <p>Carbs: {profile?.target_carbs}g</p>
            <p>Fiber: {profile?.target_fiber}g</p>
            <p>Sodium: {profile?.target_sodium}mg</p>
            <p>Potassium: {profile?.target_potassium}mg</p>
            <button onClick={() => navigate("/ai")}>
              Start logging your first meal →
            </button>{" "}
            {error && <p role="alert">{error}</p>}
          </div>
        )}
        <div className="auth-link-text">
          <Link to="/login">Already have an account? Log in here → </Link>
        </div>
      </article>
    </main>
  );
}
