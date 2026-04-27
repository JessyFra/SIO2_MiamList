const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const RecipeProduct = sequelize.define(
        "RecipeProduct",
        {
            quantity: { type: DataTypes.FLOAT, defaultValue: 1 },
        },
        { tableName: "recipe_product" },
    );

    return RecipeProduct;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeProduct:
 *       properties:
 *         quantity:
 *           type: number
 *           example: 2.5
 */
