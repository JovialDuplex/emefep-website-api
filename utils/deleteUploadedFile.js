const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

const IS_TEST = process.env.NODE_ENV === "test";
const IS_PROD = process.env.NODE_ENV === "production";
const IS_CLOUD = IS_TEST || IS_PROD;

/**
 * Extrait le public_id Cloudinary depuis une URL Cloudinary.
 * Exemple : https://res.cloudinary.com/demo/image/upload/v123/emefep/category/category_123.jpg
 *           → "emefep/category/category_123"
 * @param {string} cloudinaryUrl 
 * @returns {string}
 */
function extractCloudinaryPublicId(cloudinaryUrl) {
    // On prend tout ce qui est après "/upload/vXXXXXX/" (ou "/upload/") et on retire l'extension
    const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) throw new Error("URL Cloudinary invalide : " + cloudinaryUrl);
    const withExtension = match[1];
    // Retire l'extension de fichier
    return withExtension.replace(/\.[^/.]+$/, "");
}

/**
 * Supprime un fichier uploadé.
 * - En environnement LOCAL (development) : supprime le fichier sur le disque.
 * - En environnement TEST / PRODUCTION   : supprime le fichier sur Cloudinary.
 *
 * @param {string} imageValue  Valeur stockée en base : chemin relatif (local) ou URL Cloudinary (cloud).
 * @returns {Promise<void>}
 */
async function deleteUploadedFile(imageValue) {
    if (!imageValue) return;

    if (IS_CLOUD) {
        // --- Suppression Cloudinary ---
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
        // --- Suppression sur le disque local ---
        // imageValue est un chemin relatif depuis /public, ex: "uploads/category/category_123.jpg"
        const absolutePath = path.join(__dirname, "..", "public", imageValue);
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

exports = { deleteUploadedFile };
