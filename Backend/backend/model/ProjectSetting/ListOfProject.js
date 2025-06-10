const db = require('../../config/db');

const projectAlter = {
    getProjectDetails: async (project_id) => {
        try {
            const projectQuery = `SELECT 
    p.project_id, 
    p.name AS project_name, 
    p.description, 
    p.due_date, 
    u.name AS manager, 
    c.name AS client_name, 
    c.email, 
    c.phone, 
    c.company_name, 
    pp.phase_name 
FROM projects p  
LEFT JOIN user u ON u.user_id = p.project_manager_id  
LEFT JOIN clients c ON p.client_id = c.id  
LEFT JOIN project_phases pp ON pp.id = p.phase_id 
WHERE p.project_id = ?

`;
            const [project] = await db.query(projectQuery, [project_id]);

                console.log(project);
                
            if (project.length === 0) {
                throw new Error("Project not found");
            }

            const teamQuery = `SELECT 
    tp.team_id, 
    t.name AS team_name, 
    u_lead.name AS team_lead, 
    GROUP_CONCAT(DISTINCT u_member.name ORDER BY u_member.name SEPARATOR ', ') AS team_members
FROM 
    team_projects tp
JOIN 
    teams t ON tp.team_id = t.team_id
JOIN 
    user u_lead ON t.team_lead_id = u_lead.user_id
LEFT JOIN 
    user_teams ut ON t.team_id = ut.team_id
LEFT JOIN 
    user u_member ON ut.user_id = u_member.user_id
WHERE 
    tp.project_id = ?
GROUP BY 
    tp.team_id, t.name, u_lead.name;
;
`;
            const [team] = await db.query(teamQuery, [project_id]);


            const ticketQuery = `SELECT t.ticket_id, t.Tittle, t.status, t.priority, u.name  FROM tickets t  join user u on u.user_id =t.assigin_id where  project_id = ?`;
            const [tickets] = await db.query(ticketQuery, [project_id]);

            return { 
                ...project[0], 
                team: team.length > 0 ? team : [], 
                tickets: tickets.length > 0 ? tickets : [] 
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },
    addTeamToProject: async (project_id, team_id) => {
        try {
            // Check if the team is already added to the project
            const [existingTeam] = await db.query(
                "SELECT * FROM team_projects WHERE project_id = ? AND team_id = ?", 
                [project_id, team_id]
            );
    
            if (existingTeam.length > 0) {
                throw new Error("Team is already assigned to this project");
            }
    
            // Add team to project
            const query = `INSERT INTO team_projects (project_id, team_id) VALUES (?, ?)`;
            await db.query(query, [project_id, team_id]);
    
            return { message: "Team added to project successfully" };
        } catch (error) {
            throw new Error(error.message);
        }
    },
    removeTeamFromProject: async (project_id, team_id) => {
        try {
            // Remove team from project
            const query = `DELETE FROM team_projects WHERE project_id = ? AND team_id = ?`;
            await db.query(query, [project_id, team_id]);
    
            return { message: "Team removed from project successfully" };
        } catch (error) {
            throw new Error(error.message);
        }
    },
    updateProject: async (project_id, updates) => {
        const [existingProject] = await db.query(`SELECT * FROM projects WHERE project_id = ?`, [project_id]);
    if (!existingProject) {
         throw new Error("Project not found");
    }

        try {
            if (Object.keys(updates).length === 0) {
                throw new Error("No fields provided for update");
            }
    
            // Build dynamic query
            const fields = Object.keys(updates).map(field => `${field} = ?`).join(", ");
            const values = Object.values(updates);
            
            const query = `UPDATE projects SET ${fields} WHERE project_id = ?`;
            values.push(project_id); // Add project_id to the query values
            
            await db.query(query, values);
    
            return { message: "Project updated successfully" };
        } catch (error) {
            throw new Error(error.message);
        }
    },
    
    
    updateTicketDetails: async (ticket_id, updateData) => {
        try {
            let fields = [];
            let values = [];
    
            for (const key in updateData) {
                let value = updateData[key];
    
                // Check and convert valid ISO strings to MySQL DATETIME format
                if (
                    ["created_at", "updated_at", "Due_date"].includes(key) &&
                    typeof value === "string" &&
                    !isNaN(Date.parse(value))
                ) {
                    const dateObj = new Date(value);
                    value = dateObj.toISOString().slice(0, 19).replace("T", " ");
                }
    
                fields.push(`${key} = ?`);
                values.push(value);
            }
    
            if (fields.length === 0) {
                throw new Error("No valid fields provided");
            }
    
            values.push(ticket_id);
            const query = `UPDATE tickets SET ${fields.join(", ")} WHERE ticket_id = ?`;
    
            await db.query(query, values);
    
            return { ticket_id, ...updateData };
        } catch (error) {
            throw new Error(error.message);
        }
    },     
    projectdelete: async (project_ids) => {
        console.log(project_ids,"project_ids inside projectdelete");
        
        // if (!project_ids || !project_ids.length) {
        //     throw new Error("No project IDs provided");
        // }

        try {
            // const placeholders = project_ids.map(() => '?').join(','); // (?, ?, ?)
            const query = `DELETE FROM projects WHERE project_id IN (${project_ids})`;
            const [result] = await db.query(query, project_ids);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    },
addTeamMember : async (team_id, user_id) => {
        try {
            // Check if user exists
            const [user] = await db.query(`SELECT name, email FROM user WHERE user_id = ?`, [user_id]);
            if (user.length === 0) {
                throw new Error("User not found");
            }
    
            // Check if the user is already in the team
            const [existingMember] = await db.query(
                "SELECT * FROM user_teams WHERE user_id = ? AND team_id = ?", 
                [user_id, team_id]
            );
    
            if (existingMember.length > 0) {
                throw new Error("User is already a team member");
            }
    
            // Add user to team
            const query = `INSERT INTO user_teams (team_id, user_id) VALUES (?, ?)`;
            await db.query(query, [team_id, user_id]);
    
            return { message: "Team member added successfully", user: user[0] };
    
        } catch (error) {
            throw new Error(error.message); // Just throw an error, don't use res.
        }
    },    
    removeTeamMember: async (team_id, user_id) => {
        try {
            console.log(team_id,user_id);
            
            const query = `DELETE FROM user_teams WHERE team_id = ? AND user_id = ?`;
            const result =await db.query(query, [team_id, user_id]);
    console.log(result);
    
            return { message: "User removed from the team successfully" };
        } catch (error) {
            throw new Error(error.message);
        }
    },    
        // Update team member role
    updateTeamMemberRole: async (user_id, role_id) => {
        try {
            const query = `UPDATE user_roles SET role_id = ? WHERE user_id = ?`;
            const [result] = await db.query(query, [role_id, user_id]);
            if (result.affectedRows === 0) throw new Error("User not found in roles");
            return { message: "Team member role updated successfully" };
        } catch (error) {
            throw new Error(error.message);
        }
    },    

    // Reassign ticket
    reassignTicket: async (ticket_id, assigned_to) => {
        try {
            const query = `UPDATE tickets SET assigin_id = ? WHERE ticket_id = ?`;
        
            await db.query(query, [assigned_to, ticket_id]);
            return { message: "Ticket reassigned successfully" };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    projectSettingChange: async (project_id, updates) => {
        if (Object.keys(updates).length === 0) {
            throw new Error("No fields provided for update");
        }

        const jsonFields = ["custom_priorities", "custom_statuses", "default_status", "default_priority"];
        jsonFields.forEach(field => {
            if (updates[field]) {
                updates[field] = JSON.stringify(updates[field]); 
            }
        });

        const fields = Object.keys(updates).map(field => `${field} = ?`).join(", ");
        const values = [...Object.values(updates), project_id];

        const query = `UPDATE project_settings SET ${fields} WHERE project_id = ?`;
        await db.query(query, values);

        return { message: "Project settings updated successfully" };
    },

    getProjectSettings: async (project_id) => {
        const query = `
            SELECT 
                id, project_id, allow_ticket_reassign, enable_custom_priorities, enable_custom_statuses,
                COALESCE(custom_priorities, '[]') AS custom_priorities,
                COALESCE(custom_statuses, '[]') AS custom_statuses,
                COALESCE(default_status, '[]') AS default_status,
                COALESCE(default_priority, '[]') AS default_priority
            FROM project_settings WHERE project_id = ?
        `;
    
        const [result] = await db.query(query, [project_id]);
    
        if (result.length > 0) {
            // Ensure JSON values are parsed properly
            const jsonFields = ["custom_priorities", "custom_statuses", "default_status", "default_priority"];
            jsonFields.forEach(field => {
                try {
                    // ✅ Fix: Ensure correct parsing
                    result[0][field] = JSON.parse(result[0][field].replace(/\\/g, '') || "[]");
                } catch (error) {
                    console.error(`Error parsing ${field}:`, error.message);
                    result[0][field] = [];
                }
            });
    
            return result[0];
        }
    
        throw new Error("Project settings not found");
    }
    
};

module.exports = projectAlter;
