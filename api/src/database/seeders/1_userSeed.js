const bcrypt = require("bcryptjs");

module.exports = {
    async up(queryInterface) {
        const hashed = await bcrypt.hash("password123", 10);
        await queryInterface.bulkInsert("user", [
            {
                email: "admin@example.com",
                password: hashed,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                email: "alice@example.com",
                password: hashed,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("user", null, {});
    },
};
