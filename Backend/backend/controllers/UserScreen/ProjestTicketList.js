const List = require("../../model/ProjectTicketList");

exports.getListTicket = async (req, res) => {
    const { projectID, userID } = req.params;

    if (!projectID || !userID) {
        return res.status(400).json({ message: "Project ID and User ID are required" });
    }

    try {
        const data = await List.GetTicketList(projectID, userID);
            
        if (!data) {
            return res.status(404).json({ message: "Project not found", data: null });
        }

        res.status(200).json({
            message: "Data retrieved successfully",
            project: data.projectDetails, // Ensure project details are returned
            tickets: {
                assignedToUser: data.assignedToCurrentUser|| [],
                assignedToOthers: data.assignedToOthers || [],
                unassigned: data.unassignedTickets || []
            }
        });
    } catch (error) {
        console.error("Error in getListTicket:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
