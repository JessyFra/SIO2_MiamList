const { Product, User } = require("../models");
const { Op, sequelize } = require("sequelize");

exports.create = async (data, user_p) => {
    const user = await User.findByPk(user_p.id);
    const product = await Product.create({
        label: data.label,
        unit: data.unit ?? null,
    });
    await product.update({ userId: user.id });
    return product;
};
exports.delete = async (id, currentUser) => {
    const product = await Product.findByPk(id, null);

    if (!product) {
        const error = new Error("Product not found");
        error.code = "PRODUCT_NOT_FOUND";
        throw error;
    }

    if (currentUser.id !== product.userId) {
        const error = new Error("An user can only delete his own product");
        error.code = "FORBIDDEN";
        throw error;
    }

    await product.destroy();
    return product;
};

exports.get = async (id, user) => {
    const product = await Product.findByPk(id, null);
    if (!product) {
        const error = new Error("Product not found");
        error.code = "PRODUCT_NOT_FOUND";
        throw error;
    }

    if (user.id !== product.userId) {
        const error = new Error("An user can only see his own product");
        error.code = "FORBIDDEN";
        throw error;
    }
    return product;
};

exports.getAll = async (user, query) => {
    const label = query.label ?? "";

    const where = { userId: user.id };

    if (label) {
        where.label = {
            [Op.like]: `%${label}%`,
        };
    }

    const products = await Product.findAll({ where });

    return products;
};

exports.update = async (data) => {
    const product = await Product.findByPk(data.id);
    if (!product) {
        const error = new Error("Product not found");
        error.code = "PRODUCT_NOT_FOUND";
        throw error;
    }

    if (data.userId !== product.userId) {
        const error = new Error("An user can only modify his own product");
        error.code = "FORBIDDEN";
        throw error;
    }

    await product.update({
        label: data.label,
        unit: data.unit,
    });
    return product;
};
