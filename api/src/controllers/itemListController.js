const itemListService = require("../services/itemListService");

exports.createByShoppingListId = async (req, res) => {
    try {
        req.body.shoppingListId = req.params.id;
        if (
            req.body.quantity === undefined ||
            req.body.quantity === undefined
        ) {
            return res.status(400).json({
                error: "Parameters 'quantity' and 'checked' are required",
            });
        }
        if (
            req.body.productId !== undefined &&
            req.body.recipeId !== undefined
        ) {
            return res.status(400).json({
                error: "At least one of 'productId' or 'recipeId' is required",
            });
        }

        if (req.body.productId && req.body.recipeId) {
            return res.status(400).json({
                error: "'productId' and 'recipeId' cannot be present at the same time",
            });
        }

        if (req.body.quantity === 0) {
            return res.status(400).json({
                error: "Quantity cannot be < 0",
            });
        }
        const itemList = await itemListService.createByShoppingListId(
            req.body,
            req.user,
        );
        res.status(itemList.code).json(itemList.data);
    } catch (error) {
        if (
            error.code === "RECIPE_NOT_FOUND" ||
            error.code === "SHOPPING_LIST_NOT_FOUND"
        ) {
            return res.status(404).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.getAllByShoppingListId = async (req, res) => {
    try {
        const itemList = await itemListService.getAllByShoppingListId(
            req.params.id,
            req.user,
        );
        res.status(200).json(itemList);
    } catch (error) {
        if (error.code === "SHOPPING_LIST_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.patch = async (req, res) => {
    try {
        if (req.body.productId || req.body.shoppingId) {
            return res
                .status(400)
                .json("Parameters 'shoppingId' and 'productId' are forbidden");
        }
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json("Patch require parameters");
        }
        req.body.id = req.params.id;
        const itemList = await itemListService.patch(req.body, req.user);
        res.status(200).json(itemList);
    } catch (error) {
        if (error.code === "ITEM_LIST_NOT_FOUND") {
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
        const itemList = await itemListService.delete(req.params.id, req.user);
        res.status(200).json(itemList);
    } catch (error) {
        if (error.code === "ITEM_LIST_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
