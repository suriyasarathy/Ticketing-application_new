import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "components/CommentSection";
const TicketDetailUser = () => {
  const { TicketId } = useParams();
  console.log("Ticket ID from useParams:", TicketId);
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyComment, setHistoryComment] = useState([]); // Fix: Initialize as an empty array
  const [formData, setFormData] = useState({
    Ticket_id: TicketId,
    comment: "",
    user_id:localStorage.getItem("user_id"), // Replace with dynamic user ID in production
  });
  const token =localStorage.getItem('authToken')
  
  console.log("Ticket ID:", TicketId);
  const user_Id = localStorage.getItem("user_id");


  // ✅ Fetch ticket details
  useEffect(() => {
    if (!TicketId) return;

    const fetchTicket = async () => {
      try {
        const response = await fetch(`http://localhost:3000/tickets?id=${TicketId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
          },
        });
        const data = await response.json();
        console.log(data)

        if (response.ok && Array.isArray(data) && data.length > 0) {
          setTicket(data[0]);
        } else {
          throw new Error("No ticket found for the given ID");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [TicketId]);

  // ✅ Fetch comments for the ticket
  useEffect(() => {
    if (!TicketId) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/commentdisplay?ticket_id=${TicketId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
          },
        });
        const data = await response.json();
        setHistoryComment(data);
      } catch (err) {
        console.error("Error fetching comment history:", err);
      }
    };

    fetchComments();
  }, [TicketId]); // ✅ Fixed dependency issue

  const handleCommentChange = (e) => {
    setFormData({ ...formData, comment: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/Comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      console.log("Comment added successfully:", data);

      // ✅ Refresh comments after adding a new one
      setHistoryComment((prevComments) => [...prevComments, formData]);
      setFormData({ ...formData, comment: "" });
    } catch (error) {
      alert("An error occurred while adding the comment");
      console.error("Error adding comment:", error);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading ticket details...</p>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger mt-5 text-center">
        <p>Error: {error}</p>
        <a href="/" className="btn btn-primary">Go Back</a>
      </div>
    );

  if (!ticket)
    return (
      <div className="alert alert-warning mt-5 text-center">
        <p>No ticket found for ID: {TicketId}</p>
        <a href="/" className="btn btn-primary">Go Back</a>
      </div>
    );

  return (
    <>
      {/* <button onClick={props.onBack} className="btn btn-secondary">View All</button> */}

      <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f4f4f4", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <div style={{ width: "90%", maxWidth: "1200px", backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", fontFamily: "Arial, sans-serif" }}>
          
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h2 style={{ fontWeight: "bold", marginBottom: "5px" }}>{ticket.project_name}</h2>
            <h5 style={{ color: "#6c757d", fontSize: "16px" }}>Ticket ID: {ticket.Ticket_id}</h5>
          </div>
      
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "16px" }}>
            <div><strong style={{ color: "#555" }}>Title:</strong> {ticket.Tittle}</div>
            <div><strong style={{ color: "#555" }}>Created At:</strong> {new Date(ticket.created_at).toLocaleDateString("en-US")}</div>
<div><strong style={{ color: "#555" }}>Updated At:</strong> {new Date(ticket.updated_at).toLocaleDateString("en-US")}</div>

            <div><strong style={{ color: "#555" }}>Priority:</strong> {ticket.priority}</div>
            <div><strong style={{ color: "#555" }}>Status:</strong> {ticket.status}</div>
            <div><strong style={{ color: "#555" }}>Assigned to:</strong> {ticket.assignee_name}</div>
            <div><strong style={{ color: "#555" }}>IP Address:</strong> {ticket.Ip_address}</div>
            <div><strong style={{ color: "#555" }}>Type:</strong> {ticket.type}</div>
            <div><strong style={{ color: "#555" }}>Reported by:</strong> {ticket.reporter_name}</div>
            <div style={{ gridColumn: "span 3" }}>
              <strong style={{ color: "#555" }}>Tagging:</strong> {ticket.Tagging}
            </div>
          </div>

          <div style={{ maxHeight: "6em", overflowY: "auto", lineHeight: "1.5em", borderRadius: "5px", backgroundColor: "#f8f9fa", padding: "10px", border: "1px solid #ddd" }}>
            <strong style={{ color: "#555" }}>Description:</strong>
            <p style={{ margin: "0", whiteSpace: "pre-wrap", color: "#000" }}>{ticket.description}</p>
          </div>

          {/* ✅ Display Attachment Image */}
          {ticket.attachments && ticket.attachments.length > 0 ? (
  <div style={{ textAlign: "center", marginBottom: "20px" }}>
    <h4>Attachments</h4>
    {ticket.attachments
      .filter(file => file.file_type.startsWith("image/")) // ✅ Only show images
      .map((file, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <img 
            src={`http://localhost:3000${file.file_path}`} 
            alt={`Attachment ${index + 1}`} // ✅ Removed filename, using index instead
            style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }}
          />
        </div>
    ))}
  </div>
) : (
  <p style={{ textAlign: "center", color: "#999" }}>No attachments available</p>
)}

{/* 
          <div>
  <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Comments:</label>
  <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#f8f9fa" }}>
    {historyComment.length > 0 ? historyComment.map((comment, index) => {
      // Formatting the date and time
      const createdAt = new Date(comment.created_at);
      const formattedDate = createdAt.toLocaleDateString();  // Format date (e.g. "01/31/2025")
      const formattedTime = createdAt.toLocaleTimeString();  // Format time (e.g. "10:39:40 AM")

      // Determining alignment for alternating left and right
      const alignment = index % 2 === 0 ? "left" : "right";

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
</div> */}
<CommentSection ticketId={TicketId} userId={user_Id} />


        </div>
      </div>
    </>
  );
};

export default TicketDetailUser;
