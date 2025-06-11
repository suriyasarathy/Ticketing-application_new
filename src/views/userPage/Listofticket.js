import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useProject } from "../ContextData";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomDateRange from "components/DatePicker";
import {useAuth} from "../ContextData"

function ProjectTickets() {
  const { projectID } = useParams();
  const { selectedProject } = useProject();
  const [userID, setUserID] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();
useEffect(() => {
  if (user?.userId) {
    setUserID(user.userId);
  }
}, [user]);  
const token = localStorage.getItem("authToken");
  const [project_ID, setProject_ID] = useState(null);
  console.log(projectID);

const formattedDate = (date) => {
  if (!date) return "N/A"; // Handle missing date
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? "Invalid Date" : format(parsedDate, "yyyy-MM-dd");
};


 useEffect(() => {
  if (selectedProject) {
    setProject_ID(selectedProject);
  }
}, [selectedProject]);

  
  console.log("Project_ID:", projectID); // Check if it's getting updated

  

  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const [status ,setstatus] =useState("")


  useEffect(() => {
    fetchTickets();
  }, [projectID, userID]);

//   const fetchProjectSettings = async () => {
//   try {
//     const response = await fetch(`http://localhost:3000/project/settings/${projectID}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
        
//       },
//     });

//     if (!response.ok) throw new Error("Failed to fetch project settings");
//     const data = await response.json();
//     setProjectSettings(data); // Save project settings (contains status list)
//   } catch (err) {
//     console.error("Error fetching project settings:", err);
//   }
// };


// useEffect(() => {
//   fetchProjectSettings();
// }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`http://localhost:3000/project/${projectID}/user/${userID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTicketData(data.tickets);
      } else {
        throw new Error("Failed to fetch tickets");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const safeFormat = (date, formatStr = "MM-dd-yyyy") => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? "N/A" : format(parsed, formatStr);
};

//
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!ticketData) return <p>No ticket data available.</p>;

  return (
    <div className="container mt-4">
      <h3>Tickets</h3>
      <div className="d-flex justify-content-end mb-3">
  <button className="btn btn-primary" onClick={() => navigate(`/UserCreateTicket/${projectID}`)}>
    + New Ticket
  </button>
</div>
      <div className="col-12 mb-4">
  <div className="card p-3  shadow-lg rounded-3">
    <h3 className="mb-3">Project Details</h3>
    <div className="row">
      <div className="col-md-6">
        <p><span className="fw-bold">Project ID:</span> {selectedProject?.project_id}</p>
        <p><span className="fw-bold">Project Name:</span> {selectedProject?.name}</p>
        <p><span className="fw-bold">Manger:</span> {selectedProject?.manager_name}</p>
      </div>
      <div className="col-md-6">
      <p><span className="fw-bold">Start Date:</span> {safeFormat(selectedProject?.created_at, "MM-dd-yyyy HH:mm a")}</p>

      <p><span className="fw-bold">End Date:</span> {safeFormat(selectedProject?.due_date, "MM-dd-yyyy")}</p>

      </div>
    </div>
  </div>
</div>


      <TicketTable title="My Tickets" tickets={ticketData.assignedToUser || []} setTicketData={setTicketData} project_ID={project_ID} currentUser  ={userID}/>
      <TicketTable title="Tickets Assigned to Others" tickets={ticketData.assignedToOthers || []}project_ID={project_ID}   setTicketData={setTicketData} // ✅ Ensure this is passed
  currentUser  ={userID} />
      <TicketTable title="Unassigned Tickets" tickets={ticketData.unassigned || []}  setTicketData={setTicketData} // ✅ Ensure this is passed
 project_ID={project_ID} currentUser  ={userID}/>
    </div>
  );
}

