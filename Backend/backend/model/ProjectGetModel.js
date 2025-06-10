const db = require("../config/db");

const ProjectModel = {
  getProjectSettings: async (projectId) => {
    const [settings] = await db.query(
      `SELECT * FROM project_settings WHERE project_id = ?`, 
      [projectId]
    );

    return Array.isArray(settings) && settings.length ? settings[0] : null;
  },
};

module.exports = ProjectModel;
