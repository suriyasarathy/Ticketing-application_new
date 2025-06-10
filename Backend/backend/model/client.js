const db = require("../config/db");

const ClientModel = {
  // Fetch all clients
  getAllClients: async () => {
    try {
      const [rows] = await db.query("SELECT id, name, email, phone FROM clients");
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // Fetch client by ID
  getClientById: async (clientId) => {
    try {
      const [rows] = await db.query("SELECT id, name, email, phone FROM clients WHERE id = ?", [clientId]);
      return rows.length ? rows[0] : null; // Return the first matching client or null if not found
    } catch (err) {
      throw err;
    }
  },
};

module.exports = ClientModel;
