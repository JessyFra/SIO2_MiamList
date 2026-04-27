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
        });
    };

    return Recipe;
};
