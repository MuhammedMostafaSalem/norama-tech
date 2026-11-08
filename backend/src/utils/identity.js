// Module: Creates normalized slugs and identifiers used by data records.
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");

const slugOptions = { lower: true, strict: true, trim: true };

const createSlug = (value) => {
    if (typeof value === "string") {
        return slugify(value, slugOptions);
    }

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, text]) => [
                key,
                slugify(typeof text === "string" ? text : "", slugOptions),
            ]),
        );
    }

    return "";
};

function createId() {
    return uuidv4();
}

module.exports = { createId, createSlug };
