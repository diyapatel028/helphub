import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE||"true") === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendMail({ to, subject, html }) {
  if (!process.env.SMTP_USER) {
    console.log("Email not sent (SMTP not configured). Would have sent to:", to, subject);
    return Promise.resolve();
  }
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  return transporter.sendMail({ from, to, subject, html });
}
