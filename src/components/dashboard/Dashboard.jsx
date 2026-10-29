import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  NUTRIENTS,
  MIN_DAYS,
  dailyTotals,
  windowStats,
  recommendations,
} from "#utils/analytics";
import "./Dashboard.css";

const LABELS = {
  calories: "Calories",
  protein: "Protein",
  carbs: "Carbs",
  fat: "Fat",
  fiber: "Fiber",
  sodium: "Sodium",
  potassium: "Potassium",
};
const UNITS = {
  calories: "kcal",
  protein: "g",
  carbs: "g",
  fat: "g",
  fiber: "g",
  sodium: "mg",
  potassium: "mg",
};
const fmt = (n) => Math.round(n).toLocaleString();

export default function Dashboard() {
  const { logs, profile } = useOutletContext();
  const [range, setRange] = useState(7);
  if (!profile) return <p role="status">Loading...</p>;

  const daily = dailyTotals(logs);
  const current = windowStats(daily, range);
  const previous = windowStats(daily, range, range);
  const enough = current.loggedDays >= MIN_DAYS;

  return (
    <section className="dashboard">
      <h1>Your Insights</h1>

      <div className="range-toggle" role="group" aria-label="Date Range">
        {[7, 14, 28].map((d) => (
          <button
            key={d}
            aria-pressed={range === d}
            onClick={() => setRange(d)}
          >
            {d} days
          </button>
        ))}
      </div>

      {!enough ? (
        <div className="dash-card" role="status">
          <h2>Almost there</h2>{" "}
          <p>
            Log at least {MIN_DAYS} days of meals to unlock your averages and
            tips. You've logged {current.loggedDays} of the last {range} days.
          </p>
        </div>
      ) : (
        <>
          <Averages current={current} profile={profile} />
          <Tips tips={recommendations(current.avg, profile)} />
          <Trends current={current} previous={previous} range={range} />
          <CalorieChart
            current={current}
            target={Number(profile.target_calories)}
          />
        </>
      )}
      <p className="dash-disclaimer">Estimates only, not medical advice.</p>
    </section>
  );
}

function Averages({ current, profile }) {
  return (
    <section className="dash-card" aria-label="Daily averages">
      <h2>Daily averages</h2>
      <p className="dash-sub">
        Based on {current.loggedDays} of {current.length} days logged
      </p>
      <ul className="avg-list">
        {NUTRIENTS.map((n) => {
          const target = Number(profile[`target_${n}`]);
          return (
            <li key={n}>
              <span>{LABELS[n]}</span>
              <span>
                <strong>{fmt(current.avg[n])}</strong> / {fmt(target)}{" "}
                {UNITS[n]}
              </span>
            </li>
          );
        })}
      </ul>
      {current.avg.burned > 0 && (
        <p className="dash-sub">
          Estimated activity: ~{fmt(current.avg.burned)} kcal a day
        </p>
      )}
    </section>
  );
}

function Tips({ tips }) {
  return (
    <section className="dash-card" aria-label="Suggestions">
      <h2>Ideas for you</h2>
      {tips.length === 0 ? (
        <p>You're right around your targets. Nice work!</p>
      ) : (
        <ul>
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Trends({ current, previous, range }) {
  const ready = previous.loggedDays >= 2 && current.loggedDays >= 2;
  return (
    <section className="dash-card" aria-label="Trends">
      <h2>
        {range === 7
          ? "This week vs last week"
          : `Last ${range} days vs the ${range} before`}
      </h2>
      {!ready ? (
        <p>
          Not enough data yet. Trends appear once you have a couple of logged
          days in each period.
        </p>
      ) : (
        <ul className="avg-list">
          {NUTRIENTS.map((n) => {
            const diff = current.avg[n] - previous.avg[n];
            const dir = Math.abs(diff) < 1 ? "same" : diff > 0 ? "up" : "down";
            const arrow = { up: "▲", down: "▼", same: "●" }[dir];

            return (
              <li key={n}>
                <span>{LABELS[n]}</span>
                <span>
                  {fmt(current.avg[n])} {UNITS[n]}{" "}
                  <span className={`trend trend-${dir}`}>
                    <span aria-hidden="true">{arrow}</span>{" "}
                    {dir === "same"
                      ? "about the same"
                      : `${dir} ${fmt(Math.abs(diff))}`}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function CalorieChart({ current, target }) {
  const data = current.list.map((x) => ({
    label: x.date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    calories: x.data ? Math.round(x.data.calories) : null,
  }));

  return (
    <section className="dash-card" aria-label="Calories by day">
      <h2>Calories by day</h2>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="label" interval="preserveStartEnd" />
            <YAxis width={44} />
            <Tooltip />
            <ReferenceLine y={target} strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#B76A45"
              strokeWidth={2.5}
              connectNulls={false}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="dash-sub">
        Gaps mean no meals were logged that day. The dashed line is your target.
      </p>
    </section>
  );
}
