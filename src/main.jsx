import { createRoot } from "react-dom/client";
import "./tokens.css";
import "./App.css";
import App from "./App.jsx";
import "./polish.css";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </AuthProvider>,
);
