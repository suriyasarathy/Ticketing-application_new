const db = require("../config/db");

const List = {
    GetTicketList: async (project_id, user_id) => {
        console.log(project_id,user_id)
        const query = ` SELECT 
      p.project_id, p.name AS project_name, p.created_at AS project_created_date, 
      p.due_date AS project_due_date, p.name, 
      COALESCE(ph.phase_name, "not assigned") AS phase_name, 
      t.ticket_id, t.Tittle, t.priority, t.status, 
      t.created_at AS ticket_created_date, t.description, 
      t.assigin_id,t.due_date, u.name AS assign, 
      DATEDIFF(NOW(), t.created_at) AS days, 
      t.updated_at AS last_modified_date
    FROM projects p 
    LEFT  JOIN tickets t ON p.project_id = t.project_id  
    LEFT JOIN project_phases ph ON ph.id = p.phase_id 
    LEFT  JOIN user u ON u.user_id = t.assigin_id 
    WHERE p.project_id = ?
    ORDER BY t.created_at, t.priority, t.status DESC;`;
        try {
            const [results] = await db.query(query, [project_id]);

            const assignedToCurrentUser = [];
            const assignedToOthers = [];
            const unassignedTickets = [];

            results.forEach((tickets) => {
                if (tickets.assigin_id == user_id) {
                    assignedToCurrentUser.push(tickets);
                } else if (tickets.assigin_id != null && tickets.assigin_id !== "") {
                    assignedToOthers.push(tickets);
                } else {
                    unassignedTickets.push(tickets);
                }
            });
            
               
               
            
            return {
                assignedToCurrentUser,
                assignedToOthers,
                unassignedTickets,
              };
        } catch (err) {
            throw new Error(err);
        }
    }
};

module.exports = List;
