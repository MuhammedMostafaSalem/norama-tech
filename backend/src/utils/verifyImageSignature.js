// Module: Checks uploaded image bytes against the claimed image format.
const { open } = require("node:fs/promises");

const signatures = {
    "image/png": (buffer) => buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/jpeg": (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
    "image/gif": (buffer) => ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii")),
    "image/webp": (buffer) => buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP",
};

async function verifyImageSignature(file) {
    const signatureCheck = signatures[file.mimetype];

    if (!signatureCheck) {
        return false;
    }

    const handle = await open(file.path, "r");

    try {
        const buffer = Buffer.alloc(12);
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
        return bytesRead >= 4 && signatureCheck(buffer);
    } finally {
        await handle.close();
    }
}

module.exports = verifyImageSignature;