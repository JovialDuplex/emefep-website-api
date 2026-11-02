const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

const APP_ROOT = process.cwd();

const isCloudEnvironment = () => {
  return process.env.NODE_ENV === "test" || process.env.NODE_ENV === "production";
};

function extractCloudinaryPublicId(cloudinaryUrl) {
  const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) throw new Error("URL Cloudinary invalide : " + cloudinaryUrl);

  const withExtension = match[1];
  return withExtension.replace(/\.[^/.]+$/, "");
}

async function deleteUploadedFile(imageValue) {
  if (!imageValue) return;

  if (isCloudEnvironment()) {
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

    return;
  }

  const absolutePath = path.join(APP_ROOT, "public", imageValue);

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

async function deleteMulterFile(file) {
  if (!file) return;

  if (isCloudEnvironment()) {
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

    return;
  }

  const filePath = file.path;

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[Local] Fichier supprime : ${filePath}`);
    } else {
      console.warn(`[Local] Fichier introuvable, rien a supprimer : ${filePath}`);
    }
  } catch (error) {
    console.error("[Local] Erreur lors de la suppression du fichier Multer :", error.message);
  }
}

module.exports = {
  deleteUploadedFile,
  deleteMulterFile,
};
