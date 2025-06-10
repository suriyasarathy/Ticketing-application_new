const db = require('../config/db');

const Comment= {
 addComment : async (comment, ticket_id, user_id,filePath,fileType ) => {
    const query = `INSERT INTO comments (ticket_id, user_id, comment,File_path,File_type,uploaded_at) VALUES (?, ?, ?,?,?,NOW())`;

    try {
        // Execute the query
        const [result] = await db.query(query, [ticket_id, user_id, comment,filePath,fileType]);
        console.log("Query executed successfully");

        // Log the result (for debugging)

        // Return the result (e.g., the inserted row ID or other metadata)
        return result;
    } catch (err) {
        // Handle specific database errors
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error(`Foreign key constraint failed: Ticket ID ${ticket_id} or User ID ${user_id} does not exist.`);
        } else {
            throw new Error(`Database error: ${err.message}`);
        }
    }
  },

   getCommentsByTicket:async (ticket_id) =>{
    console.log("➡️ Entering getCommentsByTicket function");

    let query = `SELECT c.File_path,c.File_type,c.comment_id, c.ticket_id, c.user_id, c.comment, c.created_at, c.updated_at, u.name FROM comments c JOIN user u ON u.user_id = c.user_id where ticket_id=? order by created_at desc;`;

  
    try {
      const [rows] = await db.query(query, [ticket_id]); 
      console.log("query runniing");
      
      // Use db.query() instead of db.execute()
      return rows;
      
       // Stored procedures return results as an array
    } catch (err) {
      throw new Error(err);
    }
  ;
  },
  // deletecomment:async (comment_id) => {
  //   console.log("➡️ Entering deletecomment function");

  //   let query = `DELETE FROM comments WHERE comment_id = ?`;

  
  //   try {
  //     const [rows] = await db.query(query, [comment_id]); 
  //     console.log("query runniing");
      
  //     // Use db.query() instead of db.execute()
  //     return rows;
      
  //      // Stored procedures return results as an array
  //   } catch (err) {
  //     throw new Error(err);
  //   }

  // }
}
module.exports = Comment;