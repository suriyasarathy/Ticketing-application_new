import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/user");
        const json = await res.json();
        console.log("API Response:", json);  // Check if it's an array
        setUsers(json);  // Directly set json if it's an array
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0 && tableRef.current) {
      setTimeout(() => {
        $(tableRef.current).DataTable();
      }, 0);
      return () => {
        $(tableRef.current).DataTable().destroy();
      };
    }
  }, [users]);

  const handleEdit = (userId) => {
    console.log("Edit user with ID:", userId);
    
    navigate(`/UserEdit/${userId}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const table = $(tableRef.current).DataTable();
      table.destroy(); // Destroy existing table before removing user

      await fetch(`http://localhost:3000/userdelete/${id}`, {
        method: "DELETE",
      });

      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers); // Update state to trigger re-render and reinit table
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>User List</h3>
      <table
        ref={tableRef}
        id="userListTable"
        className="table table-striped table-bordered"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>#ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.user_id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.Role}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(user.user_id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.user_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
