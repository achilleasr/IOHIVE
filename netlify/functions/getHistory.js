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
  if (event.httpMethod !== "GET") {
    return respond(405, { error: "Method not allowed" });
  }
  if (!process.env.MONGODB_URI) {
    return respond(500, { error: "MONGODB_URI is not set" });
  }

  try {
    const hiveId = Number(event.queryStringParameters?.hiveId);
    if (!Number.isFinite(hiveId)) {
      return respond(400, { error: "Missing or invalid hiveId" });
    }

    const db = await getDb();
    const inspections = await db
      .collection("inspections")
      .find({ hiveId })
      .sort({ date: -1 })
      .limit(50)
      .toArray();

    return respond(200, {
      inspections: inspections.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
      })),
    });
  } catch (err) {
    console.error("getHistory error:", err);
    return respond(500, { error: "Internal server error" });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };
}

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
