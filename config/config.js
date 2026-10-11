const { Sequelize } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

const IS_PROD = process.env.NODE_ENV === "production";
const IS_TEST = process.env.NODE_ENV === "test";

// ------------------------- CONFIGURATION DE LA BASE DE DONNEE --------------------------
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
 * ----------------------- CONFIGURATION DE L'APPLICATION -------------------------------
 * @param {import('express').Application} app 
 * @param {import('express').Express} express_instance 
 */
const configApp = function (app, express_instance) {
    app.use(express_instance.json());
    app.use(express_instance.urlencoded({ extended: true }));

    // servir les fichiers statiques
    app.use(express_instance.static(path.join(__dirname, "..", "public")));

    //afficher les informations sur la requete effectuer 
    app.use((request, _, next) => {
        console.log(`${request.method} : < ${request.url} > at ${new Date().toLocaleDateString()} :${new Date().toLocaleTimeString()}`);
        next();
    })
};


// ------------------- CONFIGURATION DE L'UPLOAD DES FICHIER AVEC MULTER -------------

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Extrait le nom de la feature depuis l'URL : /api/<feature>/action → "feature"
const getFeatureFolderName = (req) => req.originalUrl.split("/").filter(Boolean)[1] || "uploads";

// ---- Stockage CLOUDINARY (environnement TEST / PRODUCTION) ----
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        const folder_name = getFeatureFolderName(req);
        const unique_id = folder_name + "_" + Date.now() + "_" + Math.round(Math.random() * 1E9);
        return {
            folder: "emefep/" + folder_name,
            public_id: unique_id,
            // Pas de transformation de format : on garde le format original
            resource_type: "auto",
        };
    },
});

// ---- Stockage LOCAL sur disque (environnement DEVELOPPEMENT) ----
const localDiskStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        const folder_name = getFeatureFolderName(request);
        const uploadPath = path.join(__dirname, "..", "public", "uploads", folder_name);

        // Crée le dossier de la feature si il n'existe pas encore
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        callback(null, uploadPath);
    },
    filename: (request, file, callback) => {
        const feature = getFeatureFolderName(request);
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        // Nom final : <feature>_<timestamp>_<random><.ext>
        callback(null, feature + "_" + uniqueSuffix + ext);
    }
});

const multerStorage = IS_TEST || IS_PROD ? cloudinaryStorage : localDiskStorage;

const uploadFile = multer({
    storage: multerStorage,
    limits: {
        // Taille maximale du fichier : 5 Mo
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (request, file, callback) => {
        // Accepter tous les types d'images (jpeg, png, webp, gif, svg, avif, etc.)
        if (file.mimetype.startsWith("image/")) {
            callback(null, true);
        } else {
            callback(new Error("Type de fichier non autorise. Seules les images sont acceptees."), false);
        }
    },
});
module.exports = { configApp, connectDB, syncDB, dbConnector, uploadFile };
