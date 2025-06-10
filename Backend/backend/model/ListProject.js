const db = require('../config/db');

const Project = {
  getAllProjects: async () => {
    const query = 'SELECT project_id AS id, name FROM projects';
    try {
      const [results] = await db.query(query);
      return results;
    } catch (err) {
      throw new Error(err);
    }
  },

  getListUser: async (user_id) => {
    const query = `CALL GET_LIST_PROJECT(?)`;
    try {
      const [rows] = await db.query(query, [user_id]);
      console.log("fFEwefFSDDDDDDDDDDDDDDD");
       // Use db.query() instead of db.execute()
      return rows[0]; // Stored procedures return results as an array
    } catch (err) {
      throw new Error(err);
    }
  }
};

module.exports = Project;
