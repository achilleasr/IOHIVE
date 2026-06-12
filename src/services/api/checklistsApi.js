import beepConnection from "@/services/beepConnection";

/**
 * BEEP checklist endpoints — verified against the official beep-vue-app source.
 *
 * Gotchas baked in here:
 *  - LISTING all checklists is NOT `GET /checklists`. It is `GET /inspections/lists`,
 *    which returns { checklists: [...], checklist: <the user's default> }.
 *  - Reading ONE full checklist (with its category tree + taxonomy) IS
 *    `GET /checklists/{id}` — but only for a checklist the user owns. A bad or
 *    non-owned id returns 404. (This is the 404 you were hitting.)
 *  - CREATE/UPDATE send `categories` as a COMMA-SEPARATED STRING of category ids
 *    (e.g. "12,45,698"), not an array.
 */

/**
 * GET /api/inspections/lists
 * Returns { checklists: [...summary...], checklist: <default checklist> }.
 * Use this to populate the checklist picker. Optionally scoped to a hive via ?hive_id=.
 */
export function listChecklists(hiveId) {
  const config = hiveId ? { params: { hive_id: hiveId } } : {};
  return beepConnection.get("/inspections/lists", config);
}

/**
 * GET /api/checklists/{id}
 * The checklist as the EDITOR needs it: flat `category_ids` + a `taxonomy` pool.
 * NB: this does NOT contain a ready-to-render nested category tree.
 * 404 if the id is unknown or not owned by the user.
 * Used by the checklist manager.
 */
export function getChecklist(id) {
  return beepConnection.get(`/checklists/${id}`);
}

/**
 * GET /api/inspections/lists?id={id}
 * The checklist as the INSPECTION FORM needs it. Returns
 *   { checklist: { id, name, owner, category_ids, categories: [ <nested tree> ] } }
 * where `categories` is the fully-built nested tree of sections -> inputs that
 * you actually render a dynamic form from. (This is the missing piece: the
 * editor endpoint /checklists/{id} has no renderable `categories` tree.)
 */
export function getChecklistForInspection(id) {
  return beepConnection.get("/inspections/lists", { params: { id } });
}

/**
 * POST /api/checklists
 * payload: { name, categories: "1,2,3" (csv of category ids), owner: true }
 * Returns { checklist_id }.
 */
export function createChecklist({ name, categoryIds = [], owner = true }) {
  return beepConnection.post("/checklists", {
    name,
    categories: categoryIds.length ? categoryIds.join(",") : null,
    owner,
  });
}

/**
 * PUT /api/checklists/{id}
 * payload: { id, name, categories: "1,2,3" }
 */
export function updateChecklist(id, { name, categoryIds = [] }) {
  return beepConnection.put(`/checklists/${id}`, {
    id,
    name,
    categories: categoryIds.length ? categoryIds.join(",") : null,
  });
}

/** DELETE /api/checklists/{id} */
export function deleteChecklist(id) {
  return beepConnection.delete(`/checklists/${id}`);
}

/**
 * GET /api/categories
 * The full tree of available inspection categories (sections -> list -> list_item).
 * Each node: { id, name, type, input, trans:{en,...}, description, source, children:[...] }.
 * This is what the "Edit checklist" item picker chooses from.
 */
export function listCategories() {
  return beepConnection.get("/categories");
}

/** GET /api/categoryinputs — the available input types (reference/debug). */
export function listCategoryInputs() {
  return beepConnection.get("/categoryinputs");
}
