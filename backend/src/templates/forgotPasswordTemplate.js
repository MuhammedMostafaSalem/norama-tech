// Module: Builds the English HTML password-reset email.
const escapeHtml = require("../utils/escapeHtml");

function forgotPasswordTemplate(username, otp) {
    const safeUsername = escapeHtml(username);
    const safeOtp = escapeHtml(otp);
    const title = "Reset your password";
    const greeting = "Hello";
    const instruction = "Use this code to reset your Norama Tech password.";
    const expiry = "This code expires in 10 minutes.";
    const warning = "If you did not request a reset, ignore this email and your password will remain unchanged.";

    return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <title>${title}</title>
</head>
<body style="margin:0;padding:32px 16px;background:#07111f;font-family:Arial,sans-serif;color:#f3f7fc;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#0e1d30;border:1px solid #203650;border-radius:12px;">
        <tr><td style="padding:28px 32px 12px;text-align:center;">
            <p style="margin:0;color:#69d2ff;font-size:13px;font-weight:bold;letter-spacing:2px;">NORAMA TECH</p>
            <h1 style="margin:20px 0 12px;font-size:25px;color:#f3f7fc;">${title}</h1>
            <p style="margin:0;color:#9aacc2;line-height:1.8;">${greeting} <strong style="color:#f3f7fc;">${safeUsername}</strong>, ${instruction}</p>
        </td></tr>
        <tr><td style="padding:22px 32px;text-align:center;">
            <div style="padding:18px;background:#12243a;border:1px solid #31527a;border-radius:8px;color:#69d2ff;font-size:32px;font-weight:bold;letter-spacing:8px;">${safeOtp}</div>
            <p style="margin:20px 0 0;color:#9aacc2;font-size:14px;">${expiry}</p>
        </td></tr>
        <tr><td style="padding:14px 32px 28px;text-align:center;color:#647a94;font-size:12px;line-height:1.8;">${warning}<br />&copy; ${new Date().getFullYear()} Norama Tech</td></tr>
    </table>
</body>
</html>`;
}

module.exports = forgotPasswordTemplate;
