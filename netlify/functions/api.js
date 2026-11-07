const serverless = require("serverless-http");
const app = require("../../app");
const { connectDB, syncDB } = require("../../config/config");

let initialization;

async function initialize() {
  if (!initialization) {
    initialization = (async () => {
      await connectDB();
      // Do not use force/alter in production: run schema migrations separately.
      await syncDB();
    })().catch((error) => {
      initialization = undefined;
      throw error;
    });
  }
  return initialization;
}

const expressHandler = serverless(app);

exports.handler = async (event, context) => {
  try {
    await initialize();
  } catch (error) {
    console.error("Échec de l'initialisation de l'API Netlify :", error);
    return {
      statusCode: 503,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Service temporairement indisponible" }),
    };
  }

  return expressHandler(event, context);
};
