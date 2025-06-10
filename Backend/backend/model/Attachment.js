const db = require("../config/db");

class Attachment {
  static async saveFile({ fileName, filePath, fileType, fileSize, ticketId, userId }) {
    const sql = `
      INSERT INTO attachments (file_name, file_path, file_type, file_size, ticket_id, user_id, uploaded_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    return db.execute(sql, [fileName, filePath, fileType, fileSize, ticketId, userId]);
  }
}

module.exports = Attachment;
