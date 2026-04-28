module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("recipe", [
            // Recettes de admin (userId: 1)
            {
                id: 1,
                name: "Crêpes maison",
                description: "Recette classique de crêpes françaises.",
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                name: "Pâtes au fromage",
                description: "Recette simple et rapide de pâtes gratinées.",
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // Recettes de alice (userId: 2)
            {
                id: 3,
                name: "Salade de tomates",
                description: "Salade fraîche à la tomate et aux herbes.",
                userId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("recipe", null, {});
    },
};
