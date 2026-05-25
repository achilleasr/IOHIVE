import beepConnection from "@/services/beepConnection";

/**
 * GET /api/locations
 * List all apiaries (BEEP calls them "locations") for the authenticated user.
 * Response shape: { locations: [...] }
 */
export function listLocations() {
  return beepConnection.get("/locations");
}

/**
 * POST /api/locations
 * Create a new apiary.
 *
 * IMPORTANT: BEEP's create-location endpoint ALSO creates hives by default
 * (1 hive unless `hive_amount: 0` is provided). For an "apiary only" creation,
 * always pass hive_amount: 0 in the payload.
 *
 * Common payload fields:
 *   name           (string, REQUIRED)
 *   lat, lon       (numbers, optional — rounded to 3 decimals server-side)
 *   hex_color      (string, optional, e.g. "#FABB13")
 *   hive_amount    (integer, optional, default 1; pass 0 to skip hive creation)
 *   country_code   (string, default "nl")
 *   continent      (string, default "eu")
 *   location_type  (string, default "fixed")
 *   city, street, street_no, postal_code (strings, optional)
 *   hive_type_id   (integer, optional — category id for auto-created hives)
 *   brood_layers, honey_layers, frames (integers, optional)
 */
export function createLocation(payload) {
  return beepConnection.post("/locations", payload);
}

/** GET /api/locations/{id} */
export function getLocation(id) {
  return beepConnection.get(`/locations/${id}`);
}

/** PUT /api/locations/{id} */
export function updateLocation(id, payload) {
  return beepConnection.put(`/locations/${id}`, payload);
}

/** DELETE /api/locations/{id} */
export function deleteLocation(id) {
  return beepConnection.delete(`/locations/${id}`);
}
