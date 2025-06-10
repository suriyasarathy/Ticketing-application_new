const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testmail.ebramha@gmail.com",
    pass: "ityp zlok axxi xzcx", // App password
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: '"Bug Tracker" <testmail.ebramha@gmail.com>',
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
