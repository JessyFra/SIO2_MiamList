const { Recipe, RecipeProduct, Product } = require("../models");
const recipeService = require("../services/recipeService");

exports.getAll = async (req, res) => {
    try {
        const recipes = await recipeService.getAll(req.user.id);
        return res.status(200).json(recipes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const recipe = await recipeService.getOne(req.params.id, req.user.id);
        return res.status(200).json(recipe);
    } catch (error) {
        if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else if (error.code === "RECIPE_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};

exports.create = async (req, res) => {
    try {
        const recipe = await recipeService.create(req.body, req.user);
        return res.status(201).json(recipe);
    } catch (error) {
        if (error.code === "BAD_REQUEST") {
            return res.status(400).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else if (error.code === "PRODUCT_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};

exports.update = async (req, res) => {
    try {
        const recipe = await recipeService.update(
            req.params.id,
            req.body,
            req.user.id,
        );
        return res.status(200).json(recipe);
    } catch (error) {
        if (error.code === "BAD_REQUEST") {
            return res.status(400).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else if (error.code === "RECIPE_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const recipe = await recipeService.delete(req.params.id, req.user.id);
        return res.status(200).json(recipe);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
