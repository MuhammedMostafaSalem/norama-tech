// Module: Creates the SMTP transport used to deliver application emails.
const nodemailer = require("nodemailer");

function createMailer() {
  const host = process.env.SMTP_HOST;

  if (!host) {
    throw new Error(
      "SMTP_HOST must be set before creating the mail transporter.",
    );
  }

  const user = process.env.SMTP_USER;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    ...(user
      ? {
          auth: {
            user,
            pass: process.env.SMTP_PASSWORD,
          },
        }
      : {}),
  });
}

module.exports = { createMailer };
