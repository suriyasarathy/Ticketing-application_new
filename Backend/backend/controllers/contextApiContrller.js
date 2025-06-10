const express = require("express");
const app = express.Router();


exports.ProjectIdSet = async (req, res) => {const { projectId } = req.body;
  console.log("Project ID:", projectId);
  
  if (!projectId) return res.status(400).json({ error: 'Project ID required' });

  req.session.projectId = projectId;
  res.status(200).json({ message: 'Project ID saved' })};

exports.ProjectIdGet = async (req, res) => {
     if (!req.session.projectId) {
    return res.status(404).json({ error: 'No project selected' });
  }

  res.status(200).json({ projectId: req.session.projectId });
};

exports.PrevebntsessionExpried = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Session expired' });
  }

  res.status(200).json({ message: 'Session active' });
};

