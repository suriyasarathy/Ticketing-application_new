// controllers/roleController.js
const roleModel = require('../model/roleModel');  // Import the role model

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await roleModel.getAllRoles();  // Fetch roles using the model
    if (roles.length === 0) {
      return res.status(404).send('No roles found');  // Handle empty result
    }
    res.status(200).json(roles);  // Respond with the roles
  } catch (err) {
    console.error('Error fetching roles:', err.message);  // Log the error
    res.status(500).send('Error fetching roles');  // Send error response
  }
};
