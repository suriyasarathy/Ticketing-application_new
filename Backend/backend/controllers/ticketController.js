const Ticket = require('../model/ticket');

exports.getAllTickets = async (req, res) => {
    try {
        const ticketId = req.query.id;
        const tickets = await Ticket.fetchTickets(ticketId);
        res.status(200).json(tickets);
    } catch (err) {
        console.error('Error fetching tickets:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
