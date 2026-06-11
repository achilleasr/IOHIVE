import beepConnection from "@/services/beepConnection";

export function listInspectionsForHive(hiveId) {
  return beepConnection.get(`/inspections/hive/${hiveId}`);
}

export function createInspection(payload) {
  return beepConnection.post("/inspections", payload);
}

export function deleteInspection(id) {
  return beepConnection.delete(`/inspections/${id}`);
}
