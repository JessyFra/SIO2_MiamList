const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RecipeProduct = sequelize.define("RecipeProduct", {
    quantity: { type: DataTypes.FLOAT, defaultValue: 1 },
});

module.exports = RecipeProduct;
