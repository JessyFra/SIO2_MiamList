const { ShoppingList } = require("../models");
const shoppingListService = require("../services/shoppingListService");

// GET /lists
exports.getAll = async (req, res) => {
    try {
        const shoppingLists = await shoppingListService.getAll(req.user.id);
        return res.status(200).json(shoppingLists);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /lists/:id
exports.getOne = async (req, res) => {
    try {
        const shoppingList = await shoppingListService.getOne(
            req.params.id,
            req.user.id,
        );
        return res.json(shoppingList);
    } catch (error) {
        if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else if (error.code === "SHOPPING_LIST_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};

// POST /lists
exports.create = async (req, res) => {
    try {
        const shoppingList = await shoppingListService.create(
            req.body,
            req.user,
        );
        return res.status(201).json(shoppingList);
    } catch (error) {
        if (error.code === "BAD_REQUEST") {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};

// PUT /lists/:id
exports.update = async (req, res) => {
    try {
        const shoppingList = await shoppingListService.update(
            req.params.id,
            req.body,
            req.user.id,
        );
        return res.json(shoppingList);
    } catch (error) {
        if (error.code === "BAD_REQUEST") {
            return res.status(400).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else if (error.code === "SHOPPING_LIST_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};

// DELETE /lists/:id
exports.remove = async (req, res) => {
    try {
        const shoppingList = await shoppingListService.delete(
            req.params.id,
            req.user.id,
        );
        return res.status(200).json(shoppingList);
    } catch (error) {
        if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else if (error.code === "SHOPPING_LIST_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};
