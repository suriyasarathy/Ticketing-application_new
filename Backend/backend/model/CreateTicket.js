const db = require("../config/db");
const path = require("path");

// Generate Ticket ID
async function generateTicketId(project_id) {
    try {
        const [rows] = await db.query(
            `SELECT ticket_id FROM tickets WHERE project_id = ? ORDER BY ticket_id DESC LIMIT 1`,
            [project_id]
        );
        console.log("rows",rows);
        
        

        let lastTicketId = rows.length > 0 ? rows[0].ticket_id : null;
        lastTicketId = lastTicketId ? String(lastTicketId) : null;
        console.log(lastTicketId);

        // Extract first 4 digits from project_id
        const prefix = String(project_id).substring(0, 4);
        let newTicketId;
        console.log(prefix);
        

        if (lastTicketId) {
            const lastNumber = parseInt(lastTicketId.substring(4), 10);
            newTicketId = `${prefix}${String(lastNumber + 1).padStart(6, '0')}`;
        } else {
            newTicketId = `${prefix}000001`;
        }
        console.log(newTicketId);

        return newTicketId;
    } catch (error) {
        console.error("Error generating Ticket ID:", error);
        throw error;
    }
}

// Insert Ticket
const insertTicket = async (ticketData) => {
    const query = `
        INSERT INTO tickets (
            ticket_id,Tittle, description, priority, status, project_id, reported_id, 
            assigin_id, due_date, tagging, ip_address, type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, ticketData);
    return result.insertId;
};

// Insert Comment
const insertComment = async (ticketId, reportedId, comment) => {
    const query = `INSERT INTO comments(ticket_id, user_id, comment) VALUES (?, ?, ?)`;
    await db.query(query, [ticketId, reportedId, comment]);
};

module.exports = {
    generateTicketId,
    insertTicket,
    insertComment
};
