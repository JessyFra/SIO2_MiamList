const { ShoppingList } = require("../models");

exports.create = async (body, user) => {
    const { name } = body;
    if (!name) {
        const error = new Error("Parameter 'name' is required");
        error.code = "BAD_REQUEST";
        throw error;
    }
    const shoppingList = await ShoppingList.create({
        name,
        userId: user.id,
    });
    return shoppingList;
};

exports.getOne = async (id, userId) => {
    const shoppingList = await ShoppingList.findByPk(id);
    if (!shoppingList) {
        const error = new Error("ShoppingList not found");
        error.code = "SHOPPING_LIST_NOT_FOUND";
        throw error;
    }

    if (shoppingList.userId !== userId) {
        const error = new Error("An user can only see his own shoppingLists");
        error.code = "FORBIDDEN";
        throw error;
    }
    return shoppingList;
};

exports.getAll = async (userId) => {
    const shoppingLists = await ShoppingList.findAll({
        where: { userId: userId },
    });
    return shoppingLists;
};

exports.update = async (id, body, userId) => {
    if (!body.name) {
        const error = new Error("Parameter 'name' is required");
        error.code = "BAD_REQUEST";
        throw error;
    }
    const shoppingList = await ShoppingList.findByPk(id);

    if (!shoppingList) {
        const error = new Error("ShoppingList not found");
        error.code = "SHOPPING_LIST_NOT_FOUND";
        throw error;
    }

    if (shoppingList.userId !== userId) {
        const error = new Error(
            "An user can only update his own shoppingLists",
        );
        error.code = "FORBIDDEN";
        throw error;
    }
    await shoppingList.update({ name: body.name });
    return shoppingList;
};

exports.delete = async (id, userId) => {
    const shoppingList = await ShoppingList.findByPk(id);
    if (!shoppingList) {
        const error = new Error("ShoppingList not found");
        error.code = "SHOPPING_LIST_NOT_FOUND";
        throw error;
    }

    if (shoppingList.userId !== userId) {
        const error = new Error(
            "An user can only delete his own shoppingLists",
        );
        error.code = "FORBIDDEN";
        throw error;
    }
    await shoppingList.destroy();
    return shoppingList;
};
