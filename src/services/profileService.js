import { AppError } from "#utils/errors";
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

export async function getMyProfile() {
  const response = await fetch(API + "/profiles/me", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new AppError(errorText || "Failed to load profile");
  }
  return response.json();
}

async function readError(response, fallback) {
  const text = await response.text();
  try {
    return JSON.parse(text).error || fallback;
  } catch {
    return text || fallback;
  }
}

export async function updateMyProfile(fields) {
  const response = await fetch(API + "/profiles/me", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(fields),
  });
  if (!response.ok) {
    throw new AppError(await readError(response, "Failed to update profile"));
  }
  return response.json();
}
