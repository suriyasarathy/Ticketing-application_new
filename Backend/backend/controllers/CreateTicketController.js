const TicketModel = require("../model/CreateTicket");
const notificationModel = require("../model/notification"); // Make sure this path is correct
const { getIO } = require('../config/socket');

const createTicket = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const {
            title, description, priority, status, project_id, 
            reported_id, assign_id, due_date, tagging, ip_address, type, comment
        } = req.body;

        const assignIdValue = parseInt(assign_id, 10) || null; // Default to null if not provided
        const reportedIdValue = parseInt(reported_id, 10);
        const dueDateValue = due_date && due_date.trim() !== '' ? due_date : null;

        
        
        if (isNaN(reportedIdValue) || reportedIdValue <= 0) {
            return res.status(400).json({ message: 'Invalid reported_id.' });
        }
        if (!title) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Generate custom Ticket ID
        const ticketId = await TicketModel.generateTicketId(project_id);
        console.log("Ticket_id",ticketId);
        

        // Insert ticket
        await TicketModel.insertTicket([
            ticketId, title, description, priority, status, project_id, 
            reportedIdValue, assignIdValue, dueDateValue, tagging, ip_address, type
        ]);

        // Insert comment if provided
        if (comment && comment.trim() !== '') {
            await TicketModel.insertComment(ticketId, reportedIdValue, comment);
            return res.status(201).json({ message: 'Ticket and comment created successfully.', ticketId });
        }
 if (assignIdValue) {
            await notificationModel.createNotification(
                assignIdValue,
                ticketId,
                `Ticket #${ticketId} has been assigned to you.`
            );

            const io = getIO();
io.to(assignIdValue.toString()).emit('notification', {
    type: 'ticket_created',
    content: `Ticket #${ticketId} has been assigned to you.`,
    ticket_id: ticketId
});
        }
        res.status(201).json({ message: 'Ticket created successfully.', ticketId });
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    createTicket
};
