const projectAlter = require("../../model/ProjectSetting/ListOfProject");
const db =require("../../config/db");
const { useParams } = require("react-router-dom");
const projectmodifyController = {
    // Get Project Details
    getProjectDetails: async (req, res) => {
        try {
            const { project_id } = req.params;
            console.log(project_id)
            const project = await projectAlter.getProjectDetails(project_id);
            res.json(project);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateProject: async (req, res) => {
        try {
            const { project_id } = req.params;
            const updates = req.body;
    
            const result = await projectAlter.updateProject(project_id, updates);
            res.json({ message: "Project updated successfully", result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    updateTicket: async (req, res) => {
        try {
            const { Ticket_id } = req.params;  // ✅ Correct way to get the parameter
            const updatedFields = req.body;
            console.log(updatedFields,Ticket_id);
            
    
            if (!Ticket_id) {
                return res.status(400).json({ error: "Ticket ID is required" });
            }
    
            if (Object.keys(updatedFields).length === 0) {
                return res.status(400).json({ error: "No fields provided for update" });
            }
    
            const updatedTicket = await projectAlter.updateTicketDetails(Ticket_id, updatedFields);
    
            return res.json({ message: "Ticket updated successfully", ticket: updatedTicket });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
   
    
// Add Team to Project
addTeamToProject: async (req, res) => {
    try {
        const { project_id, team_id } = req.body;
        const result = await projectAlter.addTeamToProject(project_id, team_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},


    // Delete Projects
    deleteProjects: async (req, res) => {
        try {
            const { project_ids } = req.body;
            console.log(project_ids);
            
            const result = await projectAlter.projectdelete(project_ids);
            res.json({ message: "Projects deleted successfully", result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Remove Team from Project
removeTeamFromProject: async (req, res) => {
    try {
        const { project_id, team_id } = req.body;
        console.log(project_id,team_id);
        
        const result = await projectAlter.removeTeamFromProject(project_id, team_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},


    // Add Team Member
    addTeamMember: async (req, res) => {
        try {
            const { team_id, member_id } = req.body;
            const result = await projectAlter.addTeamMember(team_id, member_id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Remove Team Member
    removeTeamMember: async (req, res) => {
        try {
            const { team_id, member_id } = req.body;
           
            console.log(team_id,member_id);
            
            const result = await projectAlter.removeTeamMember(team_id, member_id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update Team Member Role
    updateTeamMemberRole: async (req, res) => {
        try {
            const { user_id, role_id } = req.body;
            const result = await projectAlter.updateTeamMemberRole(user_id, role_id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getTicketDetails: async (req, res) => {
        try {
            const { ticket_id } = req.params;
    
            // Fetch ticket details
            const ticketQuery = `SELECT * FROM tickets WHERE ticket_id = ?`;
            const [ticket] = await db.query(ticketQuery, [ticket_id]);
    
            if (!ticket) {
                return res.status(404).json({ error: "Ticket not found" });
            }
    
            
    
            res.json({
                ticket
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Reassign Ticket
    reassignTicket: async (req, res) => {
        try {
            const { ticket_id, assigned_to } = req.body;
            
            
            const result = await projectAlter.reassignTicket(ticket_id, assigned_to);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Update Project Settings
    updateProjectSettings: async (req, res) => {
        try {
            const { project_id } = req.params;
            const updates = req.body;
            const result = await projectAlter.projectSettingChange(project_id, updates);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get Project Settings
    getProjectSettings: async (req, res) => {
        try {
            const { project_id } = req.params;
            const result = await projectAlter.getProjectSettings(project_id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = projectmodifyController;
