const app = require("./app");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 3000;

sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Base de données synchronisée");
        app.listen(PORT, () =>
            console.log(`Serveur démarré sur http://localhost:${PORT}`),
        );
    })
    .catch((err) => console.error("Erreur de connexion à la BDD :", err));
