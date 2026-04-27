const sequelize = require("../config/database");
const User = require("./User");
const Product = require("./Product");
const Recipe = require("./Recipe");
const RecipeProduct = require("./RecipeProduct");
const ShoppingList = require("./ShoppingList");
const ListItem = require("./ListItem");

// Un user possède des produits, recettes et listes
User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Recipe, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(ShoppingList, { foreignKey: "userId", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "userId" });
Recipe.belongsTo(User, { foreignKey: "userId" });
ShoppingList.belongsTo(User, { foreignKey: "userId" });

// Recette <-> Produit (many-to-many via RecipeProduct)
Recipe.belongsToMany(Product, {
    through: RecipeProduct,
    foreignKey: "recipeId",
});
Product.belongsToMany(Recipe, {
    through: RecipeProduct,
    foreignKey: "productId",
});

// Liste <-> Produit (many-to-many via ListItem)
ShoppingList.belongsToMany(Product, {
    through: ListItem,
    foreignKey: "listId",
});
Product.belongsToMany(ShoppingList, {
    through: ListItem,
    foreignKey: "productId",
});

module.exports = {
    sequelize,
    User,
    Product,
    Recipe,
    RecipeProduct,
    ShoppingList,
    ListItem,
};
