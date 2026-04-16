import beepApi from "./beepApi";

export const loginUser = (email, password) =>
  beepApi.post("/login", { email, password }).then((r) => r.data);
