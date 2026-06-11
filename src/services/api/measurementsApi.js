import beepConnection from "@/services/beepConnection";

export function getSensorMeasurements(params = {}) {
  return beepConnection.get("/sensors/measurements", { params });
}

export function getSensorLastValues() {
  return beepConnection.get("/sensors/lastvalues");
}
