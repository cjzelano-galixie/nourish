import { useState, useRef, useEffect } from "react";
import "./SummaryPopover.css";

const ROWS = [
  { key: "protein", label: "Protein", unit: "g", target: "target_protein" },
  {
    key: "potassium",
    label: "Potassium",
    unit: "mg",
    target: "target_potassium",
  },
  { key: "sodium", label: "Sodium", unit: "mg", target: "target_sodium" },
  { key: "fiber", label: "Fiber", unit: "g", target: "target_fiber" },
];

const pct = (v, t) => (t ? Math.min(100, Math.round((v / t) * 100)) : 0);
const fmt = (n) => Math.round(n).toLocaleString();

export default function SummaryPopover({
  totals,
  profile,
  meals,
  onDeleteMeal,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const remaining =
    Number(profile.target_calories) + totals.burned - totals.calories;

  return (
    <div className="summary" ref={ref}>
      <button
        className="summary-toggle"
        aria-expanded={open}
        aria-controls="summary-panel"
        onClick={() => setOpen((o) => !o)}
      >
        {fmt(totals.calories)} / {fmt(profile.target_calories)} cal ▾
      </button>
      {open && (
        <div
          id="summary-panel"
          className="summary-panel"
          role="dialog"
          aria-label="Today's Summary"
        >
          <Bar
            label="Calories"
            value={totals.calories}
            target={profile.target_calories}
            unit=""
          />
          {totals.burned > 0 && (
            <p className="summary-note">
              Activity: +{fmt(totals.burned)} cal (estimated)
            </p>
          )}
          <p className="summary-note">
            {remaining >= 0
              ? `${fmt(remaining)} cal left today`
              : "A little over today. That's okay, tomorrow's a fresh start."}
          </p>
          {ROWS.map((r) => (
            <Bar
              key={r.key}
              label={r.label}
              value={totals[r.key]}
              target={profile[r.target]}
              unit={r.unit}
            />
          ))}
          {meals?.length > 0 && (
            <div className="meal-list">
              <h3>Today's meals</h3>
              {meals.map((m) => (
                <MealRow key={m.meal_id} meal={m} onDelete={onDeleteMeal} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Bar({ label, value, target, unit }) {
  return (
    <div className="bar-row">
      <div className="bar-text">
        <span>{label}</span>
        <span>
          {fmt(value)}
          {unit} / {fmt(target)}
          {unit}
        </span>
      </div>
      <div
        className="bar-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={target}
      >
        <div className="bar-fill" style={{ width: `${pct(value, target)}%` }} />
      </div>
    </div>
  );
}

function MealRow({ meal, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="meal-row">
      <span title={meal.meal_description}>
        {meal.meal_description} - {fmt(meal.calories)} cal
        {Number(meal.calories_burned) > 0 &&
          ` · +${fmt(meal.calories_burned)} active`}
      </span>
      {confirming ? (
        <>
          <button onClick={() => onDelete(meal.meal_id)}>Remove</button>
          <button onClick={() => setConfirming(false)}>Keep</button>
        </>
      ) : (
        <button
          aria-label={`Remove ${meal.meal_description}`}
          onClick={() => setConfirming(true)}
        >
          X
        </button>
      )}
    </div>
  );
}
