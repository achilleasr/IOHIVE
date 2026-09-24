import beepConnection from "@/services/beepConnection";

export function getMe() {
  return beepConnection.get("/users/me");
}

export function updateUser(id, payload) {
  return Promise.resolve({ data: { message: "Delete is temporarily disabled." } });//beepConnection.put(`/users/${id}`, payload);
}
