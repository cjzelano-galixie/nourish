import { AppError, BadRequestError, UnauthorizedError } from "#utils/errors";
import { createContext, useCallback, useContext, useState } from "react";
import { WELCOME_KEY } from "#utils/welcome";

const API = import.meta.env.VITE_API;

const AuthContext = createContext();

/**
 * Provides authentication state, token management, and auth actions (login, register, logout) to child components.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const register = async (credentials) => {
    const response = await fetch(API + "/profiles/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestError(errorText || "Registration failed");
    }

    const result = await response.json();
    localStorage.setItem("token", result.token);
    localStorage.setItem(WELCOME_KEY, "true");
    setToken(result.token);
    return result;
  };

  const login = async (credentials) => {
    const response = await fetch(API + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new UnauthorizedError(errorText || "Invalid email or password");
    }

    const tokenText = await response.text();
    localStorage.setItem("token", tokenText);
    setToken(tokenText);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem(WELCOME_KEY);
    setToken(null);
  }, []);

  const value = { token, register, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access authentication context values and methods within components.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new AppError("useAuth must be used within AuthProvider");
  return context;
}
