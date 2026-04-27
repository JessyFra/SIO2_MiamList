module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("user", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            username: { type: Sequelize.STRING(191), allowNull: false },
            email: {
                type: Sequelize.STRING(191),
                allowNull: false,
                unique: true,
            },
            password: { type: Sequelize.STRING(191), allowNull: false },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });

        await queryInterface.createTable("product", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            label: { type: Sequelize.STRING(191), allowNull: false },
            quantity: { type: Sequelize.FLOAT, defaultValue: 1 },
            unit: { type: Sequelize.STRING(50), defaultValue: "" },
            userId: {
                type: Sequelize.INTEGER,
                references: { model: "user", key: "id" },
                onDelete: "CASCADE",
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });

        await queryInterface.createTable("recipe", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: { type: Sequelize.STRING(191), allowNull: false },
            description: { type: Sequelize.TEXT },
            userId: {
                type: Sequelize.INTEGER,
                references: { model: "user", key: "id" },
                onDelete: "CASCADE",
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });

        await queryInterface.createTable("recipe_product", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            quantity: { type: Sequelize.FLOAT, defaultValue: 1 },
            recipeId: {
                type: Sequelize.INTEGER,
                references: { model: "recipe", key: "id" },
                onDelete: "CASCADE",
            },
            productId: {
                type: Sequelize.INTEGER,
                references: { model: "product", key: "id" },
                onDelete: "CASCADE",
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });

        await queryInterface.createTable("shopping_list", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: { type: Sequelize.STRING(191), allowNull: false },
            userId: {
                type: Sequelize.INTEGER,
                references: { model: "user", key: "id" },
                onDelete: "CASCADE",
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });

        await queryInterface.createTable("list_item", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            quantity: { type: Sequelize.FLOAT, defaultValue: 1 },
            checked: { type: Sequelize.BOOLEAN, defaultValue: false },
            listId: {
                type: Sequelize.INTEGER,
                references: { model: "shopping_list", key: "id" },
                onDelete: "CASCADE",
            },
            productId: {
                type: Sequelize.INTEGER,
                references: { model: "product", key: "id" },
                onDelete: "CASCADE",
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("list_item");
        await queryInterface.dropTable("shopping_list");
        await queryInterface.dropTable("recipe_product");
        await queryInterface.dropTable("recipe");
        await queryInterface.dropTable("product");
        await queryInterface.dropTable("user");
    },
};
