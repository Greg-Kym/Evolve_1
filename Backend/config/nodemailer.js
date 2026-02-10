import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // REQUIRED for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Adding this helps bypass potential certificate issues in local dev
  tls: {
    rejectUnauthorized: false
  }
});

export default transporter;