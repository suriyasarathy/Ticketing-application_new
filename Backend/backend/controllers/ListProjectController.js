const Project = require('../model/ListProject');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.getAllProjects();
    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

exports.getProjectUser = async (req, res) => {
  const userID = req.params.userId; 
  console.log("userId",userID);
  // Fix typo: req.params (not req.parms)

  if (!userID) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const projects = await Project.getListUser(userID);
    res.status(200).json({ projects });
  } catch (err) { // Fix: Catch error properly
    console.error('Error fetching user projects:', err);
    res.status(500).json({ message: 'Error fetching user projects' });
  }
};
