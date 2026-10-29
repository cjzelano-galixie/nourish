import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import { getPendingLogs, deleteLog } from "../../services/logService";
import { sumToday, todayApproved } from "#utils/sumToday";
import { getMyProfile } from "../../services/profileService";
import WelcomeModal from "../common/WelcomeModal";

/** The shared layout for all pages of the app */
export default function Layout() {
  const { token, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [profile, setProfile] = useState(null);

  const refreshLogs = useCallback(async () => {
    try {
      setLogs(await getPendingLogs());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleDeleteLog = async (mealId) => {
    try {
      await deleteLog(mealId);
      await refreshLogs();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      setLogs([]);
      setProfile(null);
      return;
    }
    refreshLogs();
    getMyProfile()
      .then(setProfile)
      .catch((err) => {
        console.error(err);
        if (err.message === "Unauthorized") logout();
      });
  }, [token, refreshLogs, logout]);

  if (!token) return <Navigate to="/login" replace />;

  const totals = sumToday(logs);
  return (
    <>
      <main>
        <Navbar
          totals={totals}
          profile={profile}
          meals={todayApproved(logs)}
          onDeleteMeal={handleDeleteLog}
        />
        <WelcomeModal />
        <Outlet context={{ refreshLogs, profile, setProfile, logs }} />
      </main>
    </>
  );
}
