const recipeProductService = require("../services/recipeProductService");

exports.getByRecipeId = async (req, res) => {
    try {
        const recipeProducts = await recipeProductService.getByRecipeId(
            req.params.id,
            req.user,
        );
        res.status(200).json(recipeProducts);
    } catch (error) {
        if (error.code === "RECIPE_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.create = async (req, res) => {
    if (!req.body.productId) {
        return res
            .status(400)
            .json({ error: "Parameters 'productId' required" });
    }
    req.body.id = req.params.id;
    try {
        const recipeProduct = await recipeProductService.create(
            req.body,
            req.user,
        );
        return res.status(recipeProduct.code).json(recipeProduct.data);
    } catch (error) {
        if (error.code === "RECIPE_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else if (error.code === "PRODUCT_NOT_FOUND") {
            return res.status(403).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

exports.patchQuantity = async (req, res) => {
    if (!req.body.quantity) {
        return res.status(400).json({
            error: "Parameters 'quantity' required",
        });
    }

    req.body.id = req.params.id;

    try {
        const product = await recipeProductService.updateQuantity(
            req.body,
            req.user,
        );
        res.status(200).json(product);
    } catch (error) {
        if (error.code === "RECIPE_PRODUCT_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.delete = async (req, res) => {
    try {
        const recipeProduct = await recipeProductService.delete(
            req.params.id,
            req.user,
        );
        res.status(200).json(recipeProduct);
    } catch (error) {
        if (error.code === "RECIPE_PRODUCT_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
