import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ Import Axios
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate
import {useAuth} from "../ContextData"

const UserCreateTicket = () => {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState  (null);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const token = localStorage.getItem("authToken");
  
  const ProjectID = useParams().ProjectId; // ✅ Ensure it's a string
  const [dueDate, setDueDate] = useState(null);
  const [formData, setFormData] = useState({
    project_id: ProjectID, // ✅ Use correct field name
    title: "",
    description: "",
    priority: "",
    status: "New",
    reported_id: "44",
    assign_id: "", // ✅ Default to null
    due_date: "",
    tagging: "",
    ip_address: "",
    type: "bug",
    comment: "",
    image: "",
  });
  const navigate = useNavigate(); // ✅ Move useNavigate() here
  const { user } = useAuth();
useEffect(() => {
  if (user?.userId) {
    setUserId(user.userId);
  }
}, [user]);  

  useEffect(() => {
    const storedUserId =userId;
    if (storedUserId) {
      setUserId(storedUserId);
      setFormData((prevState) => ({
        ...prevState,
        reported_id: 44,
      }));
    }

    // ✅ Fetch Users
    fetch("http://localhost:3000/users", {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));

    // ✅ Fetch Project Settings (Priorities & Statuses)
    fetch(`http://localhost:3000/projects/${ProjectID}/settings`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPriorities(data.priorities || []);
        setStatuses(data.statuses || []);
      })
      .catch((err) => console.error("Error fetching project settings:", err));

    // ✅ Fetch IP Address
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setFormData((prevState) => ({ ...prevState, ip_address: data.ip })))
      .catch((err) => console.error("Error fetching IP address:", err));
  }, []);
  const handleDateChange = (e) => {
    let inputDate = e.target.value;
    
    // Convert YYYY-MM-DD to MM-DD-YYYY
    let parts = inputDate.split("-");
    if (parts.length === 3) {
        let formattedDate = `${parts[1]}-${parts[2]}-${parts[0]}`;
        setFormData({ ...formData, due_date: formattedDate });
    }
};
const handleCancel = () => {
  navigate(-1); // Go back to the previous page
};
  const handleInputChangedue = (e) => {
    const { name, value } = e.target;
    console.log(value,name);
    

    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "assign_id" && value === "" ? null : value, // ✅ Convert empty string to null
    }));
  };
  const handleDateChangedue = (e) => {
    let inputDate = e.target.value;
    
    // Convert YYYY-MM-DD to MM-DD-YYYY
    let parts = inputDate.split("-");
    if (parts.length === 3) {
        let formattedDate = `${parts[1]}-${parts[2]}-${parts[0]}`;
        setFormData({ ...formData, due_date: formattedDate });
    }
};

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
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
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setFormData((prevState) => ({
      ...prevState,
      tagging: newTags.join(", "),
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Step 1: Create ticket (without file)
      const ticketResponse = await axios.post("http://localhost:3000/create-ticket", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (ticketResponse.status === 201) {
        const createdTicketId = ticketResponse.data.ticketId;
        let uploadedFilePath = null;
  
        // Step 2: Upload file if exists
        if (file) {
          const fileFormData = new FormData();
          fileFormData.append("image", file);
          fileFormData.append("user_id", userId);
          fileFormData.append("ticketId", createdTicketId); // ✅ must match backend
  
          const uploadResponse = await axios.post("http://localhost:3000/upload", fileFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
  
          if (uploadResponse.status === 200) {
            uploadedFilePath = uploadResponse.data.filePath;
          }
        }
  
        // Step 3 (optional): Update ticket with file path if you store image path in ticket table
        if (uploadedFilePath) {
          await axios.put(`http://localhost:3000/tickets/${createdTicketId}`, {
            image: uploadedFilePath,
          }, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }
  
        alert("Ticket Created Successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
      <div className="container mt-4">
      <Form onSubmit={handleSubmit}>
  {/* Title */}
  <Form.Group className="mb-3">
    <Form.Label>Title</Form.Label>
    <Form.Control 
      type="text" 
      name="title"
      value={formData.title}
      onChange={handleInputChangedue}
      placeholder="Enter ticket title" 
      required
    />
  </Form.Group>

  {/* Description */}
  <div className="mb-3">
    <label className="form-label fw-bold">Description:</label>
    <textarea 
        className="form-control" 
        name="description" 
        value={formData.description} 
        onChange={handleInputChangedue} 
        rows="8"  // Increases default height
        style={{ minHeight: "150px", resize: "vertical" }} // Ensures proper height and resizing
         
    />
</div>



  {/* Due Date & Priority */}
  <div className="row d-flex align-items-center">
    <div className="col-md-6">
      <Form.Group className="mb-3">
        <Form.Label>Due Date</Form.Label>
        <DatePicker
          selected={dueDate}
          onChange={(date) => {
            setDueDate(date);
            setFormData((prev) => ({
              ...prev,
              due_date: date.toISOString().split("T")[0], // Converts to YYYY-MM-DD
            }));
          }}
          dateFormat="MM-dd-yyyy"
          className="form-control"
          placeholderText="MM-DD-YYYY"
          
        />
      </Form.Group>
    </div>

    <div className="col-md-6">
      <Form.Group className="mb-3">
        <Form.Label>Priority</Form.Label>
        <Form.Select 
          name="priority"
          value={formData.priority}
          onChange={handleInputChangedue}
          
        >      <option value="">-- Select priority --</option> {/* Default empty option */}

          {priorities.map((p, index) => (
            <option key={index} value={p}>{p}</option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  </div>

  {/* Status & Assign To */}
  <div className="row">
    {/* <div className="col-md-6">
      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select 
          name="status"
          
          value={"new"}
          onChange={handleInputChangedue}
          
        >
          {statuses.map((s, index) => (
            
            <option key={index} value={s}>{s}</option>
          ))}
        </Form.Select>
      </Form.Group>
    </div> */}

  <div className="col-md-6">
    <Form.Group className="mb-3">
      <Form.Label>Status</Form.Label>
      <Form.Control
        type="text"
        value="New"
        readOnly
        plaintext
      />
    </Form.Group>
  </div>


    <div className="col-md-6">
      <Form.Group className="mb-3">
        <Form.Label>Assign To</Form.Label>
        <Form.Select 
          name="assign_id"
          value={formData.assign_id}
          onChange={handleInputChangedue}
          
        >      <option value="">-- Select User --</option> {/* Default empty option */}

          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>{user.name}</option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  </div>

  {/* Tag Input */}
  <Form.Group className="mb-3">
    <Form.Label>Tags</Form.Label>
    <Form.Control
      type="text"
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      onKeyDown={handleTagKeyDown}
      placeholder="Enter tags and press Enter"
    />
    <div className="mt-2">
      {tags.map((tag, index) => (
        <span key={index} className="badge bg-primary me-2">
          {tag} <span onClick={() => removeTag(tag)} style={{ cursor: "pointer" }}>x</span>
        </span>
      ))}
    </div>
  </Form.Group>

  {/* File Upload */}
  <Form.Group className="mb-3">
    <Form.Label>Attach File</Form.Label>
    <Form.Control type="file" onChange={handleFileChange} />
  </Form.Group>

  {/* Comments */}
  <Form.Group className="mb-3">
    <Form.Label>Comment</Form.Label>
    <Form.Control 
      as="textarea" 
      rows={2} 
      name="comment"
      value={formData.comment}
      onChange={handleInputChangedue} 
      placeholder="Add comments"
    />
  </Form.Group>

  {/* Buttons */}
  <div className="d-flex justify-content-between">
    <Button variant="secondary" onClick={handleCancel}>
      Cancel
    </Button>
    <Button variant="primary" type="submit">
      Submit
    </Button>
  </div>
</Form>

    </div>
</div>
    </div>
  );
};

export default UserCreateTicket;
