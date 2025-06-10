// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const CommentSection = ({ ticketId, userId }) => {
//   const [comments, setComments] = useState([]);
//   const [comment, setComment] = useState("");
//   const [file, setFile] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null); // State for full-screen image

//   useEffect(() => {
//     fetchComments();
//   }, []);

//   const fetchComments = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/commentdisplay?ticket_id=${2272000006}`);
//       setComments(response.data);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!comment) {
//       alert("Please enter a comment");
//       return;
//     }
    
//     const formData = new FormData();
//     formData.append("comment", comment);
//     formData.append("Ticket_id", 2272000006);
//     formData.append("user_id", 23);
//     if (file) {
//       formData.append("file", file);
//     }

//     try {
//       await axios.post("http://localhost:3000/Comment", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setComment("");
//       setFile(null);
//       fetchComments();
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     }
//   };

//   return (
//     <div>
//       <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Comments:</label>
//       <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#f8f9fa" }}>
//         {comments.length > 0 ? comments.map((comment, index) => {
//           const createdAt = new Date(comment.created_at);
//           const formattedDate = createdAt.toLocaleDateString();
//           const formattedTime = createdAt.toLocaleTimeString();
//           const alignment = index % 2 === 0 ? "left" : "row-reverse";

//           return (
//             <div key={index} style={{ display: "flex", flexDirection: alignment, marginBottom: "15px", alignItems: "center" }}>
//               <div style={{ margin: "0 10px" }}>
//                 <p style={{ fontWeight: "bold", margin: 0 }}>{comment.name}</p>
//                 <p style={{ fontSize: "12px", color: "#6c757d", margin: 0 }}>{formattedDate} {formattedTime}</p>
//               </div>
//               <div style={{ maxWidth: "70%", padding: "10px", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
//                 <p style={{ margin: 0 }}>{comment.comment}</p>

//                 {/* Clickable Image for Full-Screen View */}
//                 {comment.file_url && comment.File_type?.startsWith("image/") && (
//                   <img 
//                     src={comment.file_url} 
//                     alt="Uploaded" 
//                     onClick={() => setSelectedImage(comment.file_url)} // Open image in full screen
//                     style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer", marginTop: "10px" }}
//                   />
//                 )}

//                 {/* Open File in New Tab */}
//                 {comment.file_url && !comment.File_type?.startsWith("image/") && (
//                   <a 
//                     href={comment.file_url} 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     style={{ color: "#007bff", textDecoration: "underline", display: "block", marginTop: "10px" }}
//                   >
//                     Open File
//                   </a>
//                 )}
//               </div>
//             </div>
//           );
//         }) : <p>No comments yet.</p>}
//       </div>

//       <textarea 
//         name="comment" 
//         value={comment} 
//         onChange={(e) => setComment(e.target.value)} 
//         placeholder="Add a comment (optional)" 
//         style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} 
//       />
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: "10px" }} />
//       <button onClick={handleSubmit} className="btn btn-primary" style={{ marginTop: "10px" }}>Submit Comment</button>

//       {/* Full-Screen Image Modal */}
//       {selectedImage && (
//         <div 
//           onClick={() => setSelectedImage(null)} // Close modal when clicked
//           style={{
//             position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
//             backgroundColor: "rgba(0, 0, 0, 0.8)", display: "flex",
//             alignItems: "center", justifyContent: "center", zIndex: 1000
//           }}
//         >
//           <img 
//             src={selectedImage} 
//             alt="Full View" 
//             style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px" }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };
// export default CommentSection;
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const CommentSection = ({ ticketId }) => {
//   const [comments, setComments] = useState([]);
//   const [comment, setComment] = useState("");
//   const [file, setFile] = useState(null);
//   const MAX_COMMENT_LENGTH = 500;
//   const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const userId =23;
//   useEffect(() => {
//     fetchComments();
//   }, []);

//   const fetchComments = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/commentdisplay?ticket_id=${2272000006}`);
//       setComments(response.data);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!comment) {
//       alert("Please enter a comment");
//       return;
//     }
    
//     if (comment.length > MAX_COMMENT_LENGTH) {
//       alert("Comment exceeds the 500-character limit");
//       return;
//     }

//     if (file && file.size > MAX_FILE_SIZE) {
//       alert("File size exceeds the 10MB limit");
//       return;
//     }
    
//     const formData = new FormData();
//     formData.append("comment", comment);
//     formData.append("Ticket_id", 2272000006);
//     formData.append("user_id", userId);
//     if (file) {
//       formData.append("file", file);
//     }

//     try {
//       await axios.post("http://localhost:3000/Comment", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setComment("");
//       setFile(null);
//       fetchComments();
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     }
//   };

//   return (
//     <div>
//       <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Comments:</label>
//       <div style={{ maxHeight: "300px", overflowY: "auto", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#f8f9fa" }}>
//         {comments.length > 0 ? comments.map((comment, index) => {
//           const isMyComment = comment.user_id === userId;
//           const createdAt = new Date(comment.created_at);
//           const formattedDate = createdAt.toLocaleDateString();
//           const formattedTime = createdAt.toLocaleTimeString();
          
//           return (
//             <div key={index} style={{ 
//               display: "flex", 
//               flexDirection: isMyComment ? "row-reverse" : "row", 
//               marginBottom: "15px", 
//               alignItems: "center" 
//             }}>
//               <div style={{ margin: "0 10px" }}>
//                 <p style={{ fontWeight: "bold", margin: 0 }}>{comment.name}</p>
//                 <p style={{ fontSize: "12px", color: "#6c757d", margin: 0 }}>{formattedDate} {formattedTime}</p>
//               </div>
//               <div style={{ maxWidth: "70%", padding: "10px", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
//                 <p style={{ margin: 0 }}>{comment.comment}</p>
//                 {comment.file_url && comment.File_type?.startsWith("image/") && (
//                   <img 
//                     src={comment.file_url} 
//                     alt="Uploaded" 
//                     style={{ maxWidth: "100%", maxHeight: "150px", marginTop: "5px", borderRadius: "4px", cursor: "pointer" }}
//                     onClick={() => window.open(comment.file_url, "_blank")}
//                   />
//                 )}
//                 {comment.file_url && !comment.File_type?.startsWith("image/") && (
//                   <a 
//                     href={comment.file_url} 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     style={{ color: "#007bff", textDecoration: "underline" }}
//                   >
//                     Open file
//                   </a>
//                 )}
//               </div>
//             </div>
//           );
//         }) : <p>No comments yet.</p>}
//       </div>
//       <textarea 
//         name="comment" 
//         value={comment} 
//         onChange={(e) => setComment(e.target.value)} 
//         placeholder="Add a comment (optional)" 
//         maxLength={MAX_COMMENT_LENGTH}
//         style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} 
//       />
//       <input 
//         type="file" 
//         onChange={(e) => setFile(e.target.files[0])} 
//         style={{ marginTop: "10px" }} 
//         accept="image/*,.pdf,.doc,.docx,.txt,.zip"
//       />
//       <button onClick={handleSubmit} className="btn btn-primary" style={{ marginTop: "10px" }}>Submit Comment</button>
//     </div>
//   );
// };

// export default CommentSection;
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const CommentSection = ({ ticketId }) => {
//   const [comments, setComments] = useState([]);
//   const [comment, setComment] = useState("");
//   const [file, setFile] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const MAX_COMMENT_LENGTH = 500;
//   const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
//   const userId = 23;

//   useEffect(() => {
//     fetchComments();
//   }, []);

//   const fetchComments = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/commentdisplay?ticket_id=${2272000006}`);
//       setComments(response.data);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!comment) {
//       alert("Please enter a comment");
//       return;
//     }

//     if (comment.length > MAX_COMMENT_LENGTH) {
//       alert("Comment exceeds the 500-character limit");
//       return;
//     }

//     if (file && file.size > MAX_FILE_SIZE) {
//       alert("File size exceeds the 10MB limit");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("comment", comment);
//     formData.append("Ticket_id", 2272000006);
//     formData.append("user_id", userId);
//     if (file) {
//       formData.append("file", file);
//     }

//     try {
//       const newComment = {
//         name: "You",
//         comment,
//         file_url: file ? URL.createObjectURL(file) : null,
//         File_type: file ? file.type : null,
//         created_at: new Date().toISOString(),
//         user_id: userId,
//       };

//       // Optimistic UI Update
//       setComments((prev) => [newComment, ...prev]);

//       await axios.post("http://localhost:3000/Comment", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setComment("");
//       setFile(null);
//       fetchComments();
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     }
//   };

//   return (
//     <div className={`p-3 border rounded ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`} style={{ maxWidth: "600px", margin: "0 auto" }}>
//       {/* Dark Mode Toggle */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <label style={{ fontWeight: "bold" }}>Comments:</label>
//         <button className="btn btn-sm btn-secondary" onClick={() => setDarkMode(!darkMode)}>
//           {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//         </button>
//       </div>

//       {/* Comment List */}
//       <div style={{ maxHeight: "300px", overflowY: "auto", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: darkMode ? "#222" : "#f8f9fa" }}>
//         {comments.length > 0 ? (
//           comments.map((comment, index) => {
//             const isMyComment = comment.user_id === userId;
//             const createdAt = new Date(comment.created_at);
//             const formattedDate = createdAt.toLocaleDateString();
//             const formattedTime = createdAt.toLocaleTimeString();

//             return (
//               <div key={index} className="d-flex align-items-start mb-3" style={{ flexDirection: isMyComment ? "row-reverse" : "row" }}>
//                 <div className="me-2">
//                   <p className="fw-bold mb-1">{comment.name}</p>
//                   <p className="text-muted small mb-0">{formattedDate} {formattedTime}</p>
//                 </div>
//                 <div className={`p-2 rounded shadow-sm ${darkMode ? "bg-secondary text-white" : "bg-white text-dark"}`} style={{ maxWidth: "70%" }}>
//                   <p className="mb-1">{comment.comment}</p>

//                   {/* Image Preview */}
//                   {comment.file_url && comment.File_type?.startsWith("image/") && (
//                     <img
//                       src={comment.file_url}
//                       alt="Uploaded"
//                       className="img-fluid mt-1 rounded"
//                       style={{ maxHeight: "150px", cursor: "pointer" }}
//                       onClick={() => window.open(comment.file_url, "_blank")}
//                     />
//                   )}

//                   {/* File Preview */}
//                   {comment.file_url && !comment.File_type?.startsWith("image/") && (
//                     <a href={comment.file_url} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
//                       Open file
//                     </a>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p>No comments yet.</p>
//         )}
//       </div>

//       {/* Comment Input */}
//       <textarea
//         name="comment"
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//         placeholder="Add a comment (optional)"
//         maxLength={MAX_COMMENT_LENGTH}
//         className="form-control mt-3"
//       />

//       {/* File Upload */}
//       <input
//         type="file"
//         onChange={(e) => setFile(e.target.files[0])}
//         className="form-control mt-2"
//         accept="image/*,.pdf,.doc,.docx,.txt,.zip"
//       />

//       {/* Upload Progress & Preview */}
//       {file && (
//         <div className="mt-2 d-flex align-items-center">
//           {file.type.startsWith("image/") ? (
//             <img src={URL.createObjectURL(file)} alt="Preview" className="img-thumbnail" style={{ maxWidth: "60px", maxHeight: "60px" }} />
//           ) : (
//             <span className="text-muted">{file.name}</span>
//           )}
//           <button className="btn btn-sm btn-danger ms-2" onClick={() => setFile(null)}>❌</button>
//         </div>
//       )}

//       {/* Submit Button */}
//       <button onClick={handleSubmit} className="btn btn-primary mt-3 w-100">
//         Submit Comment
//       </button>
//     </div>
//   );
// };

// export default CommentSection;


//working code 
// 
//******************************************************************************************

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";  // Import Socket.IO client
// import { FaFilePdf, FaFileWord, FaFileArchive, FaFile } from "react-icons/fa";

// const socket = io("http://localhost:3000"); // Connect to the backend WebSocket server

// const CommentSection = ({ ticketId,userId}) => {
//   console.log(userId);
  
//   const [comments, setComments] = useState([]);
//   const [comment, setComment] = useState("");
//   const [file, setFile] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const MAX_COMMENT_LENGTH = 500;
//   const MAX_FILE_SIZE = 10 * 1024 * 1024;
//   // const userId = localStorage.getItem("userId");

//   useEffect(() => {
//     fetchComments();

//     // Listen for new comments from WebSocket
//     socket.on("new_comment", (newComment) => {
//       setComments((prevComments) => [...prevComments, newComment]);
//     });

//     return () => {
//       socket.off("new_comment");
//     };
//   }, []);

//   const fetchComments = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/commentdisplay?ticket_id=${2272000006}`);
//       setComments(response.data);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!comment) {
//       alert("Please enter a comment");
//       return;
//     }
//     if (comment.length > MAX_COMMENT_LENGTH) {
//       alert("Comment exceeds the 500-character limit");
//       return;
//     }
//     if (file && file.size > MAX_FILE_SIZE) {
//       alert("File size exceeds the 10MB limit");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("comment", comment);
//     formData.append("Ticket_id", 2272000006);
//     formData.append("user_id", userId);
//     if (file) formData.append("file", file);

