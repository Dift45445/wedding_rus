/**
 * Secure localStorage utility for wedding invitation data
 * Stores wedding UID and guest information securely
 */

const STORAGE_KEYS = {
  WEDDING_UID: "sakeenah_wedding_uid",
  GUEST_NAME: "sakeenah_guest_name",
  GUEST_MESSAGE: "sakeenah_guest_message",
  GUEST_PREFIX: "sakeenah_guest_prefix",
  GUEST_TOKEN: "sakeenah_guest_token",
  TIMESTAMP: "sakeenah_timestamp",
};

// Storage expiration: 30 days
const STORAGE_EXPIRY = 30 * 24 * 60 * 60 * 1000;

/**
 * Check if stored data has expired
 */
function isExpired() {
  const timestamp = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);
  if (!timestamp) return true;

  const age = Date.now() - parseInt(timestamp, 10);
  return age > STORAGE_EXPIRY;
}

/**
 * Clear all wedding invitation data from localStorage
 */
export function clearInvitationData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Store wedding UID in localStorage
 * @param {string} uid - Wedding unique identifier
 */
export function storeWeddingUid(uid) {
  if (!uid) return;

  try {
    localStorage.setItem(STORAGE_KEYS.WEDDING_UID, uid);
    localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error("Error storing wedding UID:", error);
  }
}

/**
 * Get wedding UID from localStorage
 * @returns {string|null} Wedding UID or null if not found/expired
 */
export function getWeddingUid() {
  if (isExpired()) {
    clearInvitationData();
    return null;
  }

  try {
    return localStorage.getItem(STORAGE_KEYS.WEDDING_UID);
  } catch (error) {
    console.error("Error retrieving wedding UID:", error);
    return null;
  }
}

/**
 * Store guest name in localStorage
 * @param {string} name - Guest name (already decoded)
 */
export function storeGuestName(name) {
  if (!name) return;

  try {
    localStorage.setItem(STORAGE_KEYS.GUEST_NAME, name);
    localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error("Error storing guest name:", error);
  }
}

/**
 * Get guest name from localStorage
 * @returns {string|null} Guest name or null if not found/expired
 */
export function getGuestName() {
  if (isExpired()) {
    clearInvitationData();
    return null;
  }

  try {
    return localStorage.getItem(STORAGE_KEYS.GUEST_NAME);
  } catch (error) {
    console.error("Error retrieving guest name:", error);
    return null;
  }
}

export function storeGuestMessage(message) {
  if (!message) return;

  try {
    localStorage.setItem(STORAGE_KEYS.GUEST_MESSAGE, message);
    localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error("Error storing guest message:", error);
  }
}

export function getGuestMessage() {
  if (isExpired()) {
    clearInvitationData();
    return null;
  }

  try {
    return localStorage.getItem(STORAGE_KEYS.GUEST_MESSAGE);
  } catch (error) {
    console.error("Error retrieving guest message:", error);
    return null;
  }
}

/**
 * Store guest prefix in localStorage
 * @param {string} prefix - Guest prefix
 */
export function storeGuestPrefix(prefix) {
  if (!prefix) return;

  try {
    localStorage.setItem(STORAGE_KEYS.GUEST_PREFIX, prefix);
    localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error("Error storing guest prefix:", error);
  }
}

/**
 * Get guest prefix from localStorage
 * @returns {string|null} Guest prefix or null if not found/expired
 */
export function getGuestPrefix() {
  if (isExpired()) {
    clearInvitationData();
    return null;
  }

  try {
    return localStorage.getItem(STORAGE_KEYS.GUEST_PREFIX);
  } catch (error) {
    console.error("Error retrieving guest prefix:", error);
    return null;
  }
}

/**
 * Check if invitation data exists in localStorage
 * @returns {boolean}
 */
export function hasInvitationData() {
  return !isExpired() && !!getWeddingUid();
}

/**
 * Get all stored invitation data
 * @returns {Object} Object containing uid and guestName
 */
export function getInvitationData() {
  if (isExpired()) {
    clearInvitationData();
    return { uid: null, guestName: null, guestMessage: null };
  }

  return {
    uid: getWeddingUid(),
    guestName: getGuestName(),
    guestMessage: getGuestMessage(),
  };
}

/**
 * Store complete invitation data
 * @param {Object} data - Invitation data
 * @param {string} data.uid - Wedding UID
 * @param {string} data.guestName - Guest name
 */
export function storeInvitationData({ uid, guestName }) {
  storeWeddingUid(uid);
  if (guestName) {
    storeGuestName(guestName);
  }
}
