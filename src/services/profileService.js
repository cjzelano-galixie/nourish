const API = import.meta.env.VITE_API;

/**
 * Generates authorization headers containing the user's JWT token for secure API requests.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};
