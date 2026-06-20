import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const DEVICE_KEY = process.env.BEEP_DEVICE_KEY;
const API_TOKEN = process.env.BEEP_API_TOKEN;
const API_BASE = "https://api.beep.nl/api";
const INTERVAL_MS = 1 * 60 * 1000;

if (!DEVICE_KEY || !API_TOKEN) {
  console.error(
    "Missing BEEP_DEVICE_KEY or BEEP_API_TOKEN in localKeys.env.local",
  );
  process.exit(1);
}

function randomBetween(min, max, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

let weightBase = 32.0;
let tempBase = 34.5;

function generateMeasurements() {
  weightBase += randomBetween(-0.3, 0.3);
  tempBase += randomBetween(-0.5, 0.5);

  return {
    w_v: parseFloat(weightBase.toFixed(2)),
    t: parseFloat(tempBase.toFixed(1)),
    t_0: parseFloat((tempBase - randomBetween(0.5, 2.0)).toFixed(1)),
    h: randomBetween(55, 80),
    bv: randomBetween(3.6, 4.2),
  };
}

async function sendMeasurements() {
  const data = generateMeasurements();
  const params = new URLSearchParams({ key: DEVICE_KEY, ...data });
  const url = `${API_BASE}/sensors?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const text = await res.text();
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] Status: ${res.status} | Response: ${text}`);
    console.log(`             Sent:`, data);
  } catch (err) {
    console.error("Request failed:", err.message);
  }
}

console.log("BEEP Sensor Simulator starting...");
console.log(`Device key: ${DEVICE_KEY}`);
console.log(`Interval: ${INTERVAL_MS / 1000}s`);
console.log("─".repeat(50));

sendMeasurements();
setInterval(sendMeasurements, INTERVAL_MS);
