const { createMailer } = require("../config/mailer");

async function sendEmail({ email, subject, message, html }) {
    const mailer = createMailer();

    return mailer.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject,
        text: message,
        html,
    });
}

module.exports = sendEmail;