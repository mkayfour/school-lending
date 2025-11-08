import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "School Equipment Lending API",
      version: "1.0.0",
      description: "Phase 1 manual implementation"
    },
    servers: [{ url: "http://localhost:4000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.ts"] // we’ll add JSDoc comments in routes
};

export const swaggerSpec = swaggerJSDoc(options);