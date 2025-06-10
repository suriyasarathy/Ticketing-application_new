const { AdminProjectTicketList } = require("../model/AdminProjectTicketList")



const adminProjectTicketList = async (req, res) => {
    try {
        const projectData = await AdminProjectTicketList();

        if (!Array.isArray(projectData) || projectData.length === 0) {
            return res.status(404).json({ message: "No project or ticket data found" });
        }

        res.json(projectData);
    } catch (error) {
        console.error("❌ Error fetching project and ticket details:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = { adminProjectTicketList };
