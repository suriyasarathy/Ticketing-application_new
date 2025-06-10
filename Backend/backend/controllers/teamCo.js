const Team = require('../model/team');
const db =require("../config/db")

exports.getTeam = async (req, res) => {
    try {
        const result = await Team.findAllTeam();
        res.json(result);
    } catch (err) {
        console.error('Error fetching team:', err);
        res.status(500).json({ message: 'Error fetching team details' });
    }
};
exports.getAvailableMembers = async (req, res) => {
    console.log("Fetching available members (not assigned to any team)");

    const query = `
        SELECT u.user_id, u.name, u.email
        FROM user u
        LEFT JOIN user_teams ut ON u.user_id = ut.user_id
        WHERE ut.team_id IS NULL;
    `;

    try {
        const [results] = await db.query(query);
        if (results.length === 0) {
            return res.status(404).json({ message: "No available members found" });
        }
        res.json(results);
    } catch (err) {
        console.error("Error fetching available members:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getTeamMembers = async (req, res) => {
    const teamId = req.params.team_id;
    console.log("Fetching members for team:", teamId);

    const query = `
    SELECT u.user_id, u.name, u.email
    FROM user_teams ut
    JOIN user u ON ut.user_id = u.user_id  -- FIXED: Changed "users" to "user"
    WHERE ut.team_id = ?;
`;



    try {
        const [results] = await db.query(query, [teamId]); // Use await properly
        if (results.length === 0) {
            return res.status(404).json({ message: "No members found for this team" });
        }
        res.json(results);
    } catch (err) {
        console.error("Error fetching team members:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.deleteTeam = async (req, res) => {
    const { team_id } = req.query;
    console.log("Deleting team ID:", team_id);

    try {
        // First delete any user-team mappings
        await db.query(`DELETE FROM user_teams WHERE team_id = ?`, [team_id]);

        // Then delete the team itself
        const [result] = await db.query(`DELETE FROM teams WHERE team_id = ?`, [team_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Team not found or already deleted" });
        }

        return res.status(200).json({ message: "Team deleted successfully" });

    } catch (e) {
        console.error("Error deleting team:", e);
        return res.status(500).json({ error: "Internal Server Error", details: e.message });
    }
};

// API to create a new team and update the user-team mappings
exports.postTeam = async (req, res) => {
    try {
        const { name, team_lead_id, members } = req.body;

        if (!name || !team_lead_id || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ message: 'Team name, team lead, and members are required' });
        }

        const teamId = await Team.createTeam(name, team_lead_id);
        await Team.updateUsersWithTeamId(teamId, members);

        res.status(201).json({ message: 'Team created and users updated successfully', teamId });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// API to allow a user to exit a team
exports.removeUserFromTeam = async (req, res) => {
    try {
        const { userId, teamId } = req.body;

        if (!userId || !teamId) {
            return res.status(400).json({ message: 'User ID and Team ID are required' });
        }

        await Team.removeUserFromTeam(userId, teamId);

        res.status(200).json({ message: 'User removed from team successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
