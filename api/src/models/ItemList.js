const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const ItemList = sequelize.define(
        "ItemList",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            quantity: { type: DataTypes.FLOAT, defaultValue: 1 },
            checked: { type: DataTypes.BOOLEAN, defaultValue: false },
        },
        { tableName: "item_list" },
    );

    ItemList.associate = (db) => {
        ItemList.belongsTo(db.Product, {
            foreignKey: "productId",
            as: "product",
        });
        ItemList.belongsTo(db.ShoppingList, {
            foreignKey: "shoppingId",
            as: "shoppingList",
        });
    };

    return ItemList;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemListMinimal:
 *       properties:
 *         quantity:
 *           type: number
 *           example: 1.5
 *         checked:
 *           type: boolean
 *           example: 0
 *         createdAt:
 *           type: date-time
 *           example: 1970-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: date-time
 *           example: 1970-01-01T00:00:00.000Z
 *         productId:
 *           type: integer
 *           example: 1
 *         shoppingId:
 *           type: integer
 *           example: 1
 *     ItemListFull:
 *       properties:
 *         quantity:
 *           type: number
 *           example: 1.5
 *         checked:
 *           type: boolean
 *           example: 0
 *         createdAt:
 *           type: date-time
 *           example: 1970-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: date-time
 *           example: 1970-01-01T00:00:00.000Z
 *         shoppingId:
 *           type: integer
 *           example: 1
 *         product:
 *           $ref: '#/components/schemas/Product'
 */
