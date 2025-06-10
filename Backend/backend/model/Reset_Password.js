const db = require("../config/db");

class Reset_Password {
  // Find user by email
  static async findByEmail(email) {
    const [user] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    return user.length ? user[0] : null;
  }

  // Store reset token and expiry time
  static async updateResetToken(email, token) {
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
    await db.query(
      "UPDATE user SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, expiryTime, email]
    );
  }

  // Find user by valid reset token
  static async findByResetToken(token) {
    const [user] = await db.query(
      "SELECT * FROM user WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [token]
    );
    return user.length ? user[0] : null;
  }

  // Update user password and remove token
  static async updatePassword(email, hashedPassword) {
    await db.query(
      "UPDATE user SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
      [hashedPassword, email]
    );
  }
}

module.exports = Reset_Password;
