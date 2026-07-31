const { MongoClient } = require("mongodb");

let clientPromise = null;

function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });
    clientPromise = client.connect();
  }
  return clientPromise;
}

async function getDb() {
  const client = await getClient();
  return client.db("iohive");
}

const FRAME_KEYS = ["eggs", "larvae", "brood", "honey", "pollen", "empty"];

function r1(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : 0;
}

// per-frame difference between two states
function diffStates(from, to) {
  if (!from || !to) return null;
  const frames = {};
  for (const k of FRAME_KEYS) frames[k] = r1(r1(to[k]) - r1(from[k]));
  return { frames, totalFrames: r1(r1(to.totalFrames) - r1(from.totalFrames)) };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }
  if (event.httpMethod !== "POST") {
    return respond(405, { error: "Method not allowed" });
  }
  if (!process.env.MONGODB_URI) {
    return respond(500, { error: "MONGODB_URI is not set" });
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const hiveId = Number(body.hiveId);
    if (!Number.isFinite(hiveId)) {
      return respond(400, { error: "Missing or invalid hiveId" });
    }
    if (!body.date) return respond(400, { error: "Missing date" });
    if (!body.observedState) {
      return respond(400, { error: "Missing observedState" });
    }
    if (!body.resultingState) {
      return respond(400, { error: "Missing resultingState" });
    }

    const db = await getDb();
    const col = db.collection("inspections");

    const previous = await col.findOne(
      { hiveId, date: { $lt: body.date } },
      { sort: { date: -1 } },
    );
    const previousFinal = previous
      ? previous.resultingState || previous.observedState
      : null;

    const deltas = {};
    if (previousFinal) {
      deltas.fromPrevious = {
        previousInspectionId: previous._id.toString(),
        ...diffStates(previousFinal, body.observedState),
      };
    }
    if (body.mutation) {
      deltas.fromObservation = diffStates(
        body.observedState,
        body.resultingState,
      );
    }

    const doc = {
      beepInspectionId: body.beepInspectionId || null,
      hiveId,
      hiveName: body.hiveName || "",
      apiaryId: body.apiaryId == null ? null : Number(body.apiaryId),
      date: body.date,
      observedState: body.observedState,
      mutation: body.mutation || null,
      resultingState: body.resultingState,
      deltas,
      createdAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return respond(201, { id: result.insertedId.toString(), ok: true });
  } catch (err) {
    console.error("saveInspection error:", err);
    return respond(500, { error: "Internal server error" });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
