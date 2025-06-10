import React from "react";
import PieChartComponent from "../views/admin/PieChartComponent";
import  CustomDayContent from "../components/DatePicker"

const Dashboard = () => {
  return (
    <div>
     
      <h2>Dashboard</h2>
      <PieChartComponent />
    </div>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from "react";
// import { Modal, Button, Card, Form } from "react-bootstrap";
// import { FaCog, FaTrash } from "react-icons/fa";
// import axios from "axios";

// const  Dashboard = () => {
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [settings, setSettings] = useState({});

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/ProjectList");
//       setProjects(response.data);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//     }
//   };

//   const fetchSettings = async (projectId) => {
//     try {
//       const response = await axios.get(`http://localhost:3000/project-settings/${projectId}`);
//       setSettings(response.data);
//       setShowModal(true);
//     } catch (error) {
//       console.error("Error fetching settings:", error);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       await axios.put(`http://localhost:3000/project-settingUpdate/${selectedProject}`, settings);
//       setShowModal(false);
//       alert("Settings updated successfully!");
//     } catch (error) {
//       console.error("Error updating settings:", error);
//     }
//   };

//   const handleDelete = async (projectId) => {
//     if (window.confirm("Are you sure you want to delete this project?")) {
//       try {
//         await axios.delete(`http://localhost:3000/projectdelete?id=${projectId}`);
//         fetchProjects();
//       } catch (error) {
//         console.error("Error deleting project:", error);
//       }
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h3 className="mb-4">Project List</h3>
//       <div className="row">
//         {projects.map((project) => (
//           <div key={project.project_id} className="col-md-4 mb-4">
//             <Card className="shadow-sm">
//               <Card.Body>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <Card.Title>{project.name}</Card.Title>
//                   <FaCog 
//                     className="text-primary cursor-pointer" 
//                     onClick={() => {
//                       setSelectedProject(project.project_id);
//                       fetchSettings(project.project_id);
//                     }}
//                   />
//                 </div>
//                 <Card.Text>Manager: {project.project_manager_id}</Card.Text>
//                 <Card.Text>Due: {new Date(project.due_date).toLocaleDateString()}</Card.Text>
//                 <Button variant="danger" size="sm" onClick={() => handleDelete(project.project_id)}>
//                   <FaTrash /> Delete
//                 </Button>
//               </Card.Body>
//             </Card>
//           </div>
//         ))}
//       </div>

//       {/* Settings Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Project Settings</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Check 
//               type="checkbox"
//               label="Allow Ticket Reassign"
//               checked={settings.allow_ticket_reassign}
//               onChange={(e) => setSettings({...settings, allow_ticket_reassign: e.target.checked })}
//             />
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
//           <Button variant="primary" onClick={handleSave}>Save Changes</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default  Dashboard;




// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Dashboard = () => {
//   const [userId, setUserId] = useState("");
//   const [users, setUsers] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [tagInput, setTagInput] = useState("");
//   const [file, setFile] = useState(null);
//   const [priorities, setPriorities] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const token = localStorage.getItem("authToken");
//   const ProjectID = "2262025120404";


//   const [formData, setFormData] = useState({
//     ProjectID,
//     title: "",
//     description: "",
//     priority: "",
//     status: "",
//     reported_id: "",
//     assign_id: "",
//     due_date: "",
//     tagging: "",
//     ip_address: "",
//     type: "bug",
//     comment: "",
//     image: "",
//   });

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("user_id");
//     if (storedUserId) {
//       setUserId(storedUserId);
//       setFormData((prevState) => ({
//         ...prevState,
//         reported_id: storedUserId,
//       }));
//     }
//   }, []);

//   useEffect(() => {
//     fetch("http://localhost:3000/users", {
//       method: "GET",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => setUsers(data))
//       .catch((err) => console.error("Error fetching users:", err));

//     fetch(`http://localhost:3000/projects/${ProjectID}/settings`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setPriorities(data.priorities || []);
//         setStatuses(data.statuses || []);
//       })
//       .catch((err) => console.error("Error fetching project settings:", err));

//     fetch("https://api.ipify.org?format=json")
//       .then((res) => res.json())
//       .then((data) => setFormData((prevState) => ({ ...prevState, ip_address: data.ip })))
//       .catch((err) => console.error("Error fetching IP address:", err));
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleTagKeyDown = (e) => {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
//         const newTags = [...tags, tagInput.trim()];
//         setTags(newTags);
//         setFormData({ ...formData, tagging: newTags.join(", ") });
//         setTagInput("");
//       }
//     }
//   };

//   const removeTag = (tagToRemove) => {
//     const newTags = tags.filter((tag) => tag !== tagToRemove);
//     setTags(newTags);
//     setFormData({ ...formData, tagging: newTags.join(", ") });
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setFormData({ ...formData, image: e.target.files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:3000/create-ticket", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (response.ok) alert("Ticket created successfully!");
//       else alert(`Error: ${data.message}`);
//     } catch (error) {
//       alert("An error occurred while creating the ticket");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <div className="card shadow-lg p-4">
//         <h2 className="text-center mb-4">Create Ticket</h2>
//         <form onSubmit={handleSubmit}>
//           {/* Title */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Title:</label>
//             <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required />
//           </div>

//           {/* Description */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Description:</label>
//             <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} required />
//           </div>

//           {/* Priority & Status */}
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label fw-bold">Priority:</label>
//               <select className="form-control" name="priority" value={formData.priority} onChange={handleInputChange} required>
//                 <option value="">Select Priority</option>
//                 {priorities.map((priority, index) => (
//                   <option key={index} value={priority}>{priority}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label fw-bold">Status:</label>
//               <select className="form-control" name="status" value={formData.status} onChange={handleInputChange} required>
//                 <option value="">Select Status</option>
//                 {statuses.map((status, index) => (
//                   <option key={index} value={status}>{status}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Assigned User */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Assign to:</label>
//             <select className="form-control" name="assign_id" value={formData.assign_id} onChange={handleInputChange}>
//               <option value="">Select User</option>
//               {users.map((user) => (
//                 <option key={user.id} value={user.id}>{user.name}</option>
//               ))}
//             </select>
//           </div>

//           {/* Tags */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Tags:</label>
//             <input type="text" className="form-control" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Press Enter to add tags" />
//             <div className="mt-2">
//               {tags.map((tag, index) => (
//                 <span key={index} className="badge bg-primary me-2" style={{ cursor: "pointer" }} onClick={() => removeTag(tag)}>
//                   {tag} ✖
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* File Upload */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Upload Image:</label>
//             <input type="file" className="form-control" onChange={handleFileChange} />
//           </div>

//           {/* Submit */}
//           <button type="submit" className="btn btn-primary w-100">Create Ticket</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
