import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TicketDetailUser from "./TicketDetailUser";
import "bootstrap/dist/css/bootstrap.min.css";
// import TicketDetailUser from './TicketDetailUser'

const UserTickets = () => {
  const [ticketsData, setTicketsData] = useState({ projects: [], assigned_tickets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetch(`http://localhost:3000/user-tickets?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setTicketsData(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching tickets");
          setLoading(false);
        });
    }
  }, []);

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch("http://localhost:3000/update-ticket-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticketId, status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        setTicketsData((prev) => ({
          projects: prev.projects.map((project) => ({
            ...project,
            tickets: project.tickets.map((ticket) =>
              ticket.Ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
            ),
          })),
          assigned_tickets: prev.assigned_tickets.map((ticket) =>
            ticket.Ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
          ),
        }));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("Error updating ticket status");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">My Tickets</h2>
        <button
          onClick={() => navigate("/UserCreateTicket")}
          className="btn btn-success"
        >
          + Add Ticket
        </button>
        <button
      onClick={() => navigate("/User-Profile")}
      className="btn btn-info"
    >
      My Profile
    </button>
      </div>

      {selectedTicketId ? (
        <TicketDetailUser ticketId={selectedTicketId} onBack={() => setSelectedTicketId(null)} />
      ) : (
        <>
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <>
              {/* Assigned Tickets Section */}
              <h4 className="text-dark">Assigned Tickets</h4>
              {ticketsData.assigned_tickets.length > 0 ? (
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Project</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketsData.assigned_tickets.map((ticket) => (
                      <tr key={ticket.Ticket_id}>
                        <td>{ticket.project_name}</td>
                        <td>{ticket.Tittle}</td>
                        <td>{ticket.description}</td>
                        <td>
                          <select
                            value={ticket.status || "Open"}
                            onChange={(e) =>
                              handleUpdateTicketStatus(ticket.Ticket_id, e.target.value)
                            }
                            className="form-select"
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setSelectedTicketId(ticket.Ticket_id)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No assigned tickets.</p>
              )}

              {/* Project Selection Cards */}
              <h4 className="mt-4 text-dark">Projects</h4>
              <div className="row">
                {ticketsData.projects.length > 0 ? (
                  ticketsData.projects.map((project) => (
                    <div key={project.project_id} className="col-md-4">
                      <div
                        className="card shadow-sm p-3 mb-3"
                        style={{
                          cursor: "pointer",
                          background: selectedProject === project.project_id ? "#dff0d8" : "#fff",
                        }}
                        onClick={() =>
                          setSelectedProject(
                            selectedProject === project.project_id ? null : project.project_id
                          )
                        }
                      >
                        <h5 className="card-title text-center">{project.project_name}</h5>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No projects available.</p>
                )}
              </div>

              {/* Display Tickets for Selected Project */}
              {selectedProject && (
                <div className="mt-4">
                  <h4 className="text-dark">Tickets for {ticketsData.projects.find(p => p.project_id === selectedProject)?.project_name}</h4>
                  {ticketsData.projects.find(p => p.project_id === selectedProject)?.tickets.length > 0 ? (
                    <table className="table table-bordered table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticketsData.projects
                          .find((p) => p.project_id === selectedProject)
                          ?.tickets.map((ticket) => (
                            <tr key={ticket.Ticket_id}>
                              <td>{ticket.Tittle}</td>
                              <td>{ticket.description}</td>
                              <td>
                                <select
                                  value={ticket.status || "Open"}
                                  onChange={(e) =>
                                    handleUpdateTicketStatus(ticket.Ticket_id, e.target.value)
                                  }
                                  className="form-select"
                                >
                                  <option value="Open">Open</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Resolved">Resolved</option>
                                </select>
                              </td>
                              <td>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => setSelectedTicketId(ticket.Ticket_id)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted">No tickets in this project.</p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserTickets;
