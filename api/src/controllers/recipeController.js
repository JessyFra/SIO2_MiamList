const { Recipe } = require("../models");

exports.getAll = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            where: { userId: req.user.id }
        });
        return res.json(recipes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        return res.json(recipe);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Parameters 'name' is required" });
        }
        const recipe = await Recipe.create({
            name,
            description,
            userId: req.user.id
        });
        return res.status(201).json(recipe);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        await recipe.update(req.body);
        return res.json(recipe);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        await recipe.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
