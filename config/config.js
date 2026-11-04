const { Sequelize } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");
const mysql2 = require("mysql2");

const IS_PROD = process.env.NODE_ENV === "production";
const IS_TEST = process.env.NODE_ENV === "test";

const dbConnector = new Sequelize({
  username: IS_PROD
    ? process.env.DB_USERNAME
    : IS_TEST
      ? process.env.TEST_DB_USERNAME
      : process.env.LOCAL_DB_USERNAME,
  password: IS_PROD
    ? process.env.DB_PASSWORD
    : IS_TEST
      ? process.env.TEST_DB_PASSWORD
      : process.env.LOCAL_DB_PASSWORD,
  host: IS_PROD
    ? process.env.DB_HOST
    : IS_TEST
      ? process.env.TEST_DB_HOST
      : process.env.LOCAL_DB_HOST,
  dialect: "mysql",
  dialectModule: mysql2,
  database: IS_PROD
    ? process.env.DB_NAME
    : IS_TEST
      ? process.env.TEST_DB_NAME
      : process.env.LOCAL_DB_NAME,
  port: IS_PROD
    ? process.env.DB_PORT
    : IS_TEST
      ? process.env.TEST_DB_PORT
      : process.env.LOCAL_DB_PORT,
  logging: false,
  dialectOptions: IS_TEST
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
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
    if (IS_TEST) {
      console.log("Erreur lors connexion a la base de TEST ", error);
    } else if (IS_PROD) {
      console.log("Erreur connexion a la base de PRODUCTION  ", error);
    } else {
      console.log("Erreur connexion a la base de LOCAL ", error);
    };
    throw error;
  }
};

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

const configApp = function (app, express_instance) {
  app.use(express_instance.json());
  app.use(express_instance.urlencoded({ extended: true }));
  app.use(express_instance.static(path.join(__dirname, "..", "public")));

  app.use((request, _, next) => {
    console.log(`${request.method} : < ${request.url} > at ${new Date().toLocaleDateString()} :${new Date().toLocaleTimeString()}`);
    next();
  });
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getFeatureFolderName = (req) => req.originalUrl.split("/").filter(Boolean)[1] || "uploads";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const folder_name = getFeatureFolderName(req);
    const unique_id = folder_name + "_" + Date.now() + "_" + Math.round(Math.random() * 1e9);
    return {
      folder: "emefep/" + folder_name,
      public_id: unique_id,
      resource_type: "auto",
    };
  },
});

const localDiskStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    const folder_name = getFeatureFolderName(request);
    const uploadPath = path.join(__dirname, "..", "public", "uploads", folder_name);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    callback(null, uploadPath);
  },
  filename: (request, file, callback) => {
    const feature = getFeatureFolderName(request);
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    callback(null, feature + "_" + uniqueSuffix + ext);
  },
});

const multerStorage = IS_TEST ? cloudinaryStorage : localDiskStorage;

const uploadFile = multer({
  storage: multerStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (request, file, callback) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("application/octet-stream")) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});

module.exports = {
  configApp,
  connectDB,
  syncDB,
  dbConnector,
  uploadFile,
};
