// Module: Deletes an uploaded file only when its resolved path stays inside uploads.
const path = require("path");
const { unlink } = require("node:fs/promises");

const uploadsDirectory = path.resolve(__dirname, "../uploads");

async function deleteFile(storedPath) {
    if (typeof storedPath !== "string" || !storedPath.startsWith("/uploads/")) {
        return;
    }

    const filename = storedPath.slice("/uploads/".length);

    if (!filename || path.basename(filename) !== filename) {
        return;
    }

    try {
        await unlink(path.join(uploadsDirectory, filename));
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }
}

module.exports = deleteFile;