import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "School Equipment Lending API",
      version: "1.0.0",
      description: "Phase 2"
    },
    servers: [{ url: "http://localhost:4000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "user_123" },
            name: { type: "string", example: "Alice" },
            email: { type: "string", example: "alice@example.com" },
            role: { type: "string", enum: ["student", "admin"], example: "student" }
          },
          required: ["id", "name", "email", "role"]
        },
        Equipment: {
          type: "object",
          properties: {
            id: { type: "string", example: "equip_456" },
            name: { type: "string", example: "Projector" },
            status: { type: "string", enum: ["available", "unavailable"], example: "available" },
            description: { type: "string", example: "Epson XGA projector" }
          },
          required: ["id", "name", "status"]
        },
        BorrowRequest: {
          type: "object",
          properties: {
            id: { type: "string", example: "req_789" },
            userId: { type: "string", example: "user_123" },
            equipmentId: { type: "string", example: "equip_456" },
            status: { type: "string", enum: ["pending", "approved", "rejected", "returned"], example: "pending" },
            requestDate: { type: "string", format: "date-time", example: "2024-06-13T12:34:56Z" },
            returnDate: { type: "string", format: "date-time", example: "2024-06-20T12:34:56Z" }
          },
          required: ["id", "userId", "equipmentId", "status", "requestDate"]
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  // Use absolute path so that the glob resolves in both dev/src and prod/dist
  apis: [path.resolve(process.cwd(), "src/routes/*.ts")]
};

export const swaggerSpec = swaggerJSDoc(options);