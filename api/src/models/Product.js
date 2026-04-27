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
        },
        { tableName: "product" },
    );

    Product.associate = (db) => {
        Product.belongsTo(db.User, { foreignKey: "userId" });
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
