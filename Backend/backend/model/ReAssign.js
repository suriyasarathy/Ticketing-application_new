const { update } = require("lodash");
const db = require("../config/db");


const Reassign = {
    // Get users assigned to a specific project
    getUsersByProject: async (projectId) => {
        return db.query(
            `SELECT user_id, name
FROM user 
WHERE user_id IN (
    SELECT user_id FROM project_user  WHERE project_id = ?
    UNION
    SELECT project_manager_id FROM projects  WHERE project_id = ?
);;
`, 
            [projectId,projectId]
        );
    },
    // unassigin ticket to myself
    updateunassginTicket: async (user_id, Ticket_id) => { 
        const query =`UPDATE tickets SET assigin_id =? where ticket_id =?`
        console.log(user_id,Ticket_id);
        const query2 =`INSERT INTO activity_logs(action_type, table_name, record_id, user_id, message)
        VALUES (
          'UPDATE',
          'TICKETS',
          ?, ?, 
          CONCAT('TICKET WAS UPDATED BY ', (SELECT name FROM user WHERE user_id = ?))
        );
        `;
        try{
            return db.query(query,[user_id,Ticket_id])
            
        }catch(err){
            console.log("error ocured in updating myself",err);
            
        }


    },
    // Assign a ticket to a user after checking if they are in the project
    assignTicketToUser: async (ticketId, userId, projectId, changeBy) => {
        console.log(ticketId, userId, projectId);
    
        // Check if the user is part of the project before assigning
        const [userCheck] = await db.query(
            `SELECT 1 FROM project_user WHERE user_id = ? AND project_id = ?`, 
            [userId, projectId]
        );
    
        if (!userCheck || userCheck.length === 0) {
            throw new Error("User is not part of the project");
        }
    
        // Log the activity
        const logQuery = `
            INSERT INTO activity_logs(action_type, table_name, record_id, user_id, message)
            VALUES (
                'UPDATE',
                'TICKETS',
                ?, ?, 
                CONCAT('TICKET WAS UPDATED BY ', (SELECT name FROM user WHERE user_id = ?))
            );
        `;
        await db.query(logQuery, [ticketId, changeBy, changeBy]);
    
        // Track change history
        const historyQuery = `
            INSERT INTO change_history(table_name, record_id, column_name, old_value, new_value, changed_by)
            VALUES (
                'tickets',
                ?,
                'assigin_id',
                (SELECT assigin_id FROM tickets WHERE ticket_id = ?),
                ?,
                ?
            );
        `;
        await db.query(historyQuery, [ticketId, ticketId, userId, changeBy]);
    
        // Update the ticket assignment
        return db.query(
            `UPDATE tickets SET assigin_id = ? WHERE ticket_id = ?`, 
            [userId, ticketId]
        );
    }
    
}

module.exports = { Reassign };
