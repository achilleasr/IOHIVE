import beepConnection from "@/services/beepConnection";

export function listInspectionsForHive(hiveId) {
  return beepConnection.get(`/inspections/hive/${hiveId}`);
}

/**
 * POST /api/inspections/store
 * The REAL BEEP inspection payload is dynamic:
 *   {
 *     date,                       // "YYYY-MM-DD HH:MM:SS"
 *     checklist_id,               // which checklist this inspection used
 *     hive_ids: [id, ...],        // ARRAY — one id = single hive, many = bulk/apiary
 *     items: { [category_id]: value },  // answers keyed by category id
 *     impression, attention, notes, reminder, reminder_date  // optional general fields
 *   }
 * Note: the general "needs attention" field is `attention`, not `needs_attention`.
 */
export function createInspection(payload) {
  return beepConnection.post("/inspections/store", payload);
}

export function deleteInspection(id) {
  return beepConnection.delete(`/inspections/${id}`);
}
