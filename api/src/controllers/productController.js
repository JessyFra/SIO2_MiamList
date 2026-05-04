const productService = require("../services/productService");

exports.create = async (req, res) => {
    if (!req.body.label) {
        return res.status(400).json({ error: "Parameters 'label' required" });
    }

    try {
        const product = await productService.create(req.body, req.user);
        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    if (!req.user.id || !req.body.label || !req.body.unit || !req.params.id) {
        return res.status(400).json({
            error: "Parameters 'label' and 'unit' required",
        });
    }

    req.body.id = req.params.id;
    req.body.userId = req.user.id;

    try {
        const product = await productService.update(req.body);
        res.status(200).json(product);
    } catch (error) {
        if (error.code === "PRODUCT_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.get = async (req, res) => {
    try {
        const product = await productService.get(req.params.id, req.user);
        res.status(200).json(product);
    } catch (error) {
        if (error.code === "PRODUCT_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.getAll = async (req, res) => {
    try {
        const products = await productService.getAll(req.user, req.query);
        res.status(200).json(products);
    } catch (error) {
        if (error.code === "PRODUCT_NOT_FOUND") {
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
        const product = await productService.delete(req.params.id, req.user);
        res.status(200).json(product);
    } catch (error) {
        if (error.code === "PRODUCT_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        } else if (error.code === "FORBIDDEN") {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
