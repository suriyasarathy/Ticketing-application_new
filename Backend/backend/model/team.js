const db = require('../config/db');

const Team = {
    findAllTeam: async () => {
        const query = 'SELECT team_id AS id, name FROM teams';
        const [rows] = await db.query(query);
        return rows;
    },

    createTeam: async (name, teamLeadId) => {
        const query = 'INSERT INTO teams (name, team_lead_id) VALUES (?, ?)';
        const [result] = await db.query(query, [name, teamLeadId]);
        return result.insertId;
    },

    // Insert new records, keeping the existing ones intact
    updateUsersWithTeamId: async (teamId, members) => {
        const insertQuery = `
         INSERT IGNORE INTO user_teams (user_id, team_id) 
VALUES ?;
`;
        const values = members.map(userId => [userId, teamId]);
    
        await db.query(insertQuery, [values]);
    },

    // Remove a user from a specific team
    removeUserFromTeam: async (userId, teamId) => {
        const query = 'DELETE FROM user_teams WHERE user_id = ? AND team_id = ?';
        await db.query(query, [userId, teamId]);
    }
};




module.exports = Team;
