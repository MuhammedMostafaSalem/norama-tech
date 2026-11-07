const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");

function createSlug(value) {
    return slugify(value, { lower: true, strict: true, trim: true });
}

function createId() {
    return uuidv4();
}

module.exports = { createId, createSlug };
