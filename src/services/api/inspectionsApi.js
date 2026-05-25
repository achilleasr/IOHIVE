import beepConnection from "@/services/beepConnection";

/**
 * GET /api/inspections/hive/{hive_id}
 * List all inspections linked to a given hive.
 * Response shape includes { inspections: { data: [...] }, items_by_date: ... }.
 */
export function listInspectionsForHive(hiveId) {
  return beepConnection.get(`/inspections/hive/${hiveId}`);
}