const TicketTable = ({ title, tickets, setTicketData,project_ID,currentUser }) => {
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); 
  const [createdDateRange, setCreatedDateRange] = useState(null);
  const [dueDateRange, setDueDateRange] = useState(null);
  const [projectSettings, setProjectSettings] = useState(null);
  const { selectedProject } = useProject();
  const [allowreassginticket,setallowreassginticket] =useState()
  const [projectUsers, setProjectUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
const [isStatusUpdated, setIsStatusUpdated] = useState(false);
const [statuses, setStatuses] = useState([]);
const [priorities, setPriorities] = useState([]);
const defaultStatuses = ["Open", "In Progress", "Closed"];
const defaultPriorities = ["High", "Medium", "Low"];

  console.log("currentUser",currentUser);
  
console.log("allow ",allowreassginticket);

  console.log("insidede",project_ID);
  const fetchProjectUsers = async (project_ID) => {
    console.log("Fetching project users for project_ID:", project_ID);
    
    try {
        const response = await fetch(`http://localhost:3000/Ticket/user/${project_ID.project_id}`);
        if (!response.ok) throw new Error("Failed to fetch project users");

        const users = await response.json();
        console.log("Fetched project users:", users);
        
        setProjectUsers(users);
    } catch (err) {
        console.error("Error fetching project users:", err);
    }
};

// Fetch users when project_ID changes
useEffect(() => {
    if (project_ID) fetchProjectUsers(project_ID);
}, [project_ID]);
  useEffect(() => {
    console.log("selectedProject:", selectedProject);
    console.log("selectedProject.project_id:", selectedProject?.project_id);
    console.log("project_ID inside useEffect:", project_ID);
  }, [selectedProject, project_ID]);
  
  const fetchProjectSettings = async (project_ID, setProjectSettings) => {
    console.log("Fetching project settings for project_ID:", project_ID);
    
    try {
      const response = await fetch(`http://localhost:3000/project/settings/${project_ID.project_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) throw new Error("Failed to fetch project settings");
  
      const data = await response.json();
      const allowReasgin =data.allow_ticket_reassign
      setallowreassginticket(allowReasgin)
      setProjectSettings(data);
    } catch (err) {
      console.error("Error fetching project settings:", err);
    }
  };
        

  
  // Inside ProjectTickets component
  useEffect(() => {
    if (project_ID) {
      fetchProjectSettings(project_ID, setProjectSettings);
    }
  }, [project_ID]);
  console.log("Project_ID received in TicketTable:", project_ID);
  
  
  const handleStatusChange = async (ticketId, newStatus) => {
    setIsLoading(true);
  
    try {
      const response = await fetch("http://localhost:3000/update-ticket-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketId, status: newStatus, changeBy: currentUser }),
      });
  
      if (!response.ok) throw new Error("Failed to update status");
  
      const updatedTicket = await response.json(); // Assuming backend sends updated ticket
  
      // Update the ticket in frontend state
      setTicketData((prevData) => {
        if (!prevData) return prevData;
  
        const updateTickets = (list) =>
          list.map((ticket) =>
            ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
          );
  
        return {
          ...prevData,
          assignedToUser: updateTickets(prevData.assignedToUser || []),
          assignedToOthers: updateTickets(prevData.assignedToOthers || []),
          unassigned: updateTickets(prevData.unassigned || []),
        };
      });
  
      setTimeout(() => {
        setIsStatusUpdated(true);
        setIsLoading(false);
        setTimeout(() => setIsStatusUpdated(false), 2000);
      }, 2000);
    } catch (err) {
      console.error("Error updating ticket status:", err);
      setIsLoading(false);
    }
  };
  
  
  // const filteredTickets = tickets.filter((ticket) => {
  //   const matchesPriority = priorityFilter ? ticket.priority === priorityFilter : true;
  //   const matchesStatus = statusFilter ? ticket.status === statusFilter : true;

  //   const ticketCreatedDate = new Date(ticket.ticket_created_date);
  //   const ticketDueDate = new Date(ticket.due_date);

  //   const matchesCreatedDate = createdDateRange
  //     ? ticketCreatedDate >= new Date(createdDateRange.startDate) &&
  //       ticketCreatedDate <= new Date(createdDateRange.endDate)
  //     : true;

  //   const matchesDueDate = dueDateRange
  //     ? ticketDueDate >= new Date(dueDateRange.startDate) &&
  //       ticketDueDate <= new Date(dueDateRange.endDate)
  //     : true;

  //   return matchesPriority && matchesStatus && matchesCreatedDate && matchesDueDate;
  
  // });
  const filteredTickets = (tickets || []).filter((ticket) => {
    if (!ticket) return false; // Ensure ticket is not undefined/null
    console.log("ticket_created_date:", ticket.ticket_created_date);
    console.log("due_date:", ticket.due_date);
    const matchesPriority = priorityFilter ? ticket.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
  
    const ticketCreatedDate = new Date(ticket.ticket_created_date);
    const ticketDueDate = new Date(ticket.due_date);
  
    const matchesCreatedDate = createdDateRange
      ? ticketCreatedDate >= new Date(createdDateRange.startDate) &&
        ticketCreatedDate <= new Date(createdDateRange.endDate)
      : true;
  
    const matchesDueDate = dueDateRange
      ? ticketDueDate >= new Date(dueDateRange.startDate) &&
        ticketDueDate <= new Date(dueDateRange.endDate)
      : true;
  
    return matchesPriority && matchesStatus && matchesCreatedDate && matchesDueDate;
  });
  
  const assignTicketToMe = async (ticketId, userId) => {
    console.log(ticketId,userId)
    try {
        const response = await fetch(`http://localhost:3000/assginmy`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticketId, userId })
        });

        if (!response.ok) {
            throw new Error("Failed to assign ticket");
        }

        const updatedTicket = await response.json();

        // Update frontend state (assuming state structure has 'unassigned' and 'assignedToUser' lists)
        setTicketData((prevData) => {
            const updatedUnassigned = prevData.unassigned.filter(ticket => ticket.ticket_id !== ticketId);
            return {
                ...prevData,
                assignedToUser: [...prevData.assignedToUser, updatedTicket],
                unassigned: updatedUnassigned,
            };
        });

        console.log("Ticket successfully assigned to you:", updatedTicket);
    } catch (error) {
        console.error("Error assigning ticket:", error);
    }
};

