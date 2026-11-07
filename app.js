const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { configApp } = require("./config/config");
const mainRouter = require("./routes/index");

const app = express();
configApp(app, express);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", mainRouter);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Le serveur backend écoute sur le port ${PORT}`);
  });
}

module.exports = app;
