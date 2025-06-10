const db = require('../config/db'); // Import database connection

class updateStatus {
  static async updateStatus(ticketId, status,changeBy) {
    const  query1 =`insert into activity_logs(action_type, table_name, record_id, user_id, message)
    values (
      'UPDATE',
      'TICKETS',
      ?, ?, 
      CONCAT('TICKET status  WAS UPDATED BY ', (SELECT name FROM user WHERE user_id = ?))
    );
    `;
    await db.query(query1,[ticketId,changeBy,ticketId]);
    // const query2 =`insert into change_logs(ticket_id, change_type, changed_by, change_time)`
    const query = 'UPDATE tickets SET status = ? WHERE Ticket_id = ?';
    const [results] = await db.query(query, [status, ticketId]);
    return results;
  }
}

module.exports = updateStatus;
