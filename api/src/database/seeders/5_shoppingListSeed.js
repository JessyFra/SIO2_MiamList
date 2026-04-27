module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("shopping_list", [
            // Listes de admin (userId: 1)
            { id: 1, name: "Courses de la semaine", userId: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 2, name: "Liste du week-end",      userId: 1, createdAt: new Date(), updatedAt: new Date() },
            // Liste de alice (userId: 2)
            { id: 3, name: "Mes courses",            userId: 2, createdAt: new Date(), updatedAt: new Date() },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("shopping_list", null, {});
    },
};
