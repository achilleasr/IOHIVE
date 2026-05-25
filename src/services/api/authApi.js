import beepConnection from "@/services/beepConnection";

/**
 * POST /api/login
 * Log in with email + password.
 * Response includes { api_token, name, email, ... }.
 */
export function login(email, password) {
  return beepConnection.post("/login", { email, password });
}

/**
 * POST /api/authenticate
 * Re-authenticate using the stored api_token (for persistent login refresh).
 * Not yet wired into the store but available for future use.
 */
export function authenticate() {
  return beepConnection.post("/authenticate");
}
