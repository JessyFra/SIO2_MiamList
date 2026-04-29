const itemListService = require("../services/itemListService");

exports.createByShoppingListId = async (req, res) => {
    try {
        req.body.shoppingListId = req.params.id;
        if (
            req.body.quantity === undefined ||
            req.body.quantity === undefined ||
            !req.body.productId
        ) {
            return res.status(400).json({
                error: "Parameters 'quantity', 'checked' and 'productId' required",
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
        if (error.code === "RECIPE_NOT_FOUND") {
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
