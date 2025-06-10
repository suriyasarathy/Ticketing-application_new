import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role_id: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        console.log("id", id);
        
        const userRes = await fetch(`http://localhost:3000/userEditDetail/${id}`);
        const userData = await userRes.json();
        setUser(userData);

        // Fetch roles data
        const rolesRes = await fetch("http://localhost:3000/role");
        const rolesData = await rolesRes.json();
        setRoles(rolesData);

        setLoading(false);
      } catch (err) {
        setError("Error loading user or roles.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/userupdate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert("User updated successfully!");
        navigate("/user-list");
      } else {
        alert("Failed to update user.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error updating user.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h3>Edit User</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <select
            id="role"
            className="form-control"
            value={user.role_id}
            onChange={(e) => setUser({ ...user, role_id: e.target.value })}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Update User
        </button>
      </form>
    </div>
  );
};

export default UserEdit;
