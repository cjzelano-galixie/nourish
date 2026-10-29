import "./Navbar.css";
import SummaryPopover from "./SummaryPopover";
import { useAuth } from "../auth/AuthContext";
import { NavLink, Link } from "react-router-dom";
import { MessageCircle, TrendingUp, User } from "lucide-react";

export default function Navbar({ totals, profile, meals, onDeleteMeal }) {
  const { logout } = useAuth();
  return (
    <>
      <header className="navbar">
        <Link to="/ai" className="navbar-brand" aria-label="Nourish home">
          <img
            src={`${import.meta.env.BASE_URL}img/icon-sm.png`}
            alt=""
            width="36"
            height="36"
          />
          <span>Nourish</span>
        </Link>
        <div className="navbar-right">
          {profile && (
            <SummaryPopover
              totals={totals}
              profile={profile}
              meals={meals}
              onDeleteMeal={onDeleteMeal}
            />
          )}
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>
      <nav className="tabbar" aria-label="Main">
        <NavLink to="/ai">
          <MessageCircle aria-hidden="true" />
          <span>Chat</span>
        </NavLink>
        <NavLink to="/dashboard">
          <TrendingUp aria-hidden="true" />
          <span>Insights</span>
        </NavLink>
        <NavLink to="/profile">
          <User aria-hidden="true" />
          <span>My baseline</span>
        </NavLink>
      </nav>
    </>
  );
}
