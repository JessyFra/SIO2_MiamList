const { Product, RecipeProduct, Recipe } = require("../models");

exports.getByRecipeId = async (id, user) => {
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
        const error = new Error("Recipe not found");
        error.code = "RECIPE_NOT_FOUND";
        throw error;
    }

    if (user.id !== recipe.userId) {
        const error = new Error("An user can only see his own recipe");
        error.code = "FORBIDDEN";
        throw error;
    }

    const recipeProducts = await RecipeProduct.findAll({
        where: {
            recipeId: id,
        },
        include: [
            {
                model: Product,
                as: "product",
            },
        ],
        attributes: { exclude: ["productId"] },
    });
    return recipeProducts;
};

exports.create = async (body, user) => {
    const recipe = await Recipe.findOne({
        where: {
            userId: body.id,
        },
    });
    if (!recipe) {
        const error = new Error("Recipe not found");
        error.code = "RECIPE_NOT_FOUND";
        throw error;
    }

    const product = await Product.findByPk(body.productId);
    if (!product) {
        const error = new Error("Product not found");
        error.code = "PRODUCT_NOT_FOUND";
        throw error;
    }

    if (user.id !== recipe.userId) {
        const error = new Error("An user can only modify his own recipe");
        error.code = "FORBIDDEN";
        throw error;
    }

    const recipeProduct = await RecipeProduct.findOne({
        where: {
            recipeId: body.id,
            productId: body.productId,
        },
    });
    if (recipeProduct) {
        await recipeProduct.update({
            quantity: recipeProduct.quantity + body.quantity,
        });
        return { data: recipeProduct, code: 200 };
    }

    const newRecipeProduct = await RecipeProduct.create({
        quantity: body.quantity ?? null,
        recipeId: body.id,
        productId: body.productId,
    });

    return { data: newRecipeProduct, code: 201 };
};

exports.updateQuantity = async (body, user) => {
    const recipeProduct = await RecipeProduct.findByPk(body.id);
    if (!recipeProduct) {
        const error = new Error("Recipe-Product not found");
        error.code = "RECIPE_PRODUCT_NOT_FOUND";
        throw error;
    }

    const recipe = await Recipe.findByPk(recipeProduct.recipeId);

    if (user.id !== recipe.userId) {
        const error = new Error("An user can only modify his own recipe");
        error.code = "FORBIDDEN";
        throw error;
    }

    await recipeProduct.update({
        quantity: body.quantity,
    });

    return recipeProduct;
};

exports.delete = async (id, user) => {
    const recipeProduct = await RecipeProduct.findByPk(id);
    if (!recipeProduct) {
        const error = new Error("Recipe-Product not found");
        error.code = "RECIPE_PRODUCT_NOT_FOUND";
        throw error;
    }

    const recipe = await Recipe.findByPk(recipeProduct.recipeId);
    if (user.id !== recipe.userId) {
        const error = new Error("An user can only delete his own recipe");
        error.code = "FORBIDDEN";
        throw error;
    }

    await recipeProduct.destroy();
    return recipeProduct;
};
