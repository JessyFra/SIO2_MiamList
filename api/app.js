require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: { title: "MiamList API", version: "1.0.0" },
        servers: [
            {
                url: "/api",
                description: "API base path",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/routes/*.js", "./src/models/*.js"],
});

const swaggerOptions = {
    swaggerOptions: {
        persistAuthorization: true,
    },
};

app.use("/api/doc",swaggerUi.serve,swaggerUi.setup(swaggerSpec, swaggerOptions));
app.use("/api", routes);

module.exports = app;
