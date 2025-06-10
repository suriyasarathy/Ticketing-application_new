const Comment = require("../../model/commentModel");

exports.socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    // Send existing comments when user connects
    socket.on("fetch_comments", async (ticket_id) => {
      console.log("➡️ Fetching comments for Ticket ID:", ticket_id);
      try {
        const comments = await Comment.getCommentsByTicket(ticket_id);
        socket.emit("load_comments", comments);
      } catch (error) {
        console.error("❌ Error fetching comments:", error);
        socket.emit("error", { message: "Failed to load comments." });
      }
    });

    // Listen for new comments
    socket.on("new_comment", async (data) => {
      console.log("📝 New Comment Received:", data);
      const { comment, Ticket_id, user_id, filePath, fileType } = data;

      if (!comment || !Ticket_id || !user_id) {
        console.log("❌ Missing required fields");
        return;
      }

      try {
        // Save comment to MySQL
        const result = await Comment.addComment(comment, Ticket_id, user_id, filePath, fileType);
        const savedComment = {
          comment_id: result.insertId,
          ticket_id: Ticket_id,
          user_id: user_id,
          comment: comment,
          file_url: filePath ? `http://localhost:3000/${filePath.replace(/\\/g, "/")}` : null,
          file_type: fileType,
        };

        console.log("✅ Comment saved to database:", savedComment);

        // Broadcast to all users
        console.log("🟢 Broadcasting new comment to all users:", savedComment);
    io.emit("comment_added", savedComment);
      } catch (err) {
        console.error("❌ Error inserting comment:", err);
        socket.emit("error", { message: "Failed to save comment." });
      }
    });
   
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};
