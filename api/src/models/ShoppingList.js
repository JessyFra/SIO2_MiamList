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
            through: "ListItem",
            foreignKey: "listId",
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
 *           example: "Anniversaire Nathan"
 */
