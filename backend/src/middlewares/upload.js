// Module: Configures image upload storage, size limits, and accepted MIME types.
const path = require("path");
const mime = require("mime-types");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const projectImageMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, "../uploads"),
    filename(req, file, callback) {
        const extension = mime.extension(file.mimetype);
        callback(null, `${uuidv4()}${extension ? `.${extension}` : ""}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter(req, file, callback) {
        const detectedMimeType = mime.lookup(file.originalname);

        if (!detectedMimeType || detectedMimeType !== file.mimetype) {
            const error = new Error("Unsupported or mismatched file type.");
            error.statusCode = 400;
            callback(error);
            return;
        }

        callback(null, true);
    },
});

const projectImageUpload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE, files: 13 },
    fileFilter(req, file, callback) {
        const detectedMimeType = mime.lookup(file.originalname);

        if (
            !projectImageMimeTypes.has(file.mimetype) ||
            detectedMimeType !== file.mimetype
        ) {
            const error = new Error("Project uploads must be JPEG, PNG, WebP, or GIF images.");
            error.statusCode = 400;
            callback(error);
            return;
        }

        callback(null, true);
    },
}).fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 12 },
]);

upload.projectImages = projectImageUpload;

module.exports = upload;
