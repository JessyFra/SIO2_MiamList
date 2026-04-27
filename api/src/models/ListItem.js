const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ListItem = sequelize.define(
        "ListItem",
        {
            quantity: { type: DataTypes.FLOAT, defaultValue: 1 },
            checked: { type: DataTypes.BOOLEAN, defaultValue: false },
        },
        { tableName: "list_item" },
    );

    return ListItem;
};
