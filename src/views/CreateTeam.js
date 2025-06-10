import React, { useState } from 'react';

const CreateTeam = () => {
  const [teamData, setTeamData] = useState({
    name: '',
    team_lead_id: '',
    members: [],
  });
  const [users, setUsers] = useState([]); // List of all users (fetched from the backend)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token =localStorage.getItem('authToken')
  // Fetch users when the component mounts
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
          },
        });
        const data = await response.json();
        setUsers(data); // Populate the users list
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
  };

  const handleCheckboxChange = (userId) => {
    setTeamData((prev) => {
      const members = prev.members.includes(userId)
        ? prev.members.filter((id) => id !== userId) // Remove if already selected
        : [...prev.members, userId]; // Add if not already selected
      return { ...prev, members };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure name and team lead are provided
    if (!teamData.name.trim() || !teamData.team_lead_id) {
      setError('Team name and team lead are required!');
      setSuccess('');
      return;
    }

    if (teamData.members.length === 0) {
      setError('At least one team member must be selected!');
      setSuccess('');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/create-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
           "Authorization": `Bearer ${token}`,
         },
        body: JSON.stringify(teamData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Team created successfully!');
        setError('');
        setTeamData({ name: '', team_lead_id: '', members: [] }); // Reset form
      } else {
        setError(data.message || 'Failed to create the team.');
        setSuccess('');
      }
    } catch (err) {
      console.error('Error creating team:', err);
      setError('An error occurred. Please try again later.');
      setSuccess('');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>Create Team</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Team Name:</label>
          <input
            type="text"
            name="name"
            value={teamData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Team Lead:</label>
          <select
            name="team_lead_id"
            value={teamData.team_lead_id}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">-- Select Team Lead --</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Team Members:</label>
          {users.map((user) => (
            <div key={user.user_id} style={{ marginBottom: '8px' }}>
              <input
                type="checkbox"
                id={`member-${user.user_id}`}
                value={user.user_id}
                checked={teamData.members.includes(user.user_id)}
                onChange={() => handleCheckboxChange(user.user_id)}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor={`member-${user.user_id}`} style={{ fontWeight: '400' }}>{user.name}</label>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <button
            type="submit"
            style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Create Team
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
    </div>
  );
};

export default CreateTeam;
