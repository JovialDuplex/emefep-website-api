import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

// Equivalent de __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

/**
 * Supprime un fichier uploadé par Multer (reçu via request.file).
 * À utiliser lors d'une erreur de validation, AVANT que le chemin soit sauvegardé en base.
 *
 * Différence avec deleteUploadedFile() :
 *   - deleteUploadedFile() reçoit une valeur stockée en base (chemin relatif ou URL Cloudinary)
 *   - deleteMulterFile()   reçoit directement l'objet Multer (request.file)
 *     → En local  : file.path est un chemin absolu sur le disque → suppression directe
 *     → En cloud  : file.path est l'URL Cloudinary              → extraction du public_id
 *
 * @param {import("multer").File} file  L'objet request.file fourni par Multer
 * @returns {Promise<void>}
 */
async function deleteMulterFile(file) {
    if (!file) return;

    if (IS_CLOUD) {
        // En mode cloud, Multer-Cloudinary stocke l'URL dans file.path
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
        // En mode local, file.path est déjà le chemin absolu sur le disque
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

export { deleteUploadedFile, deleteMulterFile };

