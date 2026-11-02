const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

const __dirname = path.resolve();

const IS_TEST = process.env.NODE_ENV === "test";
const IS_PROD = process.env.NODE_ENV === "production";
const IS_CLOUD = IS_TEST || IS_PROD;

function extractCloudinaryPublicId(cloudinaryUrl) {
  const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) throw new Error("URL Cloudinary invalide : " + cloudinaryUrl);
  const withExtension = match[1];
  return withExtension.replace(/\.[^/.]+$/, "");
}

async function deleteUploadedFile(imageValue) {
  if (!imageValue) return;

  if (IS_CLOUD) {
    try {
      const publicId = extractCloudinaryPublicId(imageValue);
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === "ok") {
        console.log(`[Cloudinary] Fichier supprime : ${publicId}`);
      } else {
        console.warn(`[Cloudinary] Fichier non trouve ou deja supprime : ${publicId} (result: ${result.result})`);
      }
    } catch (error) {
      console.error("[Cloudinary] Erreur lors de la suppression du fichier :", error.message);
    }
  } else {
    const absolutePath = path.join(__dirname, "public", imageValue);
    try {
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`[Local] Fichier supprime : ${absolutePath}`);
      } else {
        console.warn(`[Local] Fichier introuvable, rien a supprimer : ${absolutePath}`);
      }
    } catch (error) {
      console.error("[Local] Erreur lors de la suppression du fichier :", error.message);
    }
  }
}

async function deleteMulterFile(file) {
  if (!file) return;

  if (IS_CLOUD) {
    try {
      const publicId = extractCloudinaryPublicId(file.path);
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === "ok") {
        console.log(`[Cloudinary] Fichier supprime : ${publicId}`);
      } else {
        console.warn(`[Cloudinary] Fichier non trouve ou deja supprime : ${publicId} (result: ${result.result})`);
      }
    } catch (error) {
      console.error("[Cloudinary] Erreur lors de la suppression du fichier Multer :", error.message);
    }
  } else {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        console.log(`[Local] Fichier supprime : ${file.path}`);
      } else {
        console.warn(`[Local] Fichier introuvable, rien a supprimer : ${file.path}`);
      }
    } catch (error) {
      console.error("[Local] Erreur lors de la suppression du fichier Multer :", error.message);
    }
  }
}

module.exports = {
  deleteUploadedFile,
  deleteMulterFile,
};
