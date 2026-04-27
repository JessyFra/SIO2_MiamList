module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("user", [
            {
                username: "admin",
                email: "admin@example.com",
                password:
                    "$2b$10$l40PryMfw8Hq48vDZMKeU.yJvIY2LsDSbkyzmHu5ItwTpzQQOeJgK",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                username: "alice",
                email: "alice@example.com",
                password:
                    "$2b$10$l40PryMfw8Hq48vDZMKeU.yJvIY2LsDSbkyzmHu5ItwTpzQQOeJgK",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("user", null, {});
    },
};
