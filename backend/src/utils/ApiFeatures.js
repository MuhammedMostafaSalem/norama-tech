const EXCLUDED_FILTERS = new Set([
    "search",
    "sort",
    "fields",
    "page",
    "limit",
    "skip",
    "loadMore",
]);

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

class ApiFeatures {
    constructor(model, queryString = {}, filterObject = {}) {
        this.model = model;
        this.queryString = queryString;
        this.query = model.find(filterObject);
        this.meta = {};
    }

    search(searchFields = []) {
        const keyword = this.queryString.search?.trim();
        const fields = searchFields.filter((field) => this.model.schema.path(field));

        if (!keyword || fields.length === 0) {
            return this;
        }

        const expression = new RegExp(escapeRegex(keyword), "i");
        this.query = this.query.find({
            $or: fields.map((field) => ({ [field]: expression })),
        });

        return this;
    }

    filter() {
        const filters = {};

        for (const [field, value] of Object.entries(this.queryString)) {
            if (
                EXCLUDED_FILTERS.has(field) ||
                field.startsWith("$") ||
                !this.model.schema.path(field) ||
                value === undefined
            ) {
                continue;
            }

            filters[field] = value;
        }

        if (Object.keys(filters).length > 0) {
            this.query = this.query.find(filters);
        }

        return this;
    }

    sort(defaultSort = "-createdAt") {
        const requestedSort = this.queryString.sort || defaultSort;
        const sortObject = {};

        for (const item of String(requestedSort).split(",")) {
            const field = item.startsWith("-") ? item.slice(1) : item;

            if (this.model.schema.path(field)) {
                sortObject[field] = item.startsWith("-") ? -1 : 1;
            }
        }

        if (Object.keys(sortObject).length === 0) {
            const fallbackField = defaultSort.replace(/^-/, "");
            sortObject[fallbackField] = defaultSort.startsWith("-") ? -1 : 1;
        }

        this.query = this.query.sort(sortObject);
        return this;
    }

    select(fields) {
        const requestedFields = fields || this.queryString.fields;

        if (!requestedFields) {
            return this;
        }

        const safeFields = String(requestedFields)
            .split(/[ ,]+/)
            .filter((field) => {
                const normalizedField = field.replace(/^-/, "");
                const schemaPath = this.model.schema.path(normalizedField);

                return schemaPath && schemaPath.options.select !== false;
            });

        if (safeFields.length > 0) {
            this.query = this.query.select(safeFields.join(" "));
        }

        return this;
    }

    loadMore(defaultLimit = 10) {
        const parsedLimit = Number(this.queryString.limit);
        const limit = Number.isInteger(parsedLimit) && parsedLimit > 0
            ? Math.min(parsedLimit, 100)
            : defaultLimit;
        const parsedPage = Number(this.queryString.page);
        const parsedSkip = Number(this.queryString.skip);
        const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
        const skip = Number.isInteger(parsedSkip) && parsedSkip >= 0
            ? parsedSkip
            : (page - 1) * limit;

        this.limitValue = limit;
        this.skipValue = skip;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    populate(populateOptions) {
        if (populateOptions) {
            this.query = this.query.populate(populateOptions);
        }

        return this;
    }

    async buildMeta() {
        const total = await this.model.countDocuments(this.query.getFilter());

        this.meta = {
            total,
            limit: this.limitValue || total,
            skip: this.skipValue || 0,
            hasMore: total > ((this.skipValue || 0) + (this.limitValue || total)),
        };

        return this;
    }
}

module.exports = ApiFeatures;