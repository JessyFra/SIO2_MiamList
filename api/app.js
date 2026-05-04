require("dotenv").config();
const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const authRoutes = require("./src/routes/authRoutes");
const recipeRoutes = require("./src/routes/recipeRoutes");
const recipeProductRoutes = require("./src/routes/recipeProductRoutes");
const productRoutes = require("./src/routes/productRoutes");
const shoppingListRoutes = require("./src/routes/shoppingListRoutes");
const itemListRoutes = require("./src/routes/itemListRoutes");

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

app.use(
    "/api/doc",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerOptions),
);

app.get("/api/doc.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

app.use("/api", authRoutes);
app.use("/api", recipeRoutes);
app.use("/api", productRoutes);
app.use("/api", recipeProductRoutes);
app.use("/api", shoppingListRoutes);
app.use("/api", itemListRoutes);

module.exports = app;
