import beepConnection from "@/services/beepConnection";

/**
 * GET /api/devices
 * List the user's BEEP devices (sensor stations attached to hives).
 */
export function listDevices() {
  return beepConnection.get("/devices");
}
