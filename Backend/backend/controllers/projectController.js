const ProjectModel =require("../model/projectModel")


const createProject = async (req, res) => {
  try {
    const {
      projectId,
      name,
      user_id,
      description,
      project_manager_id,
      client_id,
      phase_id,
      teams,
      allow_ticket_reassign,
      default_priority,
      default_status,
      enable_custom_priorities, // New field
      custom_priorities,
      enable_custom_statuses, // New field
      custom_statuses
    } = req.body;

    if (!name || !project_manager_id || !client_id ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const CreateProject = await ProjectModel.createProject({
      projectId,
      name,
      user_id,
      description,
      project_manager_id,
      client_id,
      phase_id,
    });

    await ProjectModel.assignTeamsToProject(projectId, teams);

    await ProjectModel.createProjectSettings(projectId, {
      allow_ticket_reassign,
      default_priority,
      default_status,
      enable_custom_priorities, // Pass new field
      custom_priorities,
      enable_custom_statuses, // Pass new field
      custom_statuses,
    });

    res.status(201).json({ message: "Project created successfully", projectId });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { createProject };
