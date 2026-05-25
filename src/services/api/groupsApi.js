import beepConnection from "@/services/beepConnection";

/**
 * GET /api/groups
 * List the user's groups (apiaries shared between multiple users).
 * Response shape: { groups: [...] }
 */
export function listGroups() {
  return beepConnection.get("/groups");
}
