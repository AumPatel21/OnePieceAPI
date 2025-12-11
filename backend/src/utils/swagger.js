import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'One Piece API',
            version: '1.0.0'
        },
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-KEY'
                }
            }
        },
        security: [
            { ApiKeyAuth: [] }
        ]
    },
    apis: ["./src/docs/openapi.yaml"],
}

// log the merged definition for debugging if swagger-jsdoc still errors
console.log('swagger-jsdoc definition:', JSON.stringify(options.definition, null, 2));

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}