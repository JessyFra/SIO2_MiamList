const bcrypt = require("bcrypt");
const { sequelize, User, Product, Recipe, ShoppingList } = require("../models");

async function seed() {
    await sequelize.sync({ force: true });
    console.log("Base réinitialisée");

    //  Utilisateurs
    const hashedPassword = await bcrypt.hash("password123", 10);

    const [admin, alice] = await User.bulkCreate([
        {
            username: "admin",
            email: "admin@example.com",
            password: hashedPassword,
        },
        {
            username: "alice",
            email: "alice@example.com",
            password: hashedPassword,
        },
    ]);
    console.log("Utilisateurs insérés");

    //  Produits
    const [farine, sucre, oeufs, beurre, lait, tomates, pates, fromage] =
        await Product.bulkCreate([
            { label: "Farine", quantity: 1, unit: "kg", userId: admin.id },
            { label: "Sucre", quantity: 500, unit: "g", userId: admin.id },
            { label: "Oeufs", quantity: 6, unit: "", userId: admin.id },
            { label: "Beurre", quantity: 250, unit: "g", userId: admin.id },
            { label: "Lait", quantity: 1, unit: "L", userId: admin.id },
            { label: "Tomates", quantity: 500, unit: "g", userId: admin.id },
            { label: "Pâtes", quantity: 500, unit: "g", userId: admin.id },
            {
                label: "Fromage râpé",
                quantity: 200,
                unit: "g",
                userId: admin.id,
            },
        ]);

    const [pommes, yaourts, pain, jus] = await Product.bulkCreate([
        { label: "Pommes", quantity: 1, unit: "kg", userId: alice.id },
        { label: "Yaourts", quantity: 4, unit: "", userId: alice.id },
        { label: "Pain", quantity: 1, unit: "", userId: alice.id },
        { label: "Jus d'orange", quantity: 1, unit: "L", userId: alice.id },
    ]);
    console.log("Produits insérés");

    //  Recettes
    const crepes = await Recipe.create({
        name: "Crêpes maison",
        description: "Recette classique de crêpes françaises.",
        userId: admin.id,
    });
    await crepes.addProducts([farine, lait, oeufs, beurre], {
        through: { quantity: 1 },
    });

    const patesFromage = await Recipe.create({
        name: "Pâtes au fromage",
        description: "Recette simple et rapide de pâtes gratinées.",
        userId: admin.id,
    });
    await patesFromage.addProducts([pates, fromage], {
        through: { quantity: 1 },
    });

    const salade = await Recipe.create({
        name: "Salade de tomates",
        description: "Salade fraîche à la tomate et aux herbes.",
        userId: alice.id,
    });
    await salade.addProducts([tomates], { through: { quantity: 1 } });
    console.log("Recettes insérées");

    //  Listes de courses
    const listeSemaine = await ShoppingList.create({
        name: "Courses de la semaine",
        userId: admin.id,
    });
    await listeSemaine.addProducts([farine, sucre, oeufs, lait, pates], {
        through: { quantity: 1, checked: false },
    });

    const listeWE = await ShoppingList.create({
        name: "Liste du week-end",
        userId: admin.id,
    });
    await listeWE.addProducts([beurre, tomates, fromage], {
        through: { quantity: 1, checked: false },
    });

    const listAlice = await ShoppingList.create({
        name: "Mes courses",
        userId: alice.id,
    });
    await listAlice.addProducts([pommes, yaourts, pain, jus], {
        through: { quantity: 1, checked: false },
    });
    console.log("Listes de courses insérées");

    console.log("✅ Seed terminé avec succès");
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
