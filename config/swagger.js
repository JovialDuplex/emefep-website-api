const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "EMEFEP Website API",
      version: "1.0.0",
      description: "Documentation de l'API du site web de l'EMEFEP.",
    },
    servers: [
      {
        url: "/",
        description: "Serveur courant (Netlify ou local)",
      },
    ],
    tags: [
      { name: "Accueil", description: "Informations générales de l'API" },
      { name: "Catégories", description: "Gestion des catégories" },
      { name: "Services", description: "Gestion des services" },
      { name: "Membres", description: "Gestion des membres" },
      { name: "Statistiques", description: "Gestion des statistiques" },
      { name: "Utilisateurs", description: "Endpoints utilisateur" },
    ],
    components: {
      schemas: {
        ApiResponse: {
          type: "object",
          description: "Format commun des réponses JSON. Les propriétés additionnelles dépendent de l'endpoint.",
          properties: {
            message: { type: "string", example: "Opération effectuée avec succès" },
            status: { type: "integer", example: 200 },
          },
          additionalProperties: true,
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            category_name: { type: "string", maxLength: 150, example: "Nos activités" },
            category_desc: { type: "string", example: "Description de la catégorie" },
            category_slug: { type: "string", example: "@nos-activites" },
            category_image_preview: { type: "string", example: "/uploads/category/image.jpg" },
          },
        },
        Service: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            service_name: { type: "string", maxLength: 150 },
            service_desc: { type: "string", maxLength: 500 },
            service_image: { type: "string" },
            service_details: { type: "object", additionalProperties: true },
            service_category: { type: "string", example: "1" },
            service_slug: { type: "string" },
          },
        },
        Member: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            member_name: { type: "string", maxLength: 150 },
            member_role: { type: "string", maxLength: 200 },
            member_experience: { type: "number" },
            member_bio: { type: "string" },
            member_phone: { type: "string", maxLength: 30 },
            member_email: { type: "string", format: "email", maxLength: 150 },
            member_image: { type: "string" },
            member_category: { type: "integer" },
          },
        },
        CompanyStat: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            stat_label: { type: "string", maxLength: 150 },
            stat_value: { type: "string", maxLength: 16 },
          },
        },
        ValidationError: {
          allOf: [
            { $ref: "#/components/schemas/ApiResponse" },
            {
              type: "object",
              properties: {
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      path: { oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] },
                    },
                  },
                },
              },
            },
          ],
        },
      },
      responses: {
        BadRequest: {
          description: "Requête invalide ou champs obligatoires manquants.",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } } },
        },
        NotFound: {
          description: "Ressource introuvable.",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } },
        },
        ServerError: {
          description: "Erreur interne du serveur.",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } },
        },
        Success: {
          description: "Requête traitée avec succès.",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } },
        },
      },
    },
  },
  apis: [__dirname + "/../routes/*.js"],
};

module.exports = swaggerJsdoc(options);
