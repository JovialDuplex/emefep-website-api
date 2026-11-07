const serverless = require("serverless-http");
const { initApp } = require("../../app");

let handler;

exports.handler = async (event, context) => {
  if (!handler) {
    const app = await initApp();
    handler = serverless(app, { basePath: "/.netlify/functions/api" });
  }
  return handler(event, context);
};
