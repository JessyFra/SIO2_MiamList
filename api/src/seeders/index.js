const { sequelize } = require("../models");

async function seed() {
    await sequelize.sync({ force: true });
    console.log("Base réinitialisée");
    // TODO : insérer les données de test
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
