const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ShoppingList = sequelize.define(
        "ShoppingList",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: { type: DataTypes.STRING(191), allowNull: false },
        },
        { tableName: "shopping_list" },
    );

    ShoppingList.associate = (db) => {
        ShoppingList.belongsTo(db.User, { foreignKey: "userId" });
        ShoppingList.belongsToMany(db.Product, {
            through: "ItemList",
            foreignKey: "shoppingId",
        });
    };

    return ShoppingList;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ShoppingList:
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Anniversaire Nathan
 *         createdAt:
 *           type: string
 *           example: 1970-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           example: 1970-01-01T00:00:00.000Z
 *         userId:
 *           type: integer
 *           example: 1
 */
