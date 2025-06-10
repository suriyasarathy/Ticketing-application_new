import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateTicket = () => {
  const [userId, setUserId] = useState("");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("authToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "In open",
    project_id: "",
    reported_id: "",
    assign_id: "",
    due_date: "10-10-2025",
    tagging: "",
    ip_address: "",
    type: "bug",
    comment: "",
    image: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      setFormData((prevState) => ({
        ...prevState,
        reported_id: storedUserId, // ✅ Safely updating state
      }));
    }
  }, []);
  

  useEffect(() => {
    fetch("http://localhost:3000/project", {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));

    fetch("http://localhost:3000/users", {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));

      
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setFormData((prevState) => ({ ...prevState, ip_address: data.ip })))
      .catch((err) => console.error("Error fetching IP address:", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()];
        setTags(newTags);
        setFormData({ ...formData, tagging: newTags.join(", ") });
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setFormData({ ...formData, tagging: newTags.join(", ") });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/create-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) alert("Ticket created successfully!");
      else alert(`Error: ${data.message}`);
    } catch (error) {
      alert("An error occurred while creating the ticket");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Create Ticket</h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-bold">Title:</label>
            <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-bold">Description:</label>
            <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} required />
          </div>

          {/* Priority & Status */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Priority:</label>
              <select className="form-control" name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Status:</label>
              <select className="form-control" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="In open">In open</option>
                <option value="In progress">In progress</option>
                <option value="resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Project & Assigned User */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Project:</label>
              <select className="form-control" name="project_id" value={formData.project_id} onChange={handleInputChange} required>
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Assign to:</label>
              <select className="form-control" name="assign_id" value={formData.assign_id || ""} onChange={handleInputChange}>
  <option value="">Select User</option>
  {users.map((user) => (
    <option key={user.id} value={user.id}>{user.name}</option> // Ensure value is user.id (number)
  ))}
</select>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-3">
            <label className="form-label fw-bold">Tags:</label>
            <input type="text" className="form-control" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Press Enter to add tags" />
            <div className="mt-2">
              {tags.map((tag, index) => (
                <span key={index} className="badge bg-primary me-2" style={{ cursor: "pointer" }} onClick={() => removeTag(tag)}>
                  {tag} ✖
                </span>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-3">
            <label className="form-label fw-bold">Upload Image:</label>
            <input type="file" className="form-control" onChange={handleFileChange} />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100">Create Ticket</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
