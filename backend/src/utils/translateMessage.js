// Module: Translates known messages and validation details into the selected language.
const { ar } = require("../locales/messages");

function translateMessage(message, language = "en") {
    if (typeof message !== "string") {
        return message;
    }

    if (language !== "ar") {
        return message;
    }

    if (Object.values(ar).includes(message)) {
        return message;
    }

    if (ar[message]) {
        return ar[message];
    }

    let match = message.match(/^(.+) not found\.$/);
    if (match) {
        const nouns = {
            user: "المستخدم",
            project: "المشروع",
            category: "التصنيف",
            review: "التقييم",
            message: "الرسالة",
            settings: "الإعدادات",
            websiteContent: "محتوى الموقع",
        };
        return `${nouns[match[1]] || "العنصر"} غير موجود.`;
    }

    match = message.match(/^(.+) (created|fetched|updated|deleted) successfully\.$/);
    if (match) {
        const nouns = {
            user: "المستخدم",
            users: "المستخدمين",
            project: "المشروع",
            projects: "المشاريع",
            category: "التصنيف",
            categories: "التصنيفات",
            review: "التقييم",
            reviews: "التقييمات",
            message: "الرسالة",
            messages: "الرسائل",
            settings: "الإعدادات",
            websiteContent: "محتوى الموقع"
        };
        const verbs = {
            created: "إنشاء",
            fetched: "جلب",
            updated: "تحديث",
            deleted: "حذف"
        };

        return `تم ${verbs[match[2]]} ${nouns[match[1]] || "العنصر"} بنجاح.`;
    }

    match = message.match(/^A record with this (.+) already exists\.$/);
    if (match) {
        const fields = {
            email: "البريد الإلكتروني",
            phone: "رقم الهاتف",
            name: "الاسم",
            slug: "الرابط المختصر",
        };

        return `يوجد سجل بهذه القيمة في ${fields[match[1]] || "هذا الحقل"} بالفعل.`;
    }

    if (/^Not Found - /.test(message)) {
        return `المسار غير موجود: ${message.slice("Not Found - ".length)}`;
    }

    match = message.match(/^Invalid (.+): (.+)$/);
    if (match) {
        return `القيمة ${match[2]} غير صالحة للحقل ${match[1]}.`;
    }

    if (/^Invalid /.test(message)) {
        return `قيمة غير صالحة: ${message.slice("Invalid ".length)}`;
    }

    return "حدث خطأ أثناء تنفيذ الطلب.";
}

function translateValidationIssue(issue, language = "en") {
    if (language !== "ar") {
        return issue.message;
    }

    const knownTranslation = translateMessage(issue.message, language);
    if (knownTranslation !== "حدث خطأ أثناء تنفيذ الطلب.") {
        return knownTranslation;
    }

    switch (issue.code) {
        case "invalid_type":
            return "نوع القيمة غير صحيح.";
        case "too_small":
            return "القيمة أقل من الحد الأدنى المسموح.";
        case "too_big":
            return "القيمة تتجاوز الحد الأقصى المسموح.";
        case "invalid_format":
            return "صيغة القيمة غير صحيحة.";
        case "unrecognized_keys":
            return "يتضمن الطلب حقولًا غير معروفة.";
        default:
            return "قيمة غير صالحة.";
    }
}

function translateErrorDetails(value, language = "en") {
    if (Array.isArray(value)) {
        return value.map((item) => {
            if (typeof item === "string") {
                return translateMessage(item, language);
            }

            return translateErrorDetails(item, language);
        });
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [
                key,
                key === "message" && typeof item === "string"
                    ? translateMessage(item, language)
                    : item && typeof item === "object"
                        ? translateErrorDetails(item, language)
                        : item,
            ]),
        );
    }

    return value;
}

module.exports = { translateErrorDetails, translateMessage, translateValidationIssue };