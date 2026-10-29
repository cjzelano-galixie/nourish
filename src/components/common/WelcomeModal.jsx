import { useState, useEffect, useRef } from "react";
import HowItWorks from "./HowItWorks";
import { WELCOME_KEY } from "#utils/welcome";
import "./WelcomeModal.css";

export default function WelcomeModal() {
  const [open, setOpen] = useState(
    () => localStorage.getItem(WELCOME_KEY) === "true",
  );
  const ref = useRef(null);

  useEffect(() => {
    if (open && ref.current && !ref.current.open) ref.current.showModal();
  }, [open]);

  const handleClose = () => {
    localStorage.removeItem(WELCOME_KEY);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      onClose={handleClose}
      aria-labelledby="welcome-title"
      className="welcome-modal"
    >
      <h2 id="welcome-title">Welcome to Nourish</h2>
      <p className="welcome-sub">Better choices. Brighter Days.</p>
      <HowItWorks />
      <button
        className="welcome-btn"
        autoFocus
        onClick={() => ref.current.close()}
      >
        Let's log my first meal
      </button>
    </dialog>
  );
}
