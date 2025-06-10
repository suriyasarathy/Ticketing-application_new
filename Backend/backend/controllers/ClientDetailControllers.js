// clientController.js
const db = require("../config/db"); // Assuming you have a db.js file for MySQL connection

// Add a new client
exports.addClient = (req, res) => {
  const { name, email, phone, company_name, language, time_zone, department, location } = req.body;

  const query = `
    INSERT INTO clients (name, email, phone, company_name, language, time_zone, department, location, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(query, [name, email, phone, company_name, language, time_zone, department, location], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding client", error: err });
    }
    res.status(201).json({ message: "Client added successfully", clientId: result.insertId });
  });
};

// Update an existing client
exports.updateClient = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company_name, language, time_zone, department, location } = req.body;

  const query = `
    UPDATE clients
    SET name = ?, email = ?, phone = ?, company_name = ?, language = ?, time_zone = ?, department = ?, location = ?
    WHERE id = ?
  `;

  db.query(query, [name, email, phone, company_name, language, time_zone, department, location, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating client", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client updated successfully" });
  });
};
