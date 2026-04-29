module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("product", [
            // Produits de admin (userId: 1)
            {
                id: 1,
                label: "Farine",
                unit: "kg",
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                label: "Sucre",
                unit: "g",
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 3,
                label: "Oeufs",
                unit: "",
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 4,
                label: "Beurre",
                unit: "g",
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 5,
                label: "Lait",
                unit: "L",
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 6,
                label: "Tomates",
                unit: "g",
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 7,
                label: "Pâtes",
                unit: "g",
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 8,
                label: "Fromage râpé",
                unit: "g",
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // Produits de alice (userId: 2)
            {
                id: 9,
                label: "Pommes",
                unit: "kg",
                userId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 10,
                label: "Yaourts",
                unit: "",
                userId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 11,
                label: "Pain",
                unit: "",
                userId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 12,
                label: "Jus d'orange",
                unit: "L",
                userId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("product", null, {});
    },
};
