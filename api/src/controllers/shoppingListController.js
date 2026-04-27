const { ShoppingList } = require("../models");

// GET /lists
exports.getAll = async (req, res) => {
    try {
        const lists = await ShoppingList.findAll({
            where: { userId: req.user.id },
        });
        return res.json(lists);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /lists/:id
exports.getOne = async (req, res) => {
    try {
        const list = await ShoppingList.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!list) return res.status(404).json({ error: "Liste introuvable" });
        return res.json(list);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// POST /lists
exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ error: "Le paramètre 'name' est requis" });
        }
        const list = await ShoppingList.create({ name, userId: req.user.id });
        return res.status(201).json(list);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// PUT /lists/:id
exports.update = async (req, res) => {
    try {
        const list = await ShoppingList.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!list) return res.status(404).json({ error: "Liste introuvable" });

        const { name } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ error: "Le paramètre 'name' est requis" });
        }
        await list.update({ name });
        return res.json(list);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// DELETE /lists/:id
exports.remove = async (req, res) => {
    try {
        const list = await ShoppingList.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!list) return res.status(404).json({ error: "Liste introuvable" });

        await list.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
