import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
    definition: {},
    apis: ["./src/docs/openapi.yaml"],
}

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}