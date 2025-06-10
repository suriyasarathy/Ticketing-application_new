import React, { useState, useEffect } from 'react';
import axios from "axios";
const TableList = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/commentdisplay?ticket_id=${2272000006}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    
    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("Ticket_id",2272000006);
    formData.append("user_id", 23);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("http://localhost:3000/Comment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setComment("");
      setFile(null);
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Comments:</label>
      <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#f8f9fa" }}>
        {comments.length > 0 ? comments.map((comment, index) => {
          const createdAt = new Date(comment.created_at);
          const formattedDate = createdAt.toLocaleDateString();
          const formattedTime = createdAt.toLocaleTimeString();
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
        value={comment} 
        onChange={(e) => setComment(e.target.value)} 
        placeholder="Add a comment (optional)" 
        style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} 
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: "10px" }} />
      <button onClick={handleSubmit} className="btn btn-primary" style={{ marginTop: "10px" }}>Submit Comment</button>
    </div>
  );
};



export default TableList;
