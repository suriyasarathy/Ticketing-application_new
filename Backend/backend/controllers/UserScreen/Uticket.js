const Ticket = require('../../model/userTicket');

exports.getUserTickets = async (req, res) => {
    try {
        const userId = req.query.userId;  // Retrieve the user_id from query params

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const tickets = await Ticket.fetchUserTickets(userId);
        
        if (tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found for this user' });
        }

        res.status(200).json(tickets);
    } catch (err) {
        console.error('Error fetching user tickets:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

