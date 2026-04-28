const bcrypt = require("bcryptjs");

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("user", [
            {
                email: "user@example.com",
                password: await bcrypt.hash("user", 10),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                email: "admin@example.com",
                password: await bcrypt.hash("password123", 10),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                email: "alice@example.com",
                password: await bcrypt.hash("password123", 10),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("user", null, {});
    },
};
