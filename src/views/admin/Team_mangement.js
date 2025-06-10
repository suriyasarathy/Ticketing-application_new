import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Table, Form } from 'react-bootstrap';

const Team_mangement = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const res = await axios.get('http://localhost:3000/team');
    setTeams(res.data);
  };

  const fetchTeamMembers = async (team_id) => {
    console.log(team_id);
    
    setSelectedTeamId(team_id);
    const res = await axios.get(`http://localhost:3000/team/${team_id}/members`);
    setTeamMembers(res.data);
  };

  const fetchAvailableMembers = async () => {
    const res = await axios.get('http://localhost:3000/available-members');
    setAvailableMembers(res.data);
  };

  const handleDeleteTeam = async (team_id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    await axios.delete(`http://localhost:3000/teamDelete?team_id=${team_id}`);
    setTeamMembers([]);
    fetchTeams();
  };

  const handleRemoveMember = async (member_id) => {
    await axios.delete('http://localhost:3000/project/teammember/remove', {
      data: { team_id: selectedTeamId, member_id }
    });
    fetchTeamMembers(selectedTeamId);
  };

  const handleAddMember = async () => {
    await axios.post('http://localhost:3000/project/teammember/add', {
      team_id: selectedTeamId,
      member_id: newMemberId
    });
    setShowAddModal(false);
    fetchTeamMembers(selectedTeamId);
  };

  return (
    <div className="container mt-4">
      <h3>Team Management</h3>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Team ID</th>
            <th>Team Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.id}>
              <td>{team.id}</td>
              <td>{team.name}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => fetchTeamMembers(team.id)}>View Members</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDeleteTeam(team.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedTeamId && (
        <>
          <h5>Members in Team #{selectedTeamId}</h5>
          <Button variant="primary" size="sm" onClick={() => {
            setShowAddModal(true);
            fetchAvailableMembers();
          }}>Add Member</Button>

          <Table bordered hover className="mt-2">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(member => (
                <tr key={member.user_id}>
                  <td>{member.user_id}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>
                    <Button variant="outline-danger" size="sm"
                      onClick={() => handleRemoveMember(member.user_id)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Member to Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select onChange={e => setNewMemberId(e.target.value)} defaultValue="">
            <option disabled value="">Select a user</option>
            {availableMembers.map(user => (
              <option key={user.user_id} value={user.user_id}>
                {user.name} ({user.email})
              </option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleAddMember}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Team_mangement;
