const db = require("../config/db");

const UserCreateMangerment = {
    getusercreaateTicket: async (ticket_id) => {
        const query = `SELECT ticket_id FROM tickets WHERE reported_id = ?`;

        try {
            const [results] = await db.query(query, [ticket_id]);
            return results;
        } catch (err) {
            console.log("Error occurred while fetching ticket:", err);
            throw new Error("Database error");
        }
    }
};

module.exports = UserCreateMangerment;
