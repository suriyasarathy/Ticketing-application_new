// model/roleModel.js
const db = require('../config/db');  // Import your database configuration

const roleModel = {
  getAllRoles: async () => {
    const query = 'SELECT * FROM role';
    try {
      const [results] = await db.query(query);  // Use promise() for async/await
      return results;
    } catch (err) {
      throw new Error('Error fetching roles: ' + err.message);  // Handle the error
    }
  }
};

module.exports = roleModel;
