const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Recipe = sequelize.define(
        "Recipe",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: { type: DataTypes.STRING(191), allowNull: false },
            description: { type: DataTypes.TEXT, defaultValue: "" },
        },
        { tableName: "recipe" },
    );

    Recipe.associate = (db) => {
        Recipe.belongsTo(db.User, { foreignKey: "userId" });
        Recipe.belongsToMany(db.Product, {
            through: "RecipeProduct",
            foreignKey: "recipeId",
            as: "products",
        });
    };

    return Recipe;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeMinimal:
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Gâteau à la fraise
 *         description:
 *           type: string
 *           example: Gâteau d'anniversaire
 *         userId:
 *           type: integer
 *           example: 1
 *         createAt:
 *           type: string
 *           example: 1970-01-01T00:00:00.000Z
 *         updateAt:
 *           type: string
 *           example: 1970-01-01T00:00:00.000Z
 *     RecipeFull:
 *       allOf:
 *         - $ref: '#/components/schemas/RecipeMinimal'
 *         - type: object
 *           properties:
 *             recipeProduct:
 *               type: object
 *               $ref: '#/components/schemas/RecipeProductMinimal'
 */
