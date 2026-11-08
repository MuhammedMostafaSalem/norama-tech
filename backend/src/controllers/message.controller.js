const Message = require("../models/message.model");
const { createOne, deleteOne, getAll, getOne, updateOne } = require("../utils/crudFactory");
const sendEmail = require("../utils/sendEmail");
const contactNotificationTemplate = require("../templates/contactNotificationTemplate");

const messageFields = "fullName email phone projectType subject message status notificationStatus createdAt updatedAt";

exports.createMessage = createOne(Message, {
    modelName: "message",
    beforeCreate: ({ data }) => {
        data.phone = data.phone || "";
        data.projectType = data.projectType || "";
        data.subject = data.subject || data.projectType || "General inquiry";
        data.status = "new";
        data.notificationStatus = "pending";
    },
    afterCreate: async ({ document }) => {
        try {
            await sendEmail({
                email: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
                subject: `New Norama Tech message: ${document.subject}`,
                message: [
                    `Name: ${document.fullName}`,
                    `Email: ${document.email}`,
                    `Phone: ${document.phone || "Not provided"}`,
                    `Subject: ${document.subject}`,
                    "",
                    document.message,
                ].join("\n"),
                html: contactNotificationTemplate(document),
            });
            document.notificationStatus = "sent";
        } catch {
            document.notificationStatus = "failed";
        }

        await document.save();
    },
    serializer: (document) => ({
        id: document._id,
        receivedAt: document.createdAt,
        status: "received",
    }),
});

exports.getMessages = getAll(Message, {
    modelName: "messages",
    searchFields: ["fullName", "email", "subject", "projectType", "message"],
    defaultLimit: 10,
    defaultSort: "-createdAt",
    select: messageFields,
});

exports.getMessage = getOne(Message, {
    modelName: "message",
    select: messageFields,
});

exports.updateMessage = updateOne(Message, {
    modelName: "message",
    allowedFields: ["status"],
    serializer: (document) => ({
        id: document._id,
        fullName: document.fullName,
        email: document.email,
        phone: document.phone,
        projectType: document.projectType,
        subject: document.subject,
        message: document.message,
        status: document.status,
        notificationStatus: document.notificationStatus,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
    }),
});

exports.deleteMessage = deleteOne(Message, { modelName: "message" });