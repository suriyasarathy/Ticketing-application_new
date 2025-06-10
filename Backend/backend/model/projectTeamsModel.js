const db = require("../config/db");

const getProjectTeams = async (projectId) => {
  const sql = `
        SELECT 
    p.project_id, 
    p.name AS project_name, 
    t.team_id, 
    t.name AS team_name, 
    t.team_lead_id, 
    lead_user.name AS team_lead_name,  -- Fetch the team lead's name
    u.user_id, 
    u.name AS user_name
FROM projects p 
JOIN team_projects tp ON tp.project_id = p.project_id  -- Link projects to teams
JOIN teams t ON t.team_id = tp.team_id  -- Get teams in the project
JOIN user_teams ut ON ut.team_id = t.team_id  -- Get user-team relationships
JOIN user u ON u.user_id = ut.user_id  -- Get user details
LEFT JOIN user lead_user ON lead_user.user_id = t.team_lead_id  -- Fetch the team lead's name
WHERE p.project_id = ?;
 `;

  const [rows] = await db.execute(sql, [projectId]);
  return rows;
};

module.exports = { getProjectTeams };
