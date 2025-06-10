const ProjectModel = require("../model/ProjectGetModel");

const parseArray = (data) => {
  try {
    if (!data) return [];
    if (Array.isArray(data)) return data; // Already an array
    if (typeof data === "string") {
      if (data.startsWith("[") && data.endsWith("]")) {
        return JSON.parse(data); // Valid JSON array
      }
      return data.split(",").map((item) => item.trim()); // Convert CSV to array
    }
    return [];
  } catch (err) {
    console.error("Error parsing array:", err);
    return [];
  }
};

const getProjectSettings = async (req, res) => {
  try {
    const { project_id } = req.params;
    console.log(project_id);
    

    const settings = await ProjectModel.getProjectSettings(project_id);

    if (!settings) {
      return res.status(404).json({ message: "Project settings not found" });
    }

    // Convert stored values to arrays
    const defaultPriorities = parseArray(settings.default_priority);
    const defaultStatuses = parseArray(settings.default_status);
    let priorities = [...defaultPriorities];
    let statuses = [...defaultStatuses];

    if (settings.enable_custom_priorities) {
      const customPriorities = parseArray(settings.custom_priorities);
      priorities = [...new Set([...defaultPriorities, ...customPriorities])]; // Merge & remove duplicates
    }

    if (settings.enable_custom_statuses) {
      const customStatuses = parseArray(settings.custom_statuses);
      statuses = [...new Set([...defaultStatuses, ...customStatuses])]; // Merge & remove duplicates
    }

    res.json({
      allow_ticket_reassign: settings.allow_ticket_reassign,
      priorities,
      statuses
    });
  } catch (error) {
    console.error("Error fetching project settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getProjectSettings };
