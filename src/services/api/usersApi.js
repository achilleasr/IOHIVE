import beepConnection from "@/services/beepConnection";

export function getMe() {
  return beepConnection.get("/users/me");
}

export function updateUser(id, payload) {
  return beepConnection.put(`/users/${id}`, payload);
}
