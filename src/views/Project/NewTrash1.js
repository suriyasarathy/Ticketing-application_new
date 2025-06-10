import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.css';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-fixedcolumns-bs5';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import 'jszip';
import 'pdfmake/build/vfs_fonts';
import TicketDetail from './TicketDetail';
import { useNavigate } from 'react-router-dom';
import { useProject } from "../ContextData";

function Report2({ ProjectIdFrom, onBack }) {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [tickets, setTickets] = useState([]);
  const [selectPriority, setSelectPriority] = useState('');
  const [selectStatus, setSelectStatus] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const { selectedProject } = useProject();
const navigate = useNavigate();


  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchDataTicket = async () => {
      try {
        const response = await fetch(`http://localhost:3000/ProjectTicket?id=${ProjectIdFrom}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTickets(data);
        } else {
          throw new Error('Failed to fetch tickets');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDataTicket();
  }, [ProjectIdFrom, token]);

  useEffect(() => {
    if (tickets.length === 0) return;

    const fetchData = async () => {
      try {
        const ticketDetailsPromises = tickets.map(async (ticket) => {
          const response = await fetch(`http://localhost:3000/tickets?id=${ticket.ticket_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          return response.json();
        });

        const resolvedData = await Promise.all(ticketDetailsPromises);

        const formattedData = resolvedData.flat().map((item) => [
          item.Ticket_id,
          item.Tittle,
          item.description,
          item.priority,
          item.status,
          item.project_name,
          item.created_at ? new Date(item.created_at).toLocaleDateString('en-US') : 'N/A',
          item.Due_date ? new Date(item.Due_date).toLocaleDateString('en-US') : 'N/A',
        ]);

        setTableData(formattedData);
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tickets, token]);
const handleEditPage = (ticketId) => {
navigate(`/TicketEditPage/${ProjectIdFrom}/${ticketId}`);
};

  useEffect(() => {
    if (!loading && tableData.length > 0) {
      $.fn.dataTable.ext.search.push((settings, data) => {
        const priority = data[3];
        const status = data[4];
        const project = data[5];
        return (
          (selectPriority === '' || selectPriority === priority) &&
          (selectStatus === '' || selectStatus === status) &&
          (selectedProjects.length === 0 || selectedProjects.includes(project))
        );
      });

      const datatable = $('#example').DataTable({
        destroy: true,
        data: tableData,
        columns: [
          { title: 'ID' },
          { title: 'Title' },
          { title: 'Description' },
          {
            title: 'Priority',
            render: (data) =>
              `<span class="badge ${
                data === 'high' ? 'bg-danger' : data === 'medium' ? 'bg-warning text-dark' : 'bg-success'
              }">${data}</span>`,
          },
          {
            title: 'Status',
            render: (data) =>
              `<span class="badge ${
                data === 'In open'
                  ? 'bg-info text-dark'
                  : data === 'In progress'
                  ? 'bg-primary'
                  : data === 'resolved'
                  ? 'bg-success'
                  : 'bg-secondary'
              }">${data}</span>`,
          },
          { title: 'Project Name' },
          { title: 'Created At' },
          { title: 'Due Date' },
         {
  title: 'Action',
  orderable: false,
  searchable: false,
  render: (data, type, row) => {
    return `
      <button class="btn btn-sm btn-primary edit-btn" data-id="${row[0]}">
        Edit
      </button>
    `;
  }
}

            
        ],
        dom: 'Bfrtip',
        buttons: ['csv', 'excel', 'pdf'],
        fixedColumns: true,
      });

      $('#example tbody').on('click', '.edit-btn', function (e) {
  e.stopPropagation(); // Prevents opening detail view
  const ticketId = $(this).data('id');
  handleEditPage(ticketId);
});


      datatable.draw();

      return () => {
        $.fn.dataTable.ext.search.pop();
        datatable.destroy();
      };
    }
  }, [tableData, loading, selectPriority, selectStatus, selectedProjects]);

  if (error) return <p>Error: {error}</p>;
  if (loading) return <p>Loading...</p>;

  const projectNames = [...new Set(tableData.map((item) => item[5]))];

  return (
    <>
      {!show ? (
        <div className="container mt-5">
          <button className="btn btn-secondary mb-3" onClick={onBack}>
            ← Back to Project
          </button>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Filter by Priority</label>
              <select
                className="form-select"
                value={selectPriority}
                onChange={(e) => setSelectPriority(e.target.value)}
              >
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Filter by Status</label>
              <select
                className="form-select"
                value={selectStatus}
                onChange={(e) => setSelectStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="In open">Open</option>
                <option value="In progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Filter by Project</label>
              <DropdownButton title="Select Projects" className="w-100" variant="outline-primary">
                {projectNames.map((project) => (
                  <Dropdown.Item key={project} as="div">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project)}
                      onChange={() =>
                        setSelectedProjects((prev) =>
                          prev.includes(project) ? prev.filter((p) => p !== project) : [...prev, project]
                        )
                      }
                    />{' '}
                    {project}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          </div>

          <table id="example" className="table table-striped table-bordered"></table>
        </div>
      ) : (
        <TicketDetail ticket={ticketId} onBack={() => setShow(false)} />
      )}
    </>
  );
}

export default Report2;
