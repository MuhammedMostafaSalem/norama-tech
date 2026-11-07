const path = require("path");
const mime = require("mime-types");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "../uploads"),
  filename(req, file, callback) {
    const extension = mime.extension(file.mimetype);
    callback(null, `${uuidv4()}${extension ? `.${extension}` : ""}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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

module.exports = upload;
