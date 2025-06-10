const db = require('../config/db');

const Ticket = {
    fetchTickets: async (ticketId) => {
        console.log("Fetching Ticket ID:", ticketId);
        
        const baseQuery = `
            SELECT 
                t.Ticket_id,
                t.Tittle,
                t.description,
                t.priority,
                t.status,
                t.created_at,
                t.updated_at,
                t.Due_date,
                t.Tagging,
                t.Ip_address,
                t.type,
                r.name AS reporter_name,
                COALESCE(a.name, '') AS assignee_name,  -- Handle NULL case
                p.name AS project_name,
                at.attach_id,
                at.file_name,
                at.file_path,
                at.file_type
            FROM 
                tickets t
            JOIN 
                user r ON t.reported_id = r.user_id
            LEFT JOIN 
                user a ON t.assigin_id = a.user_id  -- Changed to LEFT JOIN
            JOIN 
                projects p ON t.project_id = p.project_id
            LEFT JOIN 
                attachments at ON t.Ticket_id = at.ticket_id
        `;

        const query = ticketId ? `${baseQuery} WHERE t.Ticket_id = ?` : baseQuery;

        const [results] = await db.query(query, ticketId ? [ticketId] : []);
        
        console.log("Query Results:", results);
        
        if (results.length === 0) {
            return [];  // Ensure we return an empty array if no tickets are found
        }

        const ticketsMap = new Map();

        results.forEach(row => {
            const ticketId = row.Ticket_id;

            if (!ticketsMap.has(ticketId)) {
                ticketsMap.set(ticketId, {
                    Ticket_id: row.Ticket_id,
                    Tittle: row.Tittle,
                    description: row.description,
                    priority: row.priority,
                    status: row.status,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    Due_date: row.Due_date,
                    Tagging: row.Tagging,
                    Ip_address: row.Ip_address,
                    type: row.type,
                    reporter_name: row.reporter_name,
                    assignee_name: row.assignee_name,  // Now handles NULL properly
                    project_name: row.project_name,
                    attachments: []
                });
            }

            if (row.attach_id) {
                ticketsMap.get(ticketId).attachments.push({
                    attach_id: row.attach_id,
                    file_name: row.file_name,
                    file_path: row.file_path,
                    file_type: row.file_type
                });
            }
        });

        return Array.from(ticketsMap.values());
    }
};

module.exports = Ticket;
