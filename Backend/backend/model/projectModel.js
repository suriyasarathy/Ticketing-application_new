const db = require("../config/db");

const ProjectModel = {
  createProject: async ({ projectId,name, user_id, description, project_manager_id, client_id, phase_id }) => {
    const query = `
      INSERT INTO projects (project_id,name, description, user_id, project_manager_id, client_id, phase_id, created_at, updated_at)
      VALUES (?,?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const [result] = await db.query(query, [projectId,name, description, user_id, project_manager_id, client_id, phase_id]);
    return result.insertId;
  },
  assignTeamsToProject : async (projectId, teams) => {
    // Insert teams into team_projects
    const teamValues = teams.map(teamId => [projectId, teamId]);
    await db.query(`INSERT INTO team_projects (project_id, team_id) VALUES ?`, [teamValues]);

    // Fetch all users who belong to the assigned teams
    const [teamUsers] = await db.query(
        `SELECT DISTINCT user_id FROM user_teams WHERE team_id IN (?)`, [teams]
    );

    // If users are found, insert them into project_user
    if (teamUsers.length > 0) {
        const userValues = teamUsers.map(user => [user.user_id, projectId, 1]); // role_id = 1 (default)
        await db.query(`INSERT INTO project_user (user_id, project_id, role_id) VALUES ?`, [userValues]);
    }
},

  
createProjectSettings: async (projectId, settings) => {
  const query = `INSERT INTO project_settings (project_id, allow_ticket_reassign, default_priority, default_status, enable_custom_priorities, custom_priorities, enable_custom_statuses, custom_statuses)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

     await db.query(query, [
      projectId,
      settings.allow_ticket_reassign || false, // Default to false
      JSON.stringify(settings.default_priority || []), // Ensure it's always an array
      JSON.stringify(settings.default_status || []),
      settings.enable_custom_priorities || false,
      JSON.stringify(settings.custom_priorities || []),
      settings.enable_custom_statuses || false,
      JSON.stringify(settings.custom_statuses || [])
  ]);
}
,
};

module.exports = ProjectModel;
