const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ListItem = sequelize.define("ListItem", {
    quantity: { type: DataTypes.FLOAT, defaultValue: 1 },
    checked: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = ListItem;
