module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("list_item", [
            // "Courses de la semaine" (listId: 1) — admin
            { id: 1,  listId: 1, productId: 1,  quantity: 1,   checked: false, createdAt: new Date(), updatedAt: new Date() }, // Farine
            { id: 2,  listId: 1, productId: 2,  quantity: 1,   checked: false, createdAt: new Date(), updatedAt: new Date() }, // Sucre
            { id: 3,  listId: 1, productId: 3,  quantity: 12,  checked: true,  createdAt: new Date(), updatedAt: new Date() }, // Oeufs (déjà acheté)
            { id: 4,  listId: 1, productId: 5,  quantity: 2,   checked: false, createdAt: new Date(), updatedAt: new Date() }, // Lait
            { id: 5,  listId: 1, productId: 7,  quantity: 1,   checked: false, createdAt: new Date(), updatedAt: new Date() }, // Pâtes
            // "Liste du week-end" (listId: 2) — admin
            { id: 6,  listId: 2, productId: 4,  quantity: 1,   checked: false, createdAt: new Date(), updatedAt: new Date() }, // Beurre
            { id: 7,  listId: 2, productId: 6,  quantity: 1,   checked: false, createdAt: new Date(), updatedAt: new Date() }, // Tomates
            { id: 8,  listId: 2, productId: 8,  quantity: 1,   checked: true,  createdAt: new Date(), updatedAt: new Date() }, // Fromage râpé (déjà acheté)
            // "Mes courses" (listId: 3) — alice
            { id: 9,  listId: 3, productId: 9,  quantity: 2,   checked: false, createdAt: new Date(), updatedAt: new Date() }, // Pommes
            { id: 10, listId: 3, productId: 10, quantity: 8,   checked: false, createdAt: new Date(), updatedAt: new Date() }, // Yaourts
            { id: 11, listId: 3, productId: 11, quantity: 1,   checked: true,  createdAt: new Date(), updatedAt: new Date() }, // Pain (déjà acheté)
            { id: 12, listId: 3, productId: 12, quantity: 2,   checked: false, createdAt: new Date(), updatedAt: new Date() }, // Jus d'orange
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("list_item", null, {});
    },
};
