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

    const doc = {
      beepInspectionId: body.beepInspectionId || null,
      hiveId,
      hiveName: body.hiveName || "",
      apiaryId: body.apiaryId == null ? null : Number(body.apiaryId),
      date: body.date,
      observedState: body.observedState,
      mutation: body.mutation || null,
      resultingState: body.resultingState,
      createdAt: new Date().toISOString(),
    };

    const db = await getDb();
    const result = await db.collection("inspections").insertOne(doc);

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
