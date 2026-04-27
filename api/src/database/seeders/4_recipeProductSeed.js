module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("recipe_product", [
            // Crêpes maison (recipeId: 1) : farine(1), lait(5), oeufs(3), beurre(4)
            { id: 1, recipeId: 1, productId: 1, quantity: 250, createdAt: new Date(), updatedAt: new Date() }, // 250g farine
            { id: 2, recipeId: 1, productId: 5, quantity: 0.5, createdAt: new Date(), updatedAt: new Date() }, // 0.5L lait
            { id: 3, recipeId: 1, productId: 3, quantity: 3,   createdAt: new Date(), updatedAt: new Date() }, // 3 oeufs
            { id: 4, recipeId: 1, productId: 4, quantity: 30,  createdAt: new Date(), updatedAt: new Date() }, // 30g beurre
            // Pâtes au fromage (recipeId: 2) : pâtes(7), fromage(8)
            { id: 5, recipeId: 2, productId: 7, quantity: 200, createdAt: new Date(), updatedAt: new Date() }, // 200g pâtes
            { id: 6, recipeId: 2, productId: 8, quantity: 100, createdAt: new Date(), updatedAt: new Date() }, // 100g fromage
            // Salade de tomates (recipeId: 3) : tomates(6)
            { id: 7, recipeId: 3, productId: 6, quantity: 300, createdAt: new Date(), updatedAt: new Date() }, // 300g tomates
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("recipe_product", null, {});
    },
};
