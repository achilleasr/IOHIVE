import axios from "axios";
import store from "@/store";

const beepApi = axios.create({
  baseURL: "https://api.beep.nl/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-language": "en",
  },
  timeout: 10000,
});

beepApi.interceptors.request.use((config) => {
  const token = store.state.loginData?.api_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default beepApi;
