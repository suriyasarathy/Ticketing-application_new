import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge,Button } from "react-bootstrap";
import { Calendar, User } from "lucide-react";
import { useProject } from "../ContextData"; // Import the context
import { format } from "date-fns";
import {useAuth} from "../ContextData"

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
const [userId, setUserId] = useState(null);
const { user } = useAuth();

useEffect(() => {
  if (user?.userId) {
    setUserId(user.userId);
  }
}, [user]);

  console.log("userIddddddddddddddddddddddddddddddddddddddddddddd",userId);
  
  const { setSelectedProject } = useProject(); // Get the context function
    const { logout } = useAuth();
  
  useEffect(() => {
    fetch(`http://localhost:3000/projects/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []))
      .catch((err) => console.error("Error fetching projects:", err));
  }, [userId, token]);
  function onchangeLogin() {
    logout();
    navigate(`/login`);
  }
  return (
    <div className="container mt-4">
   {/* ✅ Profile button aligned to top-right */}
   <div className="d-flex justify-content-end mb-3">
      <Button
        variant="secondary"
        onClick={() => navigate("/Create_Project")}
        className="fw-bold px-4 me-2" // Add margin to the right
      > create project </Button>
    <Button onClick={onchangeLogin}>Log out</Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/User-Profile/${userId}`)}
          className="fw-bold px-4"
        >
          Profile
        </Button>

      </div>
      <h2 className="text-center mb-4">Projects</h2>
      {projects.length === 0 ? (
        <p className="text-muted text-center">No projects found</p>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div key={project.project_id} className="col-md-6 col-lg-4 mb-4">
              <Card
                className="shadow-sm p-3"
                onClick={() => {
                  setSelectedProject(project); // Store project in context
                  navigate(`/ProjectOfTicket/${project.project_id}`); // Navigate to ticket page
                }}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <h4 className="fw-bold mb-0">{project.name}</h4>
                  <p><strong>Project ID:</strong> {project.project_id}</p> {/* ✅ Added project_id */}
                  <Badge bg="secondary" className="p-2">
                    <Calendar size={14} className="me-1" />
                     {project?.due_date 
                        ? format(new Date(project.due_date), "MM-dd-yyyy HH:mm a") 
                        : " No Due Date"}
                  </Badge>
                  <hr />
                  <ul className="list-unstyled mb-0">
                    <li>
                      <User size={16} className="me-2" />
                      <strong>Manager:</strong> {project.manager_name || "Not Assigned"}
                    </li>
                    <li>
                      <strong>Phase:</strong> {project.phase_name	|| "N/A"}
                    </li>
                    <li>
                    {/* {project?.due_date 
                        ? format(new Date(project.due_date), "MM-dd-yyyy HH:mm a") 
                        : " No Due Date"} */}
                    <li>
                      </li>
                      <strong>Total Tickets:</strong> {project.total_tickets || 0}
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