const handleReassignTicket = async (ticketId, userId) => {
  console.log("Reassigning Ticket:", ticketId, "to User:", userId , "by:", currentUser);

  try {
    const response = await fetch(`http://localhost:3000/Reassign/${ticketId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, projectId: project_ID, changeBy:currentUser }),
    });

    if (!response.ok) throw new Error("Failed to reassign ticket");

    // Get updated ticket details from response
    const updatedTicket = await response.json();
    console.log("duedate",updatedTicket.dueDate); // Check for invalid dates


    setTicketData((prevData) => {
      if (!prevData) return prevData;

      // Find the ticket and update its assigned user
      const updatedAssigned = prevData.assignedToUser.map((ticket) =>
        ticket.ticket_id === ticketId ? { ...ticket, assigned_to: userId } : ticket
      );

      // If the ticket was in 'unassigned', move it to assignedToUser
      const reassignedTicket = prevData.unassigned.find((ticket) => ticket.ticket_id === ticketId);
      const updatedUnassigned = prevData.unassigned.filter((ticket) => ticket.ticket_id !== ticketId);

      return {
        ...prevData,
        assignedToUser: reassignedTicket
          ? [...updatedAssigned, { ...reassignedTicket, assigned_to: userId }]
          : updatedAssigned,
        unassigned: updatedUnassigned,
      };
    });

    console.log("Ticket reassigned successfully:", updatedTicket);
  } catch (err) {
    console.error("Error reassigning ticket:", err);
  }
};




  return (
    <>  <div className="row">
    <div className="col-12 mb-4">
    <div className="card p-3 shadow-lg rounded-3  bg-light ">
      <h4>{title}</h4>
      <table className="table table-striped">
      <thead>
  <tr>
    <th className="text-center">TICKET #</th>
    <th className="text-center">TITLE</th>
    <th className="text-center">
      <div className="d-flex flex-column align-items-center">
        PRIORITY
        <select className="form-select mt-1" style={{ width: "120px" }} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </th>
    <th className="text-center">
      <div className="d-flex flex-column align-items-center">
        TICKET CREATED
        <CustomDateRange className="mt-1" onFilterChange={setCreatedDateRange} style={{ width: "200px" }} />
      </div>
    </th>
    <th className="text-center">
      <div className="d-flex flex-column align-items-center">
        DUE DATE
        <CustomDateRange className="mt-1" onFilterChange={setDueDateRange} style={{ width: "200px" }} />
      </div>
    </th>
    <th className="text-center">
      <div className="d-flex flex-column align-items-center">
        STATUS
        <select className="form-select mt-1" style={{ width: "120px" }} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="In open">Open</option>
          <option value="In progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </th>
    <th className="text-center"># DATES</th>
    {title==="My Tickets" ?<th className="tect-cend">Reassgin</th>:""}
   { title==="Unassigned Tickets" ?<th className="tect-center">assgin </th>:""}

  </tr>
</thead>



            
        <tbody>
          {filteredTickets.map((ticket) => (
            <tr key={ticket.ticket_id}>
              <td>
                <Link 
  to={{
    pathname: `/ticketDetail/${ticket.ticket_id}`,
    state: { projectId: project_ID }
  }} 
  className="text-decoration-none"
>
  {ticket.ticket_id}
</Link>

              </td>
              <td>{ticket.Tittle}</td>
              <td>
                <span className={`badge bg-${getPriorityClass(ticket.priority)}`}>{ticket.priority}</span>
              </td>
             
              <td>{format(new Date(ticket.ticket_created_date), "MM-dd-yyyy")}</td>
              <td>
  {ticket.due_date ? format(new Date(ticket.due_date), "MM-dd-yyyy") : "No due date"}
</td>
               {title === "My Tickets"?
//               <td>
//                  <select
//     className="form-select"
//     value={ticket.status}
//     onChange={(e) => handleStatusChange(ticket.ticket_id, e.target.value)}
//   >
//     <option value="Open">Open</option>
//     <option value="In Progress">In Progress</option>
//     <option value="Resolved">Resolved</option>
//     <option value="Closed">Closed</option>
//   </select>
//   {/* <select
//     className="form-select"
//     value={tickets.status}
//     onChange={(e) => handleStatusChange(tickets.ticket_id, e.target.value)}
//   >
//     {projectSettings?.custom_statuses.map((statusOption) => (
//       <option key={statusOption} value={statusOption}>
//         {statusOption}
//       </option> */}
//     {/* ))}
//   </select> */}
// </td>

<td>
  <select
    className="form-select"
    value={ticket.status}
    
    onChange={(e) => handleStatusChange(ticket.ticket_id, e.target.value)}
  >
    {projectSettings &&
      (() => {
        let statuses = projectSettings.default_status || []; // Ensure it's an array

        // Include custom statuses if enabled
        if (projectSettings.enable_custom_statuses && Array.isArray(projectSettings.custom_statuses)) {
          statuses = [...statuses, ...projectSettings.custom_statuses];
        }

        // Remove duplicates using Set
        const uniqueStatuses = [...new Set(statuses)];
        {console.log("Ticket status:", ticket.status, "Available statuses:", uniqueStatuses)}

        return uniqueStatuses.length > 0 ? (
          uniqueStatuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))
        ) : (
          <option value="">No statuses available</option>
        );
      })()}
  </select>
</td>


: <td>
                <span className={`badge bg-${getStatusClass(ticket.status)}`}>{ticket.status}</span>
              </td>}
              
              <td>{ticket.days}</td>
              {title === "Unassigned Tickets"?<td>
  
                <select
  className="form-select"
  onChange={(e) => assignTicketToMe(ticket.ticket_id, e.target.value)}
>
  <option value="">all</option>
  {projectUsers.map((user) => (
    <option key={user.user_id} value={user.user_id}>
      {user.name}
    </option>
  ))}
</select>
 
</td>:""}
{title === "My Tickets"?<td>
  {allowreassginticket && (
    <select
      className="form-select"
      onChange={(e) => handleReassignTicket(ticket.ticket_id, e.target.value)}
    >
      <option value="">all</option>
      {projectUsers.map((user) => (
        <option key={user.user_id} value={user.user_id}>
          {user.name}
        </option>
      ))}
    </select>
  )}
</td>:""}

            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
      </div>
    </>
  );
};

const getPriorityClass = (priority) => (priority === "high" ? "danger" : priority === "medium" ? "warning" : "success");
const getStatusClass = (status) => (status === "open" ? "info" : status === "in-progress" ? "primary" : status === "resolved" ? "success" : "dark");

export default ProjectTickets;
