const { Router } = require("express");
const categoryRouter = require("./categoryRoutes");
const statRouter = require("./statRoutes");
const memberRouter = require("./memberRoutes");
const serviceRouter = require("./serviceRoutes");
const userRouter = require("./userRoutes");

const mainRouter = Router();

mainRouter.use("/category", categoryRouter);
mainRouter.use("/stat", statRouter);
mainRouter.use("/member", memberRouter);
mainRouter.use("/service", serviceRouter);
mainRouter.use("/user", userRouter)
mainRouter.get("/", (request, response) => {
  response.json({
    "api-name": "emefep-website-api",
    version: "1.0.0",
    description: "API pour le site web de l'EMEFEP",
    message: "welcome to emefep api",
  });
});

mainRouter.get("/endpoints", (request, response) => {
  response.json({
    endpoints: [
      {
        endpoint: "/api/category",
        method: "GET",
        description: "Recuperation des categories",
      },
      {
        endpoint: "/api/category",
        method: "POST",
        description: "Creation d'une category",
      },
      {
        endpoint: "/api/category",
        method: "PUT",
        description: "Mise a jour d'une category",
      },
      {
        endpoint: "/api/category",
        method: "DELETE",
        description: "Recuperation des categories",
      },
    ],
  });
});

module.exports = mainRouter;
