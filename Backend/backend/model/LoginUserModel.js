const db = require('../config/db');

const User = {
  findByEmail: async (email) => {
    const query = `
      SELECT user.*, role.role_id, role.name AS role_name 
      FROM user 
      JOIN role ON user.role_id = role.role_id 
      WHERE email = ?`;
      try {
        const [results] = await db.query(query, [email]);
        return results.length ? results[0] : null; // Return the first result or null if no user found
      } catch (err) {
        throw new Error(err);
      }
  },
  findById: async (userId) => {
    const query = `
      SELECT user.*, role.role_id, role.name AS role_name 
      FROM user 
      JOIN role ON user.role_id = role.role_id 
      WHERE user.user_id = ?`;
      try {
        const [results] = await db.query(query, [userId]);
        return results.length ? results[0] : null; // Return the first result or null if no user found
      } catch (err) {
        throw new Error(err);
      }
  }
};

module.exports = User;
