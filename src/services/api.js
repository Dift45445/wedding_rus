const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetch all wishes for an invitation
 * @param {string} uid - Invitation UID
 * @param {object} options - Query options (limit, offset)
 * @returns {Promise<object>} Response with wishes data
 */
export async function fetchWishes(uid, options = {}) {
  const { limit = 50, offset = 0 } = options;
  const url = new URL(`${API_URL}/api/${uid}/wishes`);
  url.searchParams.set("limit", limit);
  url.searchParams.set("offset", offset);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch wishes");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new wish
 * @param {string} uid - Invitation UID
 * @param {object} wishData - Wish data (name, message, attendance)
 * @returns {Promise<object>} Response with created wish
 */
export async function createWish(uid, wishData) {
  // Pass all fields including alcohol, transfer, allergies
  const response = await fetch(`${API_URL}/api/${uid}/wishes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wishData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Preserve error code for duplicate wish detection
    const error = new Error(data.error || "Failed to create wish");
    error.code = data.code;
    throw error;
  }
  return data;
}

/**
 * Check if guest has already submitted a wish
 * @param {string} uid - Invitation UID
 * @param {string} name - Guest name
 * @returns {Promise<object>} Response with hasSubmitted boolean
 */
export async function checkWishSubmitted(uid, name) {
  try {
    const response = await fetch(
      `${API_URL}/api/${uid}/wishes/check/${encodeURIComponent(name)}`,
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to check wish status");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a wish (admin function)
 * @param {string} uid - Invitation UID
 * @param {number} wishId - Wish ID to delete
 * @returns {Promise<object>} Response with deletion confirmation
 */
export async function deleteWish(uid, wishId) {
  const response = await fetch(`${API_URL}/api/${uid}/wishes/${wishId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete wish");
  }
  return response.json();
}

/**
 * Get attendance statistics
 * @param {string} uid - Invitation UID
 * @returns {Promise<object>} Response with stats data
 */
export async function fetchAttendanceStats(uid) {
  try {
    const response = await fetch(`${API_URL}/api/${uid}/stats`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch stats");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Update invitation program
 * @param {string} uid - Invitation UID
 * @param {array} program - Array of program items
 * @returns {Promise<object>} Response with success status
 */
export async function updateProgram(uid, program) {
  const response = await fetch(`${API_URL}/api/invitation/${uid}/program`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ program }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update program");
  }
  return response.json();
}

/**
 * Update wedding config (greeting prefix, invitation text)
 * @param {string} uid - Invitation UID
 * @param {object} config - Config object { greetingPrefix, invitationText }
 * @returns {Promise<object>} Response with success status
 */
export async function updateConfig(uid, config) {
  const response = await fetch(`${API_URL}/api/invitation/${uid}/config`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update config");
  }
  return response.json();
}

/**
 * Fetch invitation details
 * @param {string} uid - Invitation UID
 * @returns {Promise<object>} Response with invitation data
 */
export async function fetchInvitation(uid) {
  try {
    const response = await fetch(`${API_URL}/api/invitation/${uid}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch invitation");
    }
    return response.json();
  } catch (error) {
    // If fetch failed (network error), rethrow so it can be handled by caller
    throw error;
  }
}
