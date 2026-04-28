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
            quantity: { type: DataTypes.FLOAT, defaultValue: 1 },
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
            foreignKey: "productId",
        });
        Product.belongsToMany(db.ShoppingList, {
            through: "ListItem",
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
 *         quantity:
 *           type: number
 *           example: 1.5
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
 */
