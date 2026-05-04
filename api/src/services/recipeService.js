const { Recipe, RecipeProduct, Product } = require("../models");

exports.create = async (body, user) => {
    const { name, description } = body;
    if (!name) {
        const error = new Error("Parameter 'name' is required");
        error.code = "BAD_REQUEST";
        throw error;
    }
    const recipe = await Recipe.create({
        name,
        description: description ?? null,
        userId: user.id,
    });

    let products = [];
    if (body.products) {
        // Valider d'abord
        for (const product of body.products) {
            if (!product.quantity || !product.productId) {
                const error = new Error(
                    "Element of parameter 'products' require 'quantity' and 'productId'",
                );
                error.code = "BAD_REQUEST";
                throw error;
            }

            const tempProduct = await Product.findByPk(product.productId);
            if (!tempProduct) {
                const error = new Error("Product not found");
                error.code = "PRODUCT_NOT_FOUND";
                throw error;
            } else if (tempProduct.userId !== user.id) {
                const error = new Error(
                    "An user can only use his own products",
                );
                error.code = "FORBIDDEN";
                throw error;
            }
        }

        // Fusionner les produits avec le même productId
        const mergedProducts = {};
        for (const product of body.products) {
            if (mergedProducts[product.productId]) {
                mergedProducts[product.productId].quantity += product.quantity;
            } else {
                mergedProducts[product.productId] = {
                    quantity: product.quantity,
                };
            }
        }

        // Créer les RecipeProduct fusionnés
        const createdProducts = await Promise.all(
            Object.entries(mergedProducts).map(([productId, data]) =>
                RecipeProduct.create({
                    quantity: data.quantity,
                    productId: parseInt(productId),
                    recipeId: recipe.id,
                }),
            ),
        );
        products.push(...createdProducts);
    }

    return { recipe: recipe, products: products.length };
};

exports.getOne = async (id, userId) => {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
        const error = new Error("Recipe not found");
        error.code = "RECIPE_NOT_FOUND";
        throw error;
    }

    if (recipe.userId !== userId) {
        const error = new Error("An user can only see his own recipes");
        error.code = "FORBIDDEN";
        throw error;
    }
    return recipe;
};

exports.getAll = async (userId) => {
    const recipes = await Recipe.findAll({
        where: { userId: userId },
    });
    return recipes;
};

exports.update = async (id, body, userId) => {
    if (!body.name || !body.description) {
        const error = new Error(
            "Parameters 'name' and 'description' are required",
        );
        error.code = "BAD_REQUEST";
        throw error;
    }
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
        const error = new Error("Recipe not found");
        error.code = "RECIPE_NOT_FOUND";
        throw error;
    }

    if (recipe.userId !== userId) {
        const error = new Error("An user can only update his own recipes");
        error.code = "FORBIDDEN";
        throw error;
    }
    await recipe.update({ name: body.name, description: body.description });
    return recipe;
};

exports.delete = async (id, userId) => {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
        const error = new Error("Recipe not found");
        error.code = "RECIPE_NOT_FOUND";
        throw error;
    }

    if (recipe.userId !== userId) {
        const error = new Error("An user can only delete his own recipes");
        error.code = "FORBIDDEN";
        throw error;
    }
    await recipe.destroy();
    return recipe;
};
