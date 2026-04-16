import beepApi from "./beepApi";

export const fetchLocations = () =>
  beepApi.get("/locations").then((r) => r.data);

export const fetchGroups = () => beepApi.get("/groups").then((r) => r.data);

export const fetchDevices = () => beepApi.get("/devices").then((r) => r.data);
