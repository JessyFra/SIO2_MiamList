const { Product, User, ShoppingList, ItemList } = require("../models");

exports.createByShoppingListId = async (data, user_p) => {
    const user = await User.findByPk(user_p.id);

    const shoppingList = await ShoppingList.findByPk(data.shoppingListId);

    if (!shoppingList) {
        const error = new Error("Shopping list not found");
        error.code = "SHOPPING_LIST_NOT_FOUND";
        throw error;
    }

    const product = await Product.findByPk(data.productId);

    if (!product) {
        const error = new Error("Product not found");
        error.code = "PRODUCT_NOT_FOUND";
        throw error;
    }

    if (shoppingList.userId !== user.id) {
        const error = new Error(
            "An user can only add an item in his own shopping list",
        );
        error.code = "FORBIDDEN";
        throw error;
    }

    const itemList = await ItemList.findOne({
        where: {
            productId: data.productId,
            shoppingId: parseInt(data.shoppingListId),
        },
    });
    if (itemList) {
        await itemList.update({
            quantity: itemList.quantity + (data.quantity ?? 1),
        });
        return { data: itemList, code: 200 };
    }
    itemList = await ItemList.create({
        quantity: data.quantity ?? 1,
        checked: data.checked ?? false,
        shoppingId: parseInt(data.shoppingListId),
        productId: data.productId,
    });
    return { data: itemList, code: 201 };
};

exports.getAllByShoppingListId = async (id, user_p) => {
    const user = await User.findByPk(user_p.id);

    const shoppingList = await ShoppingList.findByPk(id);

    if (!shoppingList) {
        const error = new Error("Shopping list not found");
        error.code = "SHOPPING_LIST_NOT_FOUND";
        throw error;
    }

    if (shoppingList.userId !== user.id) {
        const error = new Error("An user can only see his own products list");
        error.code = "FORBIDDEN";
        throw error;
    }

    const itemLists = await ItemList.findAll({
        where: {
            shoppingId: id,
        },
        include: [
            {
                model: Product,
                as: "product",
            },
        ],
        attributes: { exclude: ["productId"] },
    });
    return itemLists;
};
