import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { FaLink } from "react-icons/fa";

const ProjectTeamList = ({ projectId, onClose }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token =localStorage.getItem('authToken')
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`http://localhost:3000/project-teams/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
          },
        });
        const data = await response.json();

        if (response.ok) {
          setTeams(data);
        } else {
          console.error("Failed to fetch teams:", data.message);
        }
      } catch (error) {
        console.error("Error fetching project teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [projectId]);

  const handleShowDetails = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h3>Teams for Project {projectId}</h3>

      {loading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Team ID</th>
              <th>Team Name</th>
              <th>Team Lead</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.team_id}>
                <td>{team.team_id}</td>
                <td>{team.team_name}</td>
                <td>{team.team_lead_name || "N/A"}</td>
                <td>
                  <FaLink
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handleShowDetails(team)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Team Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Team Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTeam ? (
            <>
              <p><strong>Team Name:</strong> {selectedTeam.team_name}</p>
              <p><strong>Team Lead:</strong> {selectedTeam.team_lead_name || "N/A"}</p>
              <h5>Members:</h5>
              <ul>
                {selectedTeam.users.map((user) => (
                  <li key={user.user_id}>{user.user_name}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>No details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectTeamList;
