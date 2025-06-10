// Example function to get email tickets
const { Await } = require('react-router-dom');
const db = require('../config/db');

const getAllEmailTickets = async () => {
  const [rows] = await db.query('SELECT * FROM email_tickets ORDER BY received_at DESC');
  return rows;
};

const deleteById =async  (id) => {
    
      const query = "DELETE FROM email_tickets WHERE Email_ticket_id = ?";
     return await db.query(query,[id])
     
      }
module.exports = {
  getAllEmailTickets,
  deleteById,
};
