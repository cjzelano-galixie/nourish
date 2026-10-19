import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState(null);

  const tryLogin = async (formData) => {
    setError(null);

    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await login({ email, password });
      console.log("Login successful! Token Saved");
      //   navigate("/chat");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <article className="auth-container">
      <h2>🌱 Nourish</h2>
      <h1>Welcome Back</h1>
      <form action={tryLogin} className="auth-form">
        <label>
          Email Address <input type="email" name="email" required />
        </label>
        <label>
          Password <input type="password" name="password" required />
        </label>
        <button type="submit">Sign In</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <div className="auth-link-text">
        <Link to="/register">Need an account? Register here → </Link>
      </div>
    </article>
  );
}
