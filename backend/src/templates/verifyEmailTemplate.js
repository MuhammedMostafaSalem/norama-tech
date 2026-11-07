const escapeHtml = require("../utils/escapeHtml");

function verifyEmailTemplate(username, otp) {
    const safeUsername = escapeHtml(username);
    const safeOtp = escapeHtml(otp);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <title>Verify your Norama Tech email</title>
</head>
<body style="margin:0;padding:32px 16px;background:#07111f;font-family:Arial,sans-serif;color:#f3f7fc;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#0e1d30;border:1px solid #203650;border-radius:12px;">
        <tr><td style="padding:28px 32px 12px;text-align:center;">
            <p style="margin:0;color:#69d2ff;font-size:13px;font-weight:bold;letter-spacing:2px;">NORAMA TECH</p>
            <h1 style="margin:20px 0 12px;font-size:25px;color:#f3f7fc;">Verify your email</h1>
            <p style="margin:0;color:#9aacc2;line-height:1.6;">Hello <strong style="color:#f3f7fc;">${safeUsername}</strong>, use this code to verify your account.</p>
        </td></tr>
        <tr><td style="padding:18px 32px;text-align:center;">
            <div style="padding:18px;background:#12243a;border:1px solid #31527a;border-radius:8px;color:#69d2ff;font-size:32px;font-weight:bold;letter-spacing:8px;">${safeOtp}</div>
            <p style="margin:18px 0 0;color:#9aacc2;font-size:14px;">This code expires in <strong style="color:#f3f7fc;">10 minutes</strong>.</p>
        </td></tr>
        <tr><td style="padding:14px 32px 28px;text-align:center;color:#647a94;font-size:12px;line-height:1.6;">If you did not create an account, you can ignore this email.<br />&copy; ${new Date().getFullYear()} Norama Tech</td></tr>
    </table>
</body>
</html>`;
}

module.exports = verifyEmailTemplate;