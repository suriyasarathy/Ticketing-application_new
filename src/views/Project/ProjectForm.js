import React, { useState, useEffect } from "react";
import axios from "axios";
import MDBSelect from "../../components/multipleDropdown/select";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const allPriorities = [
  { text: "High", value: 1 },
  { text: "Medium", value: 2 },
  { text: "Low", value: 3 },
];

const allStatuses = [
  { text: "Open", value: 1 },
  { text: "In Progress", value: 2 },
  { text: "Resolved", value: 3 },
  { text: "Closed", value: 4 },
];

const ProjectForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [projectManagerId, setProjectManagerId] = useState("");
  const [clientId, setClientId] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [allowTicketReassign, setAllowTicketReassign] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");
  const [clients, setClients] = useState([]);
  const [enableCustomPriorities, setEnableCustomPriorities] = useState(false);
  const [customPriorities, setCustomPriorities] = useState([]);
  const [enableCustomStatuses, setEnableCustomStatuses] = useState(false);
  const [customStatuses, setCustomStatuses] = useState([]);

  const now = new Date();
const projectId = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${now.getFullYear()}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
console.log(projectId);

  useEffect(() => {
    console.log("Allow Ticket Reassign:", allowTicketReassign);
  }, [allowTicketReassign]);
  
  // ✅ Set default selected values only once when the component mounts
  useEffect(() => {
    setSelectedPriorities(allPriorities); // ✅ Store full objects
    setSelectedStatuses(allStatuses); // ✅ Store full objects
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data.map((user) => ({ id: user.user_id, name: user.name }))))
      .catch(() => alert("Error fetching users"));

    axios
      .get("http://localhost:3000/team", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTeams(res.data))
      .catch(() => alert("Error fetching teams"));

    axios
      .get("http://localhost:3000/clients", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setClients(res.data))
      .catch(() => alert("Error fetching clients"));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!name || !description || !projectManagerId || !clientId) {
      alert("All required fields must be filled!");
      setLoading(false);
      return;
    }
  
    const projectData = {
      projectId ,
      name,
      description,
      project_manager_id: projectManagerId,
      client_id: clientId,
      teams: selectedTeams,
      default_priority: selectedPriorities.map((p) => p.text),
      default_status: selectedStatuses.map((s) => s.text),
      allow_ticket_reassign: allowTicketReassign,
      enable_custom_priorities: enableCustomPriorities,
      custom_priorities: enableCustomPriorities ? customPriorities : [],
      enable_custom_statuses: enableCustomStatuses,
      custom_statuses: enableCustomStatuses ? customStatuses : [],
    };
    
  
    try {
      await axios.post("http://localhost:3000/create-project", projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Project created successfully!");
    } catch {
      alert("Error creating project");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="container bg-light p-4 rounded shadow-sm">
      <h2 className="text-center text-primary">Create a Project</h2>

      {/* Project Name & Description */}
      <div className="mb-3">
        <label className="form-label">Project Name</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>

      {/* Project Manager Selection */}
      <div className="mb-3">
        <label className="form-label">Project Manager</label>
        <select className="form-control" value={projectManagerId} onChange={(e) => setProjectManagerId(e.target.value)} required>
          <option value="">Select Project Manager</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Client Selection */}
      <div className="mb-3">
        <label className="form-label">Client</label>
        <select className="form-control" value={clientId} onChange={(e) => setClientId(e.target.value)} required>
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Team Selection */}
      <div className="mb-3">
        <label className="form-label">Select Teams</label>
        <MDBSelect
          data={teams.map((team) => ({ text: team.name, value: team.id }))}
          multiple
          onValueChange={(values) => setSelectedTeams(values.map((v) => v.value))}
        />
      </div>

      {/* Priority Selection (Default Select All) */}
      <div className="mb-3">
        <label className="form-label">Select Priorities</label>
        <MDBSelect
  data={allPriorities}
  multiple
  value={selectedPriorities} // ✅ Pass selected objects
  onValueChange={setSelectedPriorities} // ✅ Directly update state
/>

      </div>

      {/* Status Selection (Default Select All) */}
      <div className="mb-3">
        <label className="form-label">Select Statuses</label>
        <MDBSelect
  data={allStatuses}
  multiple
  value={selectedStatuses} // ✅ Pass selected objects
  onValueChange={setSelectedStatuses} // ✅ Directly update state
/>

      </div>

      {/* Allow Ticket Reassign Checkbox */}

{/* Allow Ticket Reassign Checkbox */}
<div className="form-check d-flex align-items-center" style={{ gap: "8px", cursor: "pointer" }}>
  <input
    id="allowReassign"
    className="form-check-input"
    type="checkbox"
    checked={allowTicketReassign}
    onChange={() => setAllowTicketReassign(!allowTicketReassign)}
    style={{ width: "18px", height: "18px", cursor: "pointer" }}
  />
  <label htmlFor="allowReassign" className="form-check-label">
    Allow Ticket Reassign
  </label>
</div>

{/* Enable Custom Priorities Checkbox */}
<div className="form-check d-flex align-items-center mt-2" style={{ gap: "8px", cursor: "pointer" }}>
  <input
    type="checkbox"
    className="form-check-input"
    id="enableCustomPriorities"
    checked={enableCustomPriorities}
    onChange={() => setEnableCustomPriorities(!enableCustomPriorities)}
    style={{ width: "18px", height: "18px", cursor: "pointer" }}
  />
  <label htmlFor="enableCustomPriorities" className="form-check-label">
    Enable Custom Priorities
  </label>
</div>

{/* Custom Priorities Input */}
{enableCustomPriorities && (
  <input
    type="text"
    className="form-control mt-2"
    placeholder="Enter custom priorities (comma-separated)"
    onChange={(e) => setCustomPriorities(e.target.value.split(","))}
    style={{ padding: "8px", fontSize: "14px" }}
  />
)}

{/* Enable Custom Statuses Checkbox */}
<div className="form-check d-flex align-items-center mt-2" style={{ gap: "8px", cursor: "pointer" }}>
  <input
    type="checkbox"
    className="form-check-input"
    id="enableCustomStatuses"
    checked={enableCustomStatuses}
    onChange={() => setEnableCustomStatuses(!enableCustomStatuses)}
    style={{ width: "18px", height: "18px", cursor: "pointer" }}
  />
  <label htmlFor="enableCustomStatuses" className="form-check-label">
    Enable Custom Statuses
  </label>
</div>

{/* Custom Statuses Input */}
{enableCustomStatuses && (
  <input
    type="text"
    className="form-control mt-2"
    placeholder="Enter custom statuses (comma-separated)"
    onChange={(e) => setCustomStatuses(e.target.value.split(","))}
    style={{ padding: "8px", fontSize: "14px" }}
  />
)}




<button
  type="submit"
  className="btn btn-primary w-100 mt-3"
  disabled={loading}
  style={{ padding: "10px", fontSize: "16px", fontWeight: "bold" }}
>
  {loading ? "Creating..." : "Create Project"}
</button>

    </form>
  );
};

export default ProjectForm;
