import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

const EmailTicket = () => {
  const [emailData, setEmailData] = useState([]);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("http://localhost:3000/email-tickets");
        const json = await res.json();
        const formattedData = json.data.map((item) => ({
          id: item.Email_ticket_id,
          subject: item.subject || "N/A",
          sender: item.sender,
          message: item.message || "N/A",
          receivedAt: item.received_at,
        }));
        setEmailData(formattedData);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    if (emailData.length > 0 && tableRef.current) {
      setTimeout(() => {
        $(tableRef.current).DataTable();
      }, 0);
      return () => {
        $(tableRef.current).DataTable().destroy();
      };
    }
  }, [emailData]);
  
  

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this email?")) return;
    try {
      const table = $(tableRef.current).DataTable(); // Destroy existing table
      table.destroy();
  
      await fetch(`http://localhost:3000/email-delete/${id}`, {
        method: "DELETE",
      });
  
      const updatedData = emailData.filter((item) => item.id !== id);
      setEmailData(updatedData); // This will trigger re-render and table reinit
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  

  const handleCreateTicket = (email) => {
    navigate(
      `/Email_Create_ticket?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.message)}&id=${encodeURIComponent(email.id)}`
    );
  };

  return (
    <div className="container mt-4">
      <h3>Email Tickets</h3>
      <table
        ref={tableRef}
        id="emailTicketsTable"
        className="table table-striped table-bordered"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>#ID</th>
            <th>Subject</th>
            <th>Sender</th>
            <th>Body</th>
            <th>Received At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emailData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.subject}</td>
              <td>{item.sender}</td>
              <td>{item.message}</td>
              <td>{new Date(item.receivedAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleCreateTicket(item)}
                >
                  Create Ticket
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmailTicket;
