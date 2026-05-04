const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING(191),
                allowNull: false,
                unique: true,
            },
            password: { type: DataTypes.STRING(191), allowNull: false },
        },
        { tableName: "user" },
    );

    User.associate = (db) => {
        User.hasMany(db.Product, {
            foreignKey: "userId",
            onDelete: "CASCADE",
            as: "products",
        });
        User.hasMany(db.Recipe, {
            foreignKey: "userId",
            onDelete: "CASCADE",
            as: "recipes",
        });
        User.hasMany(db.ShoppingList, {
            foreignKey: "userId",
            onDelete: "CASCADE",
            as: "shoppingLists",
        });
    };

    return User;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UserMinimal:
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: user@example.com
 *     UserFull:
 *       allOf:
 *         - $ref: '#/components/schemas/UserMinimal'
 *         - type: object
 *           properties:
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: 2026-05-04T09:54:25.000Z
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: 2026-05-04T09:54:25.000Z
 *             products:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             recipes:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeFull'
 *             shoppingLists:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShoppingList'
 */
