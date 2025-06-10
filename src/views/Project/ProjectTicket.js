import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.css";
import "datatables.net-bs5";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import "datatables.net-fixedcolumns-bs5";
import { FaLink } from "react-icons/fa";  
import ProjectTeamList from "./ProjectTeamList";
import NewTrash1 from "./NewTrash1";

const ProjectTicket = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showTeamList, setShowTeamList] = useState(false);
  const [projectId, setProjectId] = useState('');
  const navigate = useNavigate(); // Used for navigation
  const token = localStorage.getItem("authToken");
  console.log(projectId);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/project&ticket", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });
        const data = await response.json();

        const formattedData = data.map((item) => ({
          Project_Id: item.project_id || "N/A",
          Project_Lead_name: item.project_manager_name || "N/A",
          projectName: item.project_name || "N/A",
          Start_Date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
          totalTickets: item.total_tickets || 0,
          openHigh: item.open_tickets_high || 0,
          openMedium: item.open_tickets_medium || 0,
          openLow: item.open_tickets_low || 0,
          inProgressHigh: item.in_progress_tickets_high || 0,
          inProgressMedium: item.in_progress_tickets_medium || 0,
          inProgressLow: item.in_progress_tickets_low || 0,
          resolvedHigh: item.resolved_tickets_high || 0,
          resolvedMedium: item.resolved_tickets_medium || 0,
          resolvedLow: item.resolved_tickets_low || 0,
          closedHigh: item.closed_tickets_high || 0,
          closedMedium: item.closed_tickets_medium || 0,
          closedLow: item.closed_tickets_low || 0,
          status: item.status || "N/A",
          projectId: item.project_id,
        }));

        setTableData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleBackToProjectTicket = () => {
    setShow(false);
  };
  const handleProjectClick = (id) => {
    setProjectId(id);
    setShowTeamList(true);
  };

  const handleEditClick = (id) => {
    console.log("Editing Project:", id);
    navigate(`/ProjectEdit/${id}`);
  };
  

  useEffect(() => {
    if (!loading && tableData.length > 0) {
      const dataTable = $("#example").DataTable({
        destroy: true,
        dom: "Bfrtip",
        buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5", "print"],
        rowCallback: (row, data) => {
          $(row).removeClass("table-success table-warning table-danger");
          if (data.status === "resolved") $(row).addClass("table-success");
          else if (data.status === "in_progress") $(row).addClass("table-warning");
          else if (data.status === "open") $(row).addClass("table-danger");
        },
        order: [[0, "asc"]],
      });

      return () => dataTable.destroy(false);
    }
  }, [loading, tableData, show]);

  return (
    <>
      {showTeamList ? (
        <ProjectTeamList projectId={projectId} onClose={() => setShowTeamList(false)} />
      ) : show ? (
<NewTrash1 ProjectIdFrom={projectId} onBack={handleBackToProjectTicket} />
      ) : (
        <div className="container mt-4">
          <h3>Project Tickets</h3>
          {loading ? (
            <div className="spinner-border" role="status" style={{ display: "block", margin: "20px auto", width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <table id="example" className="table table-striped table-bordered" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th colSpan="1"></th>
                  <th colSpan="1"></th>
                  <th colSpan="1"></th>
                  <th colSpan="1"></th>
                  <th colSpan="1"></th>
                  <th colSpan="1"></th>
                  <th colSpan="3">Open</th>
                  <th colSpan="3">In Progress</th>
                  <th colSpan="3">Resolved</th>
                  <th colSpan="3">Closed</th>
                  <th colSpan="1"></th>
                </tr>
                <tr>
                  <th>Project ID</th>
                  <th>Team</th>
                  <th>Project Name</th>
                  <th>Project Lead</th>
                  <th>Total Tickets</th>
                  <th>Start Date</th>
                  <th>High</th>
                  <th>Medium</th>
                  <th>Low</th>
                  <th>High</th>
                  <th>Medium</th>
                  <th>Low</th>
                  <th>High</th>
                  <th>Medium</th>
                  <th>Low</th>
                  <th>High</th>
                  <th>Medium</th>
                  <th>Low</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setProjectId(item.projectId);
                          setShow(true);
                        }}
                        style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
                      >
                        {item.Project_Id}
                      </a>
                    </td>
                    <td>
                      <FaLink
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handleProjectClick(item.projectId)}
                      />
                    </td>
                    <td>{item.projectName}</td>
                    <td>{item.Project_Lead_name}</td>
                    <td>{item.totalTickets}</td>
                    <td>{item.Start_Date}</td>
                    <td>{item.openHigh}</td>
                    <td>{item.openMedium}</td>
                    <td>{item.openLow}</td>
                    <td>{item.inProgressHigh}</td>
                    <td>{item.inProgressMedium}</td>
                    <td>{item.inProgressLow}</td>
                    <td>{item.resolvedHigh}</td>
                    <td>{item.resolvedMedium}</td>
                    <td>{item.resolvedLow}</td>
                    <td>{item.closedHigh}</td>
                    <td>{item.closedMedium}</td>
                    <td>{item.closedLow}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditClick(item.projectId)}

                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
};

export default ProjectTicket;
