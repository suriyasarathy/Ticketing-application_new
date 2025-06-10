const { getTicketsByProjectId } = require("../model/getTicketByProjectID.js");

const AdmminProjectListTicket= async (req, res) => {
    try {
        const projectId = req.query.id; // Retrieve project_id from query params
        console.log("Received projectId:", projectId); // Debugging step

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const tickets = await getTicketsByProjectId(projectId);

        if (!Array.isArray(tickets) || tickets.length === 0) {
            return res.status(404).json({ message: "No tickets found for this project" });
        }

        res.status(200).json(tickets);
    } catch (error) {
        console.error("❌ Error fetching project tickets:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = { AdmminProjectListTicket };
