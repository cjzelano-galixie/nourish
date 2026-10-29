import "./Navbar.css";
import SummaryPopover from "./SummaryPopover";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar({ totals, profile, meals, onDeleteMeal }) {
  const { logout } = useAuth();
  return (
    <header className="navbar">
      <div className="navbar-brand">Nourish</div>
      <div className="navbar-right">
        {profile && (
          <SummaryPopover
            totals={totals}
            profile={profile}
            meals={meals}
            onDeleteMeal={onDeleteMeal}
          />
        )}
        <Link to="/profile" className="nav-link">
          My baseline
        </Link>
        <button className="logout-btn" onClick={logout}>
          Log out
        </button>
      </div>
    </header>
  );
}
