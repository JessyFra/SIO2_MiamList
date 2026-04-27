module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("user", [
            {
                email: "user@example.com",
                password: "$2b$10$Cktt6mdFqyit6ZgI1TW8eOxwefKrErgNQDBlb4pcC31ci4XzgfHea",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                email: "alice@example.com",
                password: "$2b$10$l40PryMfw8Hq48vDZMKeU.yJvIY2LsDSbkyzmHu5ItwTpzQQOeJgK",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("user", null, {});
    },
};
