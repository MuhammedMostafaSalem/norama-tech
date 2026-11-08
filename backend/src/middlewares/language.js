// Module: Selects a request language from headers and localizes API messages.
const env = require("../config/env");
const { translateErrorDetails, translateMessage } = require("../utils/translateMessage");

const supportedLanguages = new Set(["ar", "en"]);

function normalizeLanguage(value) {
    const language = value?.trim().toLowerCase().split(/[-_,;]/)[0];
    return supportedLanguages.has(language) ? language : null;
}

function languageFromAcceptHeader(value) {
    if (!value) {
        return null;
    }

    const preferences = value.split(",").map((entry) => {
        const [tag, ...parameters] = entry.trim().split(";");
        const qualityParameter = parameters.find((parameter) => /^q=/i.test(parameter.trim()));
        const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
        return { language: normalizeLanguage(tag), quality };
    }).filter((entry) => entry.language && Number.isFinite(entry.quality) && entry.quality > 0);

    preferences.sort((first, second) => second.quality - first.quality);
    return preferences[0]?.language || null;
}

function localizeErrors(value, language) {
    if (Array.isArray(value)) {
        return value.map((item) => localizeErrors(item, language));
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, localizeErrors(item, language)]),
        );
    }

    return typeof value === "string" ? translateMessage(value, language) : value;
}

function language(req, res, next) {
    const explicitLanguage = normalizeLanguage(req.get("x-language"))
        || normalizeLanguage(req.get("x-locale"));
    const acceptLanguage = languageFromAcceptHeader(req.get("accept-language"));
    const selectedLanguage = explicitLanguage || acceptLanguage || env.defaultLanguage;

    req.language = selectedLanguage;
    req.t = (message) => translateMessage(message, selectedLanguage);
    res.setHeader("Content-Language", selectedLanguage);

    const originalJson = res.json.bind(res);
    res.json = (body) => {
        if (body && typeof body === "object" && !Array.isArray(body)) {
            const localizedBody = { ...body };

            if (typeof localizedBody.message === "string") {
                localizedBody.message = translateMessage(localizedBody.message, selectedLanguage);
            }

            if (localizedBody.errors !== undefined) {
                localizedBody.errors = translateErrorDetails(localizedBody.errors, selectedLanguage);
            }

            return originalJson(localizedBody);
        }

        return originalJson(body);
    };

    next();
}

module.exports = language;