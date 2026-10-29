import { AppError, ForbiddenError, NotFoundError } from "#utils/errors";

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
 * Fetches all pending meal logs for the authenticated user from the backend API.
 */
export async function getPendingLogs() {
  const response = await fetch(API + "/logs", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new AppError(errorText || "Internal Server Error");
  }

  return response.json();
}

/**
 * Approves a specific pending meal log by its unique identifier.
 */
export async function approveLog(id) {
  const response = await fetch(API + "/logs/" + id, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 404) {
      throw new NotFoundError(errorText || "Log not found");
    }
    if (response.status === 403) {
      throw new ForbiddenError(errorText || "Forbidden");
    }
    throw new AppError(errorText || "Failed to approve log");
  }

  return response.json();
}

/**
 * Deletes a specific meal log by its unique identifier from the database.
 */
export async function deleteLog(id) {
  const response = await fetch(API + "/logs/" + id, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 404) {
      throw new NotFoundError(errorText || "Log not found");
    }
    if (response.status === 403) {
      throw new ForbiddenError(errorText || "Forbidden");
    }
    throw new AppError(errorText || "Failed to delete log");
  }

  return;
}