//     try {
//       const response = await axios.post("http://localhost:3000/Comment", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const newComment = response.data; // Get the newly created comment

//       // Emit the new comment to the WebSocket server
//       socket.emit("comment_added", newComment);

//       setComment("");
//       setFile(null);
//       // No need to fetch again, since we push the new comment via WebSocket
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     }
//   };

//   return (
//     <div className={`p-3 border rounded ${darkMode ? 'bg-dark text-white' : 'bg-light'}`}>
//       <div className="d-flex justify-content-between align-items-center mb-2">
//         <label className="fw-bold">Comments:</label>
//         <button className="btn btn-sm btn-outline-secondary" onClick={() => setDarkMode(!darkMode)}>
//           {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//         </button>
//       </div>

//       <div className="p-2 border rounded" style={{ maxHeight: "300px", overflowY: "auto" }}>
//         {comments.length > 0 ? comments.map((c, index) => {
//           const isMyComment = c.user_id === userId;
//           return (
//             <div key={index} className={`d-flex ${isMyComment ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
              
//               {!isMyComment && (
//                 c.profile_image ? (
//                   <img src={c.profile_image} alt="Profile" className="rounded-circle me-2" style={{ width: "40px", height: "40px" }} />
//                 ) : (
//                   <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", fontSize: "18px", fontWeight: "bold" }}>
//                     {c.name.charAt(0).toUpperCase()}
//                   </div>
//                 )
//               )}

//               <div style={{ maxWidth: "75%" }}>
//                 <div className="d-flex align-items-end flex-column">
//                   <strong className="me-2">{c.name}</strong>
//                   <small className="text-muted">{new Date(c.created_at).toLocaleString()}</small>
//                 </div>

//                 <div className="p-2 border rounded bg-white mt-1">
//                   <p className="mb-1">{c.comment}</p>
                  
//                   {c.file_url && c.File_type?.startsWith("image/") && (
//                     <div className="mt-2">
//                       <img src={c.file_url} alt="Attachment" className="rounded w-100" style={{ maxWidth: "200px" }} />
//                     </div>
//                   )}

