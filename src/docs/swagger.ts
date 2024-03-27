import { Application, Express, Request, Response } from "express";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import { logger } from "../logger/logger";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CDW SWAG - REST APIs",
            version,
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            }
        ],
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application, port: number) {
// Swagger Page
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Docs in JSON format
app.get("docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});
};

export default swaggerDocs;