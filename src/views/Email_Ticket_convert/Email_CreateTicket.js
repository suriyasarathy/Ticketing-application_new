// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useLocation } from "react-router-dom";
// import { Form, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom"; // Import useNavigate

// const Email_CreateTicket = () => {
//   const [userId, setUserId] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [tagInput, setTagInput] = useState("");
//   const [file, setFile] = useState(null);
//   const [project_id,setproject_id] =useState();
//   const token = localStorage.getItem("authToken");
//   const location = useLocation();
//   const navigate = useNavigate(); // ✅ Move useNavigate() here

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     priority: "low",
//     status: "In open",
//     project_id: "",
//     reported_id: "",
//     assign_id: "",
//     due_date: "",
//     tagging: "",
//     ip_address: "",
//     type: "bug",
//     comment: "",
//     image: "",
//     source: "", // added to mark ticket from email
//   });
  

//   useEffect(() => {
//     // Prefill from query params
//     const query = new URLSearchParams(location.search);
//     const emailSubject = query.get("subject");
//     const emailBody = query.get("body");

//     setFormData((prev) => ({
//       ...prev,
//       title: emailSubject || "",
//       description: emailBody || "",
//       source: emailSubject || emailBody ? "email" : "",
//     }));
//   }, [location]);

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
//     fetch("http://localhost:3000/project", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error("Error fetching projects:", err));

//     fetch("http://localhost:3000/users", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => setUsers(data))
//       .catch((err) => console.error("Error fetching users:", err));

//     fetch("https://api.ipify.org?format=json")
//       .then((res) => res.json())
//       .then((data) =>
//         setFormData((prevState) => ({ ...prevState, ip_address: data.ip }))
//       )
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
//   const handleCancel = () => {
//     navigate(-1); // Go back to the previous page
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:3000/create-ticket", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
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
//         <h2 className="text-center mb-4">
//           Create Ticket{" "}
//           {formData.source === "email" && (
//             <span className="badge bg-secondary ms-2">From Email</span>
//           )}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           {/* Title */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Title:</label>
//             <input
//               type="text"
//               className="form-control"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           {/* Description */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Description:</label>
//             <textarea
//               className="form-control"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               rows="8"  // Increases default height
//               style={{ minHeight: "150px", resize: "vertical" }} // Ensures proper height and resizing
//               required 
//             />
//           </div>
//           <div>
//           <template>
//   <div>
//     <label for="datepicker-buttons">Date picker with optional footer buttons</label>
//     <b-form-datepicker
//       id="datepicker-buttons"
//       today-button
//       reset-button
//       close-button
//       locale="en"
//     ></b-form-datepicker>
//   </div>
// </template>
//           </div>
//           {/* Priority & Status */}
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label fw-bold">Priority:</label>
//               <select
//                 className="form-control"
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleInputChange}
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label fw-bold">Status:</label>
//               <select
//                 className="form-control"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//               >
//                 <option value="In open">In open</option>
//                 <option value="In progress">In progress</option>
//                 <option value="resolved">Resolved</option>
//                 <option value="Closed">Closed</option>
//               </select>
//             </div>
//           </div>

//           {/* Project & Assigned User */}
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label fw-bold">Project:</label>
//               <select
//                 className="form-control"
//                 name="project_id"
//                 value={formData.project_id}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Project</option>
//                 {projects.map((project) => (
//                   <option key={project.id} value={project.id}>
//                     {project.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label fw-bold">Assign to:</label>
//               <select
//                 className="form-control"
//                 name="assign_id"
//                 value={formData.assign_id || ""}
//                 onChange={handleInputChange}
//               >
//                 <option value="">Select User</option>
//                 {users.map((user) => (
//                   <option key={user.id} value={user.id}>
//                     {user.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Tags */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Tags:</label>
//             <input
//               type="text"
//               className="form-control"
//               value={tagInput}
//               onChange={(e) => setTagInput(e.target.value)}
//               onKeyDown={handleTagKeyDown}
//               placeholder="Press Enter to add tags"
//             />
//             <div className="mt-2">
//               {tags.map((tag, index) => (
//                 <span
//                   key={index}
//                   className="badge bg-primary me-2"
//                   style={{ cursor: "pointer" }}
//                   onClick={() => removeTag(tag)}
//                 >
//                   {tag} ✖
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* File Upload */}
//           <div className="mb-3">
//             <label className="form-label fw-bold">Upload Image:</label>
//             <input
//               type="file"
//               className="form-control"
//               onChange={handleFileChange}
//             />
//           </div>
//            <Form.Group className="mb-3">
//               <Form.Label>Comment</Form.Label>
//               <Form.Control 
//                 as="textarea" 
//                 rows={2} 
//                 name="comment"
//                 value={formData.comment}
//                 onChange={handleInputChange} 
//                 placeholder="Add comments"
//               />
//             </Form.Group>

//          <div className="d-flex justify-content-between">
//              <Button variant="secondary" onClick={handleCancel}>
//                Cancel
//              </Button>
//              <Button variant="primary" type="submit">
//                Submit
//              </Button>
//            </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Email_CreateTicket;
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const Email_CreateTicket = () => {
  const [userId, setUserId] = useState("");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("authToken");
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "In open",
    project_id: "",
    reported_id: "",
    assign_id: "",
    due_date: "",
    tagging: "",
    ip_address: "",
    type: "bug",
    comment: "",
    image: "",
    source: "",
  });

  useEffect(() => {
    // Pre-fill title and description from query params (email)
    const query = new URLSearchParams(location.search);
    const emailSubject = query.get("subject");
    const emailBody = query.get("body");

    setFormData((prev) => ({
      ...prev,
      title: emailSubject || "",
      description: emailBody || "",
      source: emailSubject || emailBody ? "email" : "",
    }));
  }, [location]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      setFormData((prevState) => ({
        ...prevState,
        reported_id: storedUserId,
      }));
    }

    // Fetch projects
    fetch("http://localhost:3000/project", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));

    // Fetch users
    fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));

    // Get IP address
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) =>
        setFormData((prevState) => ({ ...prevState, ip_address: data.ip }))
      )
      .catch((err) => console.error("Error fetching IP address:", err));
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()];
        setTags(newTags);
        setFormData((prevState) => ({
          ...prevState,
          tagging: newTags.join(", "),
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setFormData((prevState) => ({
      ...prevState,
      tagging: updatedTags.join(", "),
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/create-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Ticket created successfully!");
  
        // ✅ Extract message ID from query (or pass some identifier from email)
        const query = new URLSearchParams(location.search);
        const messageId = query.get("id"); // Adjust as per your param name
  
        // ✅ Make a request to delete the email (use your actual delete endpoint)
        if (messageId) {
          await fetch(`http://localhost:3000/delete-email/${messageId}`, {
            method: "DELETE",
            
          });
        }
  
        navigate(-1); // ✅ Or wherever you want to redirect
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error while creating ticket:", error);
      alert("An error occurred while creating the ticket");
    }
  };
  
  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">
          Create Ticket{" "}
          {formData.source === "email" && (
            <span className="badge bg-secondary ms-2">From Email</span>
          )}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Title:</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Description:</label>
            <textarea
              className="form-control"
              name="description"
              rows="8"
              style={{ minHeight: "150px", resize: "vertical" }}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Due Date:</label>
            <input
              type="date"
              className="form-control"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Priority:</label>
              <select
                className="form-control"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Status:</label>
              <select
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="In open">In open</option>
                <option value="In progress">In progress</option>
                <option value="resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Project:</label>
              <select
                className="form-control"
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Assign to:</label>
              <select
                className="form-control"
                name="assign_id"
                value={formData.assign_id || ""}
                onChange={handleInputChange}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Tags:</label>
            <input
              type="text"
              className="form-control"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Press Enter or Comma to add tags"
            />
            <div className="mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="badge bg-primary me-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => removeTag(tag)}
                >
                  {tag} ✖
                </span>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Upload Image:</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Add comments"
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Email_CreateTicket;
