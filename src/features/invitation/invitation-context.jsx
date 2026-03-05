import { createContext, useContext, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInvitation } from "@/services/api";
import {
  getWeddingUid,
  storeWeddingUid,
  storeGuestName,
  storeGuestMessage,
  storeGuestPrefix,
  hasInvitationData,
} from "@/lib/invitation-storage";
import { safeBase64 } from "@/lib/base64";

const InvitationContext = createContext(null);

/**
 * InvitationProvider component
 * Provides the invitation UID and config data throughout the app
 *
 * Security Features:
 * - Stores UID in localStorage to hide from URL
 * - Cleans URL after extracting parameters
 * - Prevents Wayback Machine scraping
 * - 30-day expiration for stored data
 * - Automatically updates when different UID or guest name is provided
 *
 * The UID priority:
 * 1. URL parameters (if different from stored, updates localStorage)
 * 2. localStorage (if not expired and no URL override)
 * 3. Environment variable: VITE_INVITATION_UID
 *
 * @example
 * <InvitationProvider>
 *   <App />
 * </InvitationProvider>
 */
export function InvitationProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const invitationUid = useMemo(() => {
    if (location.pathname.startsWith("/admin")) {
      return null;
    }
    // Extract UID from URL first (to check if it's different)
    let uidFromUrl = null;

    // 1. Try to get UID from URL path (e.g., /rifqi-dina-2025)
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0) {
      uidFromUrl = pathSegments[0];
    }

    // 2. Try to get UID from URL query parameter (legacy support)
    if (!uidFromUrl) {
      const urlParams = new URLSearchParams(location.search);
      uidFromUrl = urlParams.get("uid");
    }

    // Check if we have a stored UID
    const storedUid = getWeddingUid();

    // If URL has UID and it's different from stored, update localStorage
    if (uidFromUrl && uidFromUrl !== storedUid) {
      console.log(`Updating invitation from "${storedUid}" to "${uidFromUrl}"`);
      storeWeddingUid(uidFromUrl);
      return uidFromUrl;
    }

    // If URL has UID (same as stored or no stored), use it
    if (uidFromUrl) {
      storeWeddingUid(uidFromUrl);
      return uidFromUrl;
    }

    // If no URL UID but have stored UID, use stored
    if (storedUid) {
      return storedUid;
    }

    // 3. Fallback to environment variable
    const uidFromEnv = import.meta.env.VITE_INVITATION_UID;

    if (uidFromEnv) {
      storeWeddingUid(uidFromEnv);
      return uidFromEnv;
    }

    // If no UID is provided, log a warning
    console.warn(
      "No invitation UID found. Please provide /your-uid in the URL or set VITE_INVITATION_UID in .env",
    );
    return null;
  }, [location.pathname, location.search]);

  // Extract and store guest name from URL, then clean URL
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      return;
    }
    const urlParams = new URLSearchParams(location.search);
    const guestParam = urlParams.get("guest");
    const messageParam = urlParams.get("message");
    const prefixParam = urlParams.get("prefix");

    let needsUpdate = false;

    if (guestParam) {
      const decodedName = safeBase64.decode(guestParam);
      if (decodedName) {
        storeGuestName(decodedName);
        needsUpdate = true;
      }
    }

    if (messageParam) {
      const decodedMessage = safeBase64.decode(messageParam);
      if (decodedMessage) {
        storeGuestMessage(decodedMessage);
        needsUpdate = true;
      }
    }

    if (prefixParam) {
      const decodedPrefix = safeBase64.decode(prefixParam);
      if (decodedPrefix) {
        storeGuestPrefix(decodedPrefix);
        needsUpdate = true;
      }
    }

    // Clean URL if we extracted params or if we're on a deep link
    if (needsUpdate || invitationUid) {
      // Only clean URL if we have data stored
      if (hasInvitationData()) {
        // Use window.history.replaceState for clean URL without reload
        window.history.replaceState({}, "", "/");
      }
    }
  }, [location.pathname, location.search, navigate]);

  const {
    data: config,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invitation", invitationUid],
    queryFn: async () => {
      // If no UID, don't even try to fetch, just return null (use static)
      if (!invitationUid) return null;
      try {
        const response = await fetchInvitation(invitationUid);
        if (response.success) {
          return response.data;
        }
        throw new Error("Failed to load invitation");
      } catch (error) {
        // Fallback to static config on network error or server error
        console.warn("Using static config due to API error:", error);
        return null;
      }
    },
    // Always enable to allow "fetching" null (which resolves immediately)
    // This prevents isLoading from being true when we have no UID
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <InvitationContext.Provider
      value={{ uid: invitationUid, config, isLoading, error: error?.message }}
    >
      {children}
    </InvitationContext.Provider>
  );
}

/**
 * Custom hook to access the invitation UID
 *
 * @returns {object} Object containing the invitation UID
 * @throws {Error} If used outside of InvitationProvider
 *
 * @example
 * const { uid } = useInvitation();
 */
export function useInvitation() {
  const context = useContext(InvitationContext);

  if (context === null) {
    throw new Error("useInvitation must be used within InvitationProvider");
  }

  return context;
}
