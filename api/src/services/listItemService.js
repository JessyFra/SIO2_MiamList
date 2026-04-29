const { Product, User } = require("../models");

exports.create = async (data, user_p) => {
    const user = await User.findByPk(user_p.id);
    const product = await Product.create({
        label: data.label,
        quantity: data.quantity ?? null,
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

    console.log(product);
    if (user.id !== product.userId) {
        const error = new Error("An user can only see his own product");
        error.code = "FORBIDDEN";
        throw error;
    }
    return product;
};

exports.getAll = async (user) => {
    const products = await Product.findAll({
        where: {
            userId: user.id,
        },
    });
    return products;
};

exports.update = async (data) => {
    const product = await Product.findByPk(data.id);
    console.log(data); // { label: 'Lait', quantity: 1.5, unit: 'Litre', id: '500', userId: 3 }
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
        quantity: data.quantity,
        unit: data.unit,
    });
    return product;
};
