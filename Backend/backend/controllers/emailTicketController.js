const EmailTicket = require('../model/emailTicketModel');

const getEmailTickets = async (req, res) => {  
  try {
    const tickets = await EmailTicket.getAllEmailTickets();
    res.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email tickets',
    });
  }
};

const deleteEmailTicket = async (req, res) => {
    const ticketId = req.params.id;
  
    try {
      const result = await EmailTicket.deleteById(ticketId);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Email ticket not found" });
      }
  
      res.status(200).json({ success: true, message: "Email ticket deleted successfully" });
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
module.exports = {
    deleteEmailTicket,
  getEmailTickets,
};