//                   {c.file_url && !c.File_type?.startsWith("image/") && (
//                     <div className="p-2 mt-2 border rounded bg-white d-flex align-items-center">
//                       {c.File_type === "application/pdf" && <FaFilePdf color="#dc3545" size={18} />}
//                       {c.File_type.includes("word") && <FaFileWord color="#007bff" size={18} />}
//                       {c.File_type.includes("zip") && <FaFileArchive color="#ffc107" size={18} />}
//                       {!["application/pdf", "application/zip"].includes(c.File_type) && <FaFile color="#6c757d" size={18} />}
//                       <a href={c.file_url} target="_blank" rel="noopener noreferrer" className="ms-2">
//                         Open file
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {isMyComment && (
//                 c.profile_image ? (
//                   <img src={c.profile_image} alt="Profile" className="rounded-circle ms-2" style={{ width: "40px", height: "40px" }} />
//                 ) : (
//                   <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center ms-2" style={{ width: "40px", height: "40px", fontSize: "18px", fontWeight: "bold" }}>
//                     {c.name.charAt(0).toUpperCase()}
//                   </div>
//                 )
//               )}
//             </div>
//           );
//         }) : <p>No comments yet.</p>}
//       </div>

//       <div className="mt-3">
//         <textarea className="form-control" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={MAX_COMMENT_LENGTH} placeholder="Add a comment (optional)"></textarea>
//         <input type="file" className="form-control mt-2" onChange={(e) => setFile(e.target.files[0])} accept="image/*,.pdf,.doc,.docx,.txt,.zip" />
//         <button className="btn btn-primary w-100 mt-2" onClick={handleSubmit}>Submit Comment</button>
//       </div>
//     </div>
//   );
// };

// export default CommentSection;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilePdf, FaFileWord, FaFileArchive, FaFile, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import {useAuth} from "../views/ContextData"


const CommentSection = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const MAX_COMMENT_LENGTH = 500;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const [userId,setuserId] =useState() ;
const { user } = useAuth();

useEffect(() => {
  if (user?.userId) {
    setuserId(user.userId);
  }
}, [user]);
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/commentdisplay?ticket_id=${ticketId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return alert("Please enter a comment");
    if (comment.length > MAX_COMMENT_LENGTH) return alert("Comment exceeds 500 characters");
    if (file && file.size > MAX_FILE_SIZE) return alert("File exceeds 10MB");

    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("Ticket_id", ticketId);
    formData.append("user_id", userId);
    if (file) formData.append("file", file);

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

  const handleEdit = (id, text) => {
    setEditId(id);
    setEditComment(text);
  };

  const handleSaveEdit = async (id) => {
    if (!editComment.trim()) return alert("Edited comment cannot be empty");
    try {
      await axios.put(`http://localhost:3000/comment/${id}`, {
        comment: editComment,
        user_id: userId,
      });
      setEditId(null);
      setEditComment("");
      fetchComments();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditComment("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`http://localhost:3000/comment/${id}`);
        fetchComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  return (
    <div className="p-3 border rounded">
      {/* Comment Input */}
      <div className="mt-3">
        <textarea
          className="form-control"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={MAX_COMMENT_LENGTH}
          placeholder="Add a comment (optional)"
        ></textarea>
        <input
          type="file"
          className="form-control mt-2"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*,.pdf,.doc,.docx,.txt,.zip"
        />
        <button className="btn btn-primary w-100 mt-2" onClick={handleSubmit}>
          Submit Comment
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
        <label className="fw-bold">Comments:</label>
      </div>

      <div className="p-2 border rounded">
        {comments.length > 0 ? (
          comments.map((c, index) => {
            const isMyComment = c.user_id === userId;
            return (
              <div key={index} className={`d-flex ${isMyComment ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
                {!isMyComment && (
                  c.profile_image ? (
                    <img src={c.profile_image} alt="Profile" className="rounded-circle me-2" style={{ width: "40px", height: "40px" }} />
                  ) : (
                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px", fontSize: "18px", fontWeight: "bold" }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                  )
                )}

                <div style={{ maxWidth: "75%" }}>
                  <div className="d-flex align-items-center flex-column">
                    <strong className="me-2">{c.name}</strong>
                    <small className="text-muted">{new Date(c.created_at).toLocaleString()}</small>
                  </div>

                  <div className="p-2 border rounded bg-white mt-1">
                    {/* Edit Mode */}
                    {editId === c.id ? (
                      <>
                        <textarea
                          className="form-control mb-2"
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          maxLength={MAX_COMMENT_LENGTH}
                        ></textarea>
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn btn-success btn-sm" onClick={() => handleSaveEdit(c.id)}><FaSave /> Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}><FaTimes /> Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-1">{c.comment}</p>

                        {c.file_url && c.File_type?.startsWith("image/") && (
                          <div className="mt-2">
                            <a href={c.file_url} target="_blank" rel="noopener noreferrer">
                              <img src={c.file_url} alt="Attachment" className="rounded w-100" style={{ maxWidth: "200px", cursor: "pointer" }} />
                            </a>
                          </div>
                        )}

                        {c.file_url && !c.File_type?.startsWith("image/") && (
                          <div className="p-2 mt-2 border rounded bg-white d-flex align-items-center">
                            {c.File_type === "application/pdf" && <FaFilePdf color="#dc3545" size={18} />}
                            {c.File_type.includes("word") && <FaFileWord color="#007bff" size={18} />}
                            {c.File_type.includes("zip") && <FaFileArchive color="#ffc107" size={18} />}
                            {!["application/pdf", "application/zip"].includes(c.File_type) && <FaFile color="#6c757d" size={18} />}
                            <a href={c.file_url} target="_blank" rel="noopener noreferrer" className="ms-2">
                              Open file
                            </a>
                          </div>
                        )}

                        {/* Show Edit/Delete Buttons for User Comments */}
                        {isMyComment && (
                          <div className="mt-2 d-flex justify-content-end gap-2">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(c.id, c.comment)}>
                              <FaEdit /> Edit
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(c.id)}>
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {isMyComment && (
                  c.profile_image ? (
                    <img src={c.profile_image} alt="Profile" className="rounded-circle ms-2" style={{ width: "40px", height: "40px" }} />
                  ) : (
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center ms-2" style={{ width: "40px", height: "40px", fontSize: "18px", fontWeight: "bold" }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                  )
                )}
              </div>
            );
          })
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
