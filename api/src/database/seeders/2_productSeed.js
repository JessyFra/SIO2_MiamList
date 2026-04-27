module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("product", [
            // Produits de admin (userId: 1)
            { id: 1,  label: "Farine",        quantity: 1,   unit: "kg",  userId: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 2,  label: "Sucre",          quantity: 500, unit: "g",   userId: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 3,  label: "Oeufs",          quantity: 6,   unit: "",    userId: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 4,  label: "Beurre",         quantity: 250, unit: "g",   userId: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 5,  label: "Lait",           quantity: 1,   unit: "L",   userId: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 6,  label: "Tomates",        quantity: 500, unit: "g",   userId: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 7,  label: "Pâtes",          quantity: 500, unit: "g",   userId: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 8,  label: "Fromage râpé",   quantity: 200, unit: "g",   userId: 1, createdAt: new Date(), updatedAt: new Date() },
            // Produits de alice (userId: 2)
            { id: 9,  label: "Pommes",         quantity: 1,   unit: "kg",  userId: 2, createdAt: new Date(), updatedAt: new Date() },
            { id: 10, label: "Yaourts",        quantity: 4,   unit: "",    userId: 2, createdAt: new Date(), updatedAt: new Date() },
            { id: 11, label: "Pain",           quantity: 1,   unit: "",    userId: 2, createdAt: new Date(), updatedAt: new Date() },
            { id: 12, label: "Jus d'orange",   quantity: 1,   unit: "L",   userId: 2, createdAt: new Date(), updatedAt: new Date() },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("product", null, {});
    },
};
