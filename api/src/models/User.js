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
 *     UserMinimal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         quizId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Le pensionnat de Godefroy a servi d'hôpital de guerre.
 *         isCorrect:
 *           type: boolean
 *           example: true
 *         answer:
 *           type: string
 *           example: Entre 1914 et 1919, il a accueilli environ 190 lits pour les blessés.
 */
