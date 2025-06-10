const db =require('../config/db');



exports.createNotification = async (userId, ticketId, content) => {
    try {
        const query = `
            INSERT INTO notifications (user_id, type, content, meta, is_read)
            VALUES (?, ?, ?, ?, 0)
        `;
        const type = 'ticket_created'; // you can use enums or strings as needed
        const meta = JSON.stringify({ ticket_id: ticketId });

        const [result] = await db.query(query, [
            userId,
            type,
            content,
            meta
        ]);

        return result;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};
