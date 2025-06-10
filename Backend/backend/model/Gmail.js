const db = require("../config/db");

const Gmail = {
    checkProjectId: async (project_id) => {
        const query = `SELECT project_id FROM projects WHERE project_id = ?`;
        try {
            const [result] = await db.execute(query, [project_id]);
            return result.length ? result[0].project_id : null;
        } catch (err) {
            console.error("❌ Error checking project_id:", err.message);
            return null;
        }
    },
    
    checkUser: async (gmail) => {
        const query = `SELECT user_id FROM user WHERE email = ?`;
        try {
            const [result] = await db.execute(query, [gmail]);
            if (result.length === 0) {
                console.log(`❌ No user found for email: ${gmail}`);
                return null;
            }
            return result.length ? result[0].user_id : null;
            
        } catch (err) {
            console.error("❌ Error checking user:", err.message);
            return null;
        }
    },    

    checkPreviousTicketId: async (project_id) => {
        const query = `SELECT ticket_id FROM tickets WHERE project_id = ? ORDER BY ticket_id DESC LIMIT 1`;
        try {
            const [rows] = await db.execute(query, [project_id]);
            let lastTicketId = rows.length > 0 ? rows[0].ticket_id : null;

            lastTicketId = lastTicketId ? String(lastTicketId) : null;
            const prefix = String(project_id).substring(0, 4);
            let newTicketId;

            if (lastTicketId) {
                const lastNumber = parseInt(lastTicketId.substring(4), 10);
                newTicketId = `${prefix}${String(lastNumber + 1).padStart(6, '0')}`;
            } else {
                newTicketId = `${prefix}000001`;
            }

            return newTicketId;
        } catch (error) {
            console.error("Error generating Ticket ID:", error.message);
            throw error;
        }
    },

    insertTicket: async (project_id, ticket_id, reporter_id, subject, message) => {
        const query = `INSERT INTO tickets (project_id, ticket_id, reported_id, Tittle, description, priority, status) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        try {
            await db.execute(query, [project_id, ticket_id, reporter_id, subject, message, 'low', 'open']);

            console.log("✅ Ticket stored successfully.");
        } catch (err) {
            console.error("❌ Error saving ticket:", err.message);
        }
    }
,    

insertTicketEmailTable: async (senderEmail, subject, message) => {
    const checkQuery = `SELECT Email_ticket_id FROM email_tickets WHERE sender = ? AND subject = ? LIMIT 1`;
    const insertQuery = `INSERT INTO email_tickets (sender, subject, message) VALUES (?, ?, ?)`;

    try {
        const [existing] = await db.execute(checkQuery, [senderEmail, subject]);
        if (existing.length) {
            console.log("⚠️ Email already exists in email_tickets.");
            return;
        }

        await db.execute(insertQuery, [senderEmail, subject, message]);
        console.log("✅ Email stored in email_tickets.");
    } catch (err) {
        console.error("❌ Error saving email ticket:", err.message);
    }
}
};

module.exports = { Gmail };
