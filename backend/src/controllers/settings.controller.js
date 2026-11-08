// Module: Reads public site settings and provides admin settings CRUD.
const { StatusCodes } = require("http-status-codes");
const Settings = require("../models/settings.model");
const ApiError = require("../utils/ApiError");
const { createOne, deleteOne, getAll, getOne, updateOne } = require("../utils/crudFactory");

const publicSettingsFields = "siteName defaultLanguage contact.email contact.phone contact.whatsapp contact.location branding.logoUrl branding.faviconUrl socialLinks seo.title seo.description seo.keywords";
const adminSettingsFields = `${publicSettingsFields} siteKey allowRegistration createdAt updatedAt`;

// Expose only frontend-safe site settings; administrative flags stay private.
exports.getPublicSettings = async (req, res, next) => {
    try {
        const settings = await Settings.findOne({ siteKey: "global" })
            .select(publicSettingsFields)
            .lean();

        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                settings: settings || {
                    siteName: "Norama Tech",
                    defaultLanguage: "ar",
                    contact: {},
                    branding: {},
                    socialLinks: [],
                    seo: {},
                },
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Create the one global settings record and associate it with the acting admin.
exports.createSettings = createOne(Settings, {
    modelName: "settings",
    beforeCreate: async ({ req, data }) => {
        if (await Settings.exists({ siteKey: "global" })) {
            throw new ApiError("Site settings already exist.", StatusCodes.CONFLICT);
        }

        data.siteKey = "global";
        data.updatedBy = req.user._id;
    },
    serializer: (settings) => ({
        siteKey: settings.siteKey,
        siteName: settings.siteName,
        defaultLanguage: settings.defaultLanguage,
        allowRegistration: settings.allowRegistration,
        contact: settings.contact,
        branding: settings.branding,
        socialLinks: settings.socialLinks,
        seo: settings.seo,
    }),
});

exports.getSettings = getAll(Settings, {
    modelName: "settings",
    defaultLimit: 10,
    defaultSort: "-updatedAt",
    select: adminSettingsFields,
});

exports.getSettingsById = getOne(Settings, {
    modelName: "settings",
    select: adminSettingsFields,
});

exports.updateSettings = updateOne(Settings, {
    modelName: "settings",
    allowedFields: Object.keys(require("../schemas/settings.schema").createSettingsSchema.shape),
    beforeUpdate: ({ req, document }) => {
        document.updatedBy = req.user._id;
    },
});

exports.deleteSettings = deleteOne(Settings, {
    modelName: "settings",
    beforeDelete: ({ document }) => {
        if (document.siteKey === "global") {
            throw new ApiError("The global site settings cannot be deleted.", StatusCodes.FORBIDDEN);
        }
    },
});
