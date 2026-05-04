const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Product = sequelize.define(
        "Product",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            label: { type: DataTypes.STRING(191), allowNull: false },
            unit: { type: DataTypes.STRING(50), defaultValue: "" },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        { tableName: "product" },
    );

    Product.associate = (db) => {
        Product.belongsTo(db.User, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });
        Product.belongsToMany(db.Recipe, {
            through: "RecipeProduct",
            as: "recipes",
            foreignKey: "productId",
        });
        Product.belongsToMany(db.ShoppingList, {
            through: "ItemList",
            as: "shoppingLists",
            foreignKey: "productId",
        });
    };

    return Product;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         label:
 *           type: string
 *           example: Lait
 *         unit:
 *           type: string
 *           example: L
 *         userId:
 *           type: integer
 *           example: 1
 *         createAt:
 *           type: string
 *           example: 1970-01-01T00:00:00.000Z
 *         updateAt:
 *           type: string
 *           example: 1970-01-01T00:00:00.000Z
 *     ProductFull:
 *       allOf:
 *         - $ref: '#/components/schemas/Product'
 *         - type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
