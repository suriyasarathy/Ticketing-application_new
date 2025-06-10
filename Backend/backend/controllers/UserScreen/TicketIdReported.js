const getusercreaateTicket = require("../../model/UserCreateTicket");

exports.getuserTicket = async (req, res) => {
    const { ticket_id } = req.params;

    if (!ticket_id) {
        return res.status(400).json({ Message: "Need ticket ID" });
    }

    try {
        const result = await getusercreaateTicket.getusercreaateTicket(ticket_id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ Message: "Error fetching ticket", error: error.message });
    }
};
