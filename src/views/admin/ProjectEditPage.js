import React, { useState, useEffect } from "react";
import { Card, Button, Form, FormControl, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ProjectEditPage = () => {
  const { Id } = useParams();

  const projectId = Id;
  
  
  console.log(projectId);
  const [projectSettings, setProjectSettings] = useState(null);
  const [originalProject, setOriginalProject] = useState(null);

  const [project, setProject] = useState("");
  const [loading, setLoading] = useState(true);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
const [availableMembers, setAvailableMembers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (showModal) {
      axios.get(`http://localhost:3000/available-members`)
        .then((response) => {
          console.log("Available Members:", response.data); // Debugging
          setAvailableMembers(response.data);
        })
        .catch(error => console.error("Error fetching members:", error));
    }
  }, [showModal]);
  
  const handleEditClick = (user_id,Project_id1) => {
    navigate(`TicketEditPage/${Project_id1,user_id}`); // Navigating to the Edit Page
  };



  const handledelete =(project_id)=>{
    console.log(project_id);
    
    axios.delete(`http://localhost:3000/projectdelete`,{
      data:{
         project_ids:project_id

      }
    }).then(()=>{
      alert("project removed sucessfuly ")
      navigate(-1);
    })

  }
  // Function to remove a member
const handleRemoveMember = (memberId) => {
    axios.delete(`http://localhost:3000/project/teammember/remove`, {
      data:{
      team_id: selectedTeam.team_id,
      member_id: memberId
   } }).then(() => {
      alert("Member removed successfully!");
      setSelectedTeamMembers(selectedTeamMembers.filter(m => m.id !== memberId));
    });
  };
  
  // Function to add a new member
  const handleAddMember = () => {
    if (!newMember) return alert("Please select a member!");
  
    axios.post(`http://localhost:3000/project/teammember/add`, {
      team_id: selectedTeam.team_id,
      member_id: newMember
    }).then(() => {
      alert("Member added successfully!");
      setSelectedTeamMembers([...selectedTeamMembers, availableMembers.find(m => m.user_id === newMember)]);
    });
  };
  useEffect(() => {
    // Fetch project details
    axios.get(`http://localhost:3000/project/${projectId}`).then((response) => {
      setProject(response.data);
      setOriginalProject(response.data)
      setLoading(false);
    });

    // Fetch available teams
    axios.get(`http://localhost:3000/team`).then((response) => {
      setAvailableTeams(response.data);
    });
  }, [projectId]);

  const handleInputChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };
  const handlesettingSave = () => {
    axios.put(`http://localhost:3000/project/settings/${projectId}`, projectSettings)
      .then(() => alert("Project settings updated successfully!"))
      .catch(error => console.error("Error updating settings:", error));
  };
  
  const handleSave = () => {
    if (!originalProject) return;
  
    const updatedFields = {};
    Object.keys(project).forEach((key) => {
      if (project[key] !== originalProject[key]) {
        updatedFields[key] = project[key];
      }
    });
  
    if (Object.keys(updatedFields).length === 0) {
      alert("No changes detected.");
      return;
    }
    console.log("Modified Fields:", updatedFields); // Debugging purpose

  
    axios.put(`http://localhost:3000/project/${projectId}`, updatedFields)
      .then(() => {
        alert("Project updated successfully");
      })
      .catch((error) => {
        console.error("Error updating project:", error);
      });
  };
  

  const handleAddTeam = () => {
    if (!selectedTeam) return alert("Please select a team first!");

    axios.post(`http://localhost:3000/project/team/add`, {
      project_id: project.project_id,
      team_id: selectedTeam,
    }).then(() => {
      alert("Team added successfully");
      // Refresh teams list
      axios.get(`http://localhost:3000/project/${project.project_id}`).then((response) => {
        setProject(response.data);
      });
    });
  };

  const toggleTeamMembers = (team) => {
    setSelectedTeam(team);
  
    axios.get(`http://localhost:3000/team/${team.team_id}/members`)
      .then((response) => {
        setSelectedTeamMembers(response.data); // Ensure API returns an array of members
        setShowModal(true);
      })
      .catch((error) => {
        console.error("Error fetching team members:", error);
        alert("Failed to fetch team members");
      });
  };
  
  useEffect(() => {
    axios.get(`http://localhost:3000/project/settings/${projectId}`)
      .then(response => {
        if (response.data) {
          setProjectSettings(response.data);
        } else {
          setProjectSettings(null);  // No data case
        }
        setLoading(false);
       
      })
      .catch(error => {
        console.error("Error fetching project settings:", error);
        setProjectSettings({});  // Ensure projectSettings is not null
      })
      .finally(() => {
        setLoading(false);
      });

  }, [projectId]);
  const handleRemoveTeam = (teamId) => {
    if (!window.confirm("Are you sure you want to remove this team?")) return;
  
    axios.delete(`http://localhost:3000/project/team/remove`, {
      data: {
        project_id: project.project_id,
        team_id: teamId
      }
    })
    .then(() => {
      alert("Team removed successfully!");
  
      // Update the state by removing the deleted team
      setProject({
        ...project,
        team: project.team.filter(team => team.team_id !== teamId)
      });
    })
    .catch(error => {
      console.error("Error removing team:", error);
      alert("Failed to remove team.");
    });
  };
  

  if (loading) return <p>Loading...</p>;
  if (!projectSettings) return <p>No project settings found</p>;

  return (
    <div className="p-6">
<button onClick={() => handledelete(project.project_id)}>Delete</button>
<h2 className="text-2xl font-bold mb-4">Edit Project</h2>
      <Card>
        <Card.Body className="p-4">
          <h5>Project Information</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Form.Label>Project ID</Form.Label>
              <FormControl value={project.project_id} disabled />
            </div>
            <div>
              <Form.Label>Project Name</Form.Label>
              <FormControl name="project_name" value={project.project_name} onChange={handleInputChange} />
            </div>
            <div className="col-span-2">
              <Form.Label>Description</Form.Label>
              <FormControl name="description" value={project.description} onChange={handleInputChange} />
            </div>
            <div>
              <Form.Label>Due Date</Form.Label>
              <FormControl 
  type="date" 
  name="due_date" 
  value={project.due_date ? project.due_date.split("T")[0] : ""} 
  onChange={handleInputChange} 
/>
            </div>
          </div>

        
          <div className="container mt-4">
    <h2>Project Settings</h2>

    {/* Custom Priorities Section */}
    <h5 className="mt-4">Custom Priorities</h5>
    {projectSettings.custom_priorities.map((priority, index) => (
      <div key={index} className="mb-2">
        <input 
          type="text" 
          value={priority} 
          onChange={(e) => {
            const updatedPriorities = [...projectSettings.custom_priorities];
            updatedPriorities[index] = e.target.value;
            setProjectSettings({ ...projectSettings, custom_priorities: updatedPriorities });
          }} 
        />
      </div>
    ))}
    <button 
      onClick={() => setProjectSettings({ 
        ...projectSettings, 
        custom_priorities: [...projectSettings.custom_priorities, ""] 
      })}
    >
      Add Priority
    </button>

    {/* Custom Statuses Section */}
    <h5 className="mt-4">Custom Statuses</h5>
    {projectSettings.custom_statuses.map((status, index) => (
      <div key={index} className="mb-2">
        <input 
          type="text" 
          value={status} 
          onChange={(e) => {
            const updatedStatuses = [...projectSettings.custom_statuses];
            updatedStatuses[index] = e.target.value;
            setProjectSettings({ ...projectSettings, custom_statuses: updatedStatuses });
          }} 
        />
      </div>
    ))}
    <button 
      onClick={() => setProjectSettings({ 
        ...projectSettings, 
        custom_statuses: [...projectSettings.custom_statuses, ""] 
      })}
    >
      Add Status
    </button>

    {/* Save Button */}
    <button className="mt-3" onClick={handlesettingSave}>
      Save Changes
    </button>
  </div>


        </Card.Body>
      </Card>

      <h5 className="mt-4">Teams</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Team Lead</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(project?.team) && project.team.map((team, index) => (
  <tr key={index}>
    <td>{team.team_name}</td>
    <td>{team.team_lead}</td>
    <td>
      <Button variant="info" size="sm" onClick={() => toggleTeamMembers(team)}>
        View Members
      </Button>
      <Button variant="danger" size="sm" className="ms-2" onClick={() => handleRemoveTeam(team.team_id)}>
        Remove
      </Button>
    </td>
  </tr>
))}

        </tbody>
      </Table>

      <h5 className="mt-4">Add Team</h5>
      <Form.Select onChange={(e) => setSelectedTeam(e.target.value)}>
        <option value="">Select a team</option>
        {availableTeams.map((team) => (
          <option key={team.team_id} value={team.id}>{team.name}</option>
        ))}
      </Form.Select>
      <Button className="mt-2" variant="primary" onClick={handleAddTeam}>
        Add Team
      </Button>

      {/* <h5 className="mt-4">Tickets List</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
    
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {project.tickets.map((ticket) => (
            <tr key={ticket.ticket_id}>
              <td>{ticket.ticket_id}</td>
              <td>{ticket.Tittle}</td>
              
              <td>{ticket.status}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.name}</td>
              <td>
              <Button variant="primary" size="sm" onClick={() => navigate(`/TicketEditPage/${projectId}/${ticket.ticket_id}`)}>
  Edit
</Button>

              </td>
            </tr>
          ))}
        </tbody>
      </Table> */}

      <Button className="mt-4" onClick={handleSave}>Save Changes</Button>

     {/* Team Members Modal */}
<Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Team Members - {selectedTeam?.team_name}</Modal.Title>
  </Modal.Header>
  
  <Modal.Body>
    {selectedTeamMembers.length > 0 ? (
      <ul>
        {selectedTeamMembers.map((member, index) => (
          <li key={index}>
            {member.name}  
            <Button 
              variant="danger" 
              size="sm" 
              className="ml-2" 
              onClick={() => handleRemoveMember(member.user_id)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    ) : (
      <p>No team members assigned.</p>
    )}

    <h6 className="mt-3">Add New Member</h6>
    <Form.Select value={newMember} onChange={(e) => setNewMember(Number(e.target.value))}>
  <option value="">Select a member</option>
  {Array.isArray(availableMembers) && availableMembers.length > 0 ? (
    availableMembers.map((member) => (
      <option key={member.user_id} value={member.user_id}>{member.name}</option>
    ))
  ) : (
    <option disabled>Loading members...</option>
  )}
</Form.Select>



    <Button className="mt-2" variant="success" onClick={handleAddMember}>
      Add Member
    </Button>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


    </div>
  );
};

export default ProjectEditPage;