const { Sequelize } = require("sequelize");
const IS_PROD = process.env.NODE_ENV === "production";

const dbConnector = new Sequelize({
    username: IS_PROD ? process.env.DB_USERNAME : process.env.LOCAL_DB_USERNAME,
    password: IS_PROD ? process.env.DB_PASSWORD : process.env.LOCAL_DB_PASSWORD,
    host: IS_PROD ? process.env.DB_HOST : process.env.LOCAL_DB_HOST,
    dialect: IS_PROD ? process.env.DB_DIALECT : process.env.LOCAL_DB_DIALECT,
    database: IS_PROD ? process.env.DB_NAME : process.env.LOCAL_DB_NAME,
    port: IS_PROD ? process.env.DB_PORT : process.env.LOCAL_DB_PORT,
    logging: false,
});

const connectDB = async function () {
    try {
        dbConnector.authenticate();
        console.log("connexion a la base de donnee reussit ");

    } catch (error) {
        console.log("erreur lors de la connexion a la base de donnee ", error);
    }
};

module.exports = { connectDB, dbConnector };
