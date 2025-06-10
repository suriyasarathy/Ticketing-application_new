const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../model/Reset_Password");
const transporter = require("../config/mailer");





exports.sendResetEmail = async (req, res) => {
  const { email } = req.body;
  
  console.time("Total Execution Time");

  try {
    console.time("DB Query: Find User");
    const user = await User.findByEmail(email);
    console.timeEnd("DB Query: Find User");

    if (!user) {
      console.timeEnd("Total Execution Time");
      return res.status(404).json({ message: "User not found" });
    }

    console.time("Token Generation");
    const token = crypto.randomBytes(32).toString("hex");
    console.timeEnd("Token Generation");

    const resetLink = `http://localhost:3001/reset-password/${token}`;

    console.time("DB Query: Update Reset Token");
    await User.updateResetToken(email, token);
    console.timeEnd("DB Query: Update Reset Token");

    console.time("Email Sending");
    await transporter.sendMail({
      from: "testmail.ebramha@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Click the following link to reset your password: ${resetLink}`,
    });
    console.timeEnd("Email Sending");

    console.timeEnd("Total Execution Time");
    res.json({ message: "Password reset link sent to your email." });

  } catch (error) {
    console.timeEnd("Total Execution Time");
    res.status(500).json({ error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  console.time("Total Execution Time");

  try {
    console.time("DB Query: Find User by Token");
    const user = await User.findByResetToken(token);
    console.timeEnd("DB Query: Find User by Token");

    if (!user) {
      console.timeEnd("Total Execution Time");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    console.time("Password Hashing");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.timeEnd("Password Hashing");

    console.time("DB Query: Update Password");
    await User.updatePassword(user.email, hashedPassword);
    console.timeEnd("DB Query: Update Password");

    console.timeEnd("Total Execution Time");
    res.json({ message: "Password has been reset successfully." });

  } catch (error) {
    console.timeEnd("Total Execution Time");
    res.status(500).json({ error: error.message });
  }
};
