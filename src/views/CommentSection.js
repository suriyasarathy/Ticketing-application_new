import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";


// 🔹 Connect to WebSocket Server
const socket = io("http://localhost:3000", {
  transports: ["websocket"], // Ensure WebSocket connection
});

const CommentsSection = ({ ticketId }) => {
  const [historyComment, setHistoryComment] = useState([]);
  const [formData, setFormData] = useState({
    Ticket_id: ticketId,
    comment: "",
    user_id: Number(localStorage.getItem("user_id")), // Convert user_id to Number
  });

  const token = localStorage.getItem("authToken");

  // ✅ Fetch comments for the ticket
  useEffect(() => {
    if (!ticketId) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/commentdisplay?ticket_id=${ticketId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setHistoryComment(data);
      } catch (err) {
        console.error("Error fetching comment history:", err);
      }
    };

    fetchComments();
  }, [ticketId]);

  // ✅ Handle comment change
  const handleCommentChange = (e) => {
    setFormData({ ...formData, comment: e.target.value });
  };

  // ✅ Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3000/Comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
  
      const newComment = await response.json();
  
      setHistoryComment((prevComments) => [
        {
          comment_id: newComment.comment_id,
          ticket_id: newComment.ticket_id,
          comment: newComment.comment,
          name: localStorage.getItem("username") || "Unknown",
          created_at: newComment.created_at, // Ensure it comes from API
          user_id: newComment.user_id,
        },
        ...prevComments,
      ]);
  
      setFormData({ ...formData, comment: "" });
    } catch (error) {
      alert("An error occurred while adding the comment");
      console.error("Error adding comment:", error);
    }
  };
  
  return (
    <div>
      <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Comments:</label>
      <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#f8f9fa" }}>
        {historyComment.length > 0 ? historyComment.map((comment, index) => {
          const createdAt = new Date(comment.created_at);
          const formattedDate = createdAt.toLocaleDateString();
          const formattedTime = createdAt.toLocaleTimeString();

          // ✅ Align user comments to the right
          const currentUserId = Number(localStorage.getItem("user_id"));
          const alignment = comment.user_id === currentUserId ? "right" : "left";

          return (
            <div key={index} style={{ display: "flex", flexDirection: alignment === "left" ? "row" : "row-reverse", marginBottom: "15px", alignItems: "center" }}>
              <div style={{ margin: "0 10px" }}>
                <p style={{ fontWeight: "bold", margin: 0 }}>{comment.name}</p>
                <p style={{ fontSize: "12px", color: "#6c757d", margin: 0 }}>{formattedDate} {formattedTime}</p>
              </div>
              <div style={{ maxWidth: "70%", padding: "10px", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                <p style={{ margin: 0 }}>{comment.comment}</p>
              </div>
            </div>
          );
        }) : <p>No comments yet.</p>}
      </div>

      <textarea
        name="comment"
        value={formData.comment}
        onChange={handleCommentChange}
        placeholder="Add a comment (optional)"
        style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
      />
      <button onClick={handleSubmit} className="btn btn-primary" style={{ marginTop: "10px" }}>Submit Comment</button>
    </div>
  );
};

export default CommentsSection;
