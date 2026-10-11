const { Sequelize } = require("sequelize");
const IS_PROD = process.env.NODE_ENV === "production";
const IS_TEST = process.env.NODE_ENV === "test";

const dbConnector = new Sequelize({
    username: IS_PROD ? process.env.DB_USERNAME : IS_TEST ? process.env.TEST_DB_USERNAME : process.env.LOCAL_DB_USERNAME,
    password: IS_PROD ? process.env.DB_PASSWORD : IS_TEST ? process.env.TEST_DB_PASSWORD : process.env.LOCAL_DB_PASSWORD,
    host: IS_PROD ? process.env.DB_HOST : IS_TEST ? process.env.TEST_DB_HOST : process.env.LOCAL_DB_HOST,
    dialect: IS_PROD ? process.env.DB_DIALECT : IS_TEST ? process.env.TEST_DB_DIALECT : process.env.LOCAL_DB_DIALECT,
    database: IS_PROD ? process.env.DB_NAME : IS_TEST ? process.env.TEST_DB_NAME : process.env.LOCAL_DB_NAME,
    port: IS_PROD ? process.env.DB_PORT : IS_TEST ? process.env.TEST_DB_PORT : process.env.LOCAL_DB_PORT,
    logging: false,
    dialectOptions: IS_TEST ? {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    } : {},
});

const connectDB = async function () {
    try {
        await dbConnector.authenticate();

        if (IS_TEST) {
            console.log("connexion a la base de TEST reussit ");
        } else if (IS_PROD) {
            console.log("connexion a la base de PRODUCTION reussit ");
        } else {
            console.log("connexion a la base de LOCAL reussit ");
        }

    } catch (error) {
        console.log("erreur lors de la connexion a la base de donnee ", error);
        throw error;
    }
};

/**
 * Synchronise (migre) tous les modeles Sequelize avec la base de donnee.
 * Doit etre appele APRES initModels() pour que tous les modeles soient enregistres.
 * @param {"alter"|"force"|false} mode 
 *   - "alter"  : met a jour les tables existantes (recommande en dev)
 *   - "force"  : supprime et recrée les tables (ATTENTION: perte de donnees)
 *   - false    : cree les tables manquantes sans modifier les existantes
 */
const syncDB = async function (mode = "false") {
    try {
        const options = mode === "force"
            ? { force: true }
            : mode === "alter"
                ? { alter: true }
                : {};

        await dbConnector.sync(options);
        console.log("Migration effectuee avec succes (mode: " + mode + ")");
    } catch (error) {
        console.error("Erreur lors de la migration :", error);
        throw error;
    }
};

/**
 * 
 * @param {import('express').Application} app 
 * @param {import('express').Express} express_instance 
 */
const configApp = function (app, express_instance) {
    app.use(express_instance.json());
    app.use(express_instance.urlencoded({ extended: true }));

    //afficher les informations sur la requete effectuer 
    app.use((request, _, next) => {
        console.log(`${request.method} : < ${request.url} > at ${new Date().toLocaleDateString()} :${new Date().toLocaleTimeString()}`);
        next();
    })
};

module.exports = { configApp, connectDB, syncDB, dbConnector };
