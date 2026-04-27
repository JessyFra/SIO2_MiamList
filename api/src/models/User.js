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
        User.hasMany(db.Product, { foreignKey: "userId", onDelete: "CASCADE" });
        User.hasMany(db.Recipe, { foreignKey: "userId", onDelete: "CASCADE" });
        User.hasMany(db.ShoppingList, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });
    };

    return User;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: "user"
 *         email:
 *           type: string
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           example: "user"
 */
