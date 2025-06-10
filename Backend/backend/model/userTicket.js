const db = require("../config/db");

const userTicket = {
  fetchUserTickets: async (userId) => {
    try {
      // Get tickets where the user is a project member
      const projectTicketsQuery = `
        SELECT 
          t.Ticket_id,
          t.Tittle,
          t.description,
          t.priority,
          t.status,
          t.created_at,
          t.updated_at,
          t.Due_date,
          t.Tagging,
          t.Ip_address,
          t.type,
          r.name AS reporter_name,
          a.name AS assignee_name,
          pn.project_id,
          pn.name AS project_name
        FROM 
          tickets t
        LEFT JOIN user r ON t.reported_id = r.user_id
        LEFT JOIN user a ON t.assigin_id = a.user_id
        LEFT JOIN projects pn ON t.project_id = pn.project_id
        LEFT JOIN project_user pu ON t.project_id = pu.project_id
        WHERE pu.user_id = ? 
        ORDER BY pn.project_id, t.Ticket_id;
      `;

      const assignedTicketsQuery = `
        SELECT 
          t.Ticket_id,
          t.Tittle,
          t.description,
          t.priority,
          t.status,
          t.created_at,
          t.updated_at,
          t.Due_date,
          t.Tagging,
          t.Ip_address,
          t.type,
          r.name AS reporter_name,
          a.name AS assignee_name,
          pn.project_id,
          pn.name AS project_name
        FROM 
          tickets t
        LEFT JOIN user r ON t.reported_id = r.user_id
        LEFT JOIN user a ON t.assigin_id = a.user_id
        LEFT JOIN projects pn ON t.project_id = pn.project_id
        WHERE t.assigin_id = ?
        ORDER BY t.Ticket_id;
      `;

      const [projectTickets] = await db.query(projectTicketsQuery, [userId]);
      const [assignedTickets] = await db.query(assignedTicketsQuery, [userId]);

      if (projectTickets.length === 0 && assignedTickets.length === 0) {
        return { message: "No tickets found for this user" };
      }

      // Group project tickets by project_id
      const groupedProjects = projectTickets.reduce((acc, ticket) => {
        const { project_id, project_name, ...ticketDetails } = ticket;
        let project = acc.find((p) => p.project_id === project_id);
        if (!project) {
          project = { project_id, project_name, tickets: [] };
          acc.push(project);
        }
        project.tickets.push(ticketDetails);
        return acc;
      }, []);

      return {
        projects: groupedProjects,
        assigned_tickets: assignedTickets,
      };
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return { error: "Database error" };
    }
  },
};

module.exports = userTicket;
