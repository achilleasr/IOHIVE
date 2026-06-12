import beepConnection from "@/services/beepConnection";

export function listChecklists() {
  return beepConnection.get(`/checklists`);
}

export function listChecklist(id) {
  return beepConnection.get(`/checklists/${id}`);
}
