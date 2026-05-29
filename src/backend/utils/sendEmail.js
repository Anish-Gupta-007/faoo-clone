const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a transactional email.
 * @param {object} params
 * @param {string}   params.to      - Recipient email address
 * @param {string}   params.subject - Email subject line
 * @param {string}   params.html    - HTML email body
 */
const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Faoo" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
