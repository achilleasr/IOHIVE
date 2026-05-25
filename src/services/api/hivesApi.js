import beepConnection from "@/services/beepConnection";

export function createHive(payload) {
  return beepConnection.post("/hives", payload);
}

export function getHive(id) {
  return beepConnection.get(`/hives/${id}`);
}

export function updateHive(id, payload) {
  return beepConnection.put(`/hives/${id}`, payload);
}

export function deleteHive(id) {
  return beepConnection.delete(`/hives/${id}`);
}
