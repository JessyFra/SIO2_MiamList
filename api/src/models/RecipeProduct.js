const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const RecipeProduct = sequelize.define(
        "RecipeProduct",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.FLOAT,
                defaultValue: 1,
            },
            recipeId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Recipe",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            productId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Product",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        },
        {
            tableName: "recipe_product",
            timestamps: false,
        },
    );

    RecipeProduct.associate = (db) => {
        RecipeProduct.belongsTo(db.Recipe, {
            foreignKey: "recipeId",
            onDelete: "CASCADE",
            as: "recipe",
        });
        RecipeProduct.belongsTo(db.Product, {
            foreignKey: "productId",
            as: "product",
            onDelete: "CASCADE",
        });
    };

    return RecipeProduct;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeProductMinimal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: number
 *           example: 2.5
 *         recipeId:
 *           type: integer
 *           example: 1
 *         productId:
 *           type: integer
 *           example: 1
 *     RecipeProductFull:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: number
 *           example: 2.5
 *         recipeId:
 *           type: integer
 *           example: 1
 *         product:
 *           $ref: '#/components/schemas/Product'
 */
