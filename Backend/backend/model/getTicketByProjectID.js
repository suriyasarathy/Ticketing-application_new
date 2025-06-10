const db = require("../config/db");

exports.getTicketsByProjectId = async (projectId) => {
    const query = `
        SELECT t.ticket_id
        FROM tickets t
        JOIN projects p ON p.project_id = t.project_id
        WHERE p.project_id = ?;
    `;

    try {
        const [results] = await db.query(query, [projectId]);
        return results;
    } catch (error) {
        throw new Error(error.message);
    }
};
