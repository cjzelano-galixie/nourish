import { AppError } from "#utils/errors";

const API = import.meta.env.VITE_API || "https://nourish-zryq.onrender.com/api";

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

/**
 * Sends a natural-language message to the backend AI endpoint and returns the parsed pending meal log.
 */
export async function aiChatMessage(message) {
  const response = await fetch(API + "/ai", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new AppError(errorText);
  }

  return await response.json();
}
