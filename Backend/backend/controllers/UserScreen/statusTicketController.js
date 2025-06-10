const Ticket = require('../../model/updateStatus');

const statusMapping = {
  'open': 'In open',
  'in open': 'In open',
  'progress': 'In progress',
  'in progress': 'In progress',
  'resolved': 'resolved',
  'closed': 'closed'
};

const updateTicketStatus = async (req, res) => {
  const { ticketId, status ,changeBy} = req.body;
  console.log("Ticket ID:", ticketId); // Debugging
  

  if (!ticketId || !status) {
    return res.status(400).json({ message: 'Ticket ID and status are required' });
  }


 

  try {
    const results = await Ticket.updateStatus(ticketId,status,changeBy);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket status updated successfully' });
  } catch (err) {
    console.error('Error updating ticket status:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { updateTicketStatus };
