const projectTeamsModel = require("../model/projectTeamsModel");

const getProjectTeams = async (req, res) => {
  try {
    const { projectId } = req.params;
    const rows = await projectTeamsModel.getProjectTeams(projectId);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: "No teams found for this project" });
    }

    // Group users by team
    const groupedData = rows.reduce((acc, row) => {
      const teamIndex = acc.findIndex((team) => team.team_id === row.team_id);

      if (teamIndex === -1) {
        acc.push({
          team_id: row.team_id,
          team_name: row.team_name,
          team_lead_id: row.team_lead_id,
          team_lead_name: row.team_lead_name,
          users: [{ user_id: row.user_id, user_name: row.user_name }],
        });
      } else {
        acc[teamIndex].users.push({ user_id: row.user_id, user_name: row.user_name });
      }

      return acc;
    }, []);

    res.json(groupedData);
  } catch (error) {
    console.error("❌ Error fetching project teams:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { getProjectTeams };
