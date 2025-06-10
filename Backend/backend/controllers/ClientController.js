const ClientModel = require("../model/client");

// Fetch all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await ClientModel.getAllClients();
    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch client by ID
exports.getClientById = async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await ClientModel.getClientById(clientId);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    res.json(client);
  } catch (err) {
    console.error("Error fetching client:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
