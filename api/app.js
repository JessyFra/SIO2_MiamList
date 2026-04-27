require("dotenv").config();
const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const fs = require("fs");
const path = require("path");

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

const routesPath = path.join(__dirname, "src/routes");

fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith(".js")) {
        app.use("/api", require(path.join(routesPath, file)));
    }
});

module.exports = app;
