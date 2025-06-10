import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.css';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-fixedcolumns-bs5';
import { Dropdown, Button, DropdownButton } from 'react-bootstrap';
import 'jszip';
import 'pdfmake/build/vfs_fonts';
import { useNavigate } from 'react-router-dom';
import TicketDetail from './Project/TicketDetail';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

function Repoet2() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [ticketId, setTicketId] = useState('');
  
  const [selectPriority, setSelectPriority] = useState('');
  const [selectStatus, setSelectStatus] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const token =localStorage.getItem('authToken')
  let datatable = null; // Initialize the DataTable variable

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/tickets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
          },
        });
        const text = await response.text();
        console.log('Server response:', text); // Log the response

        try {
          const data = JSON.parse(text);
          if (response.ok) {
            const formattedData = data.map((item) => [
              item.Ticket_id,
              item.Tittle,
              item.description,
              item.priority,
              item.status,
              item.project_name,
              item.created_at,
              item.Due_date,
            ]);
            setTableData(formattedData);
          } else {
            throw new Error('Failed to fetch data');
          }
        } catch (jsonError) {
          console.error('Failed to parse JSON:', text);
          throw new Error('Failed to parse JSON');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
   // console.log("its calling")
    if (!loading && tableData.length > 0) {
      $.fn.dataTable.ext.search.push((settings, data) => {
        const priority = data[3];
        const status = data[4];
        const project = data[5];

        if (
          (selectPriority === '' || selectPriority === priority) &&
          (selectStatus === '' || selectStatus === status) &&
          (selectedProjects.length === 0 || selectedProjects.includes(project))
        ) {
          return true;
        }
        return false;
      });

      datatable = $('#example').DataTable({
        destroy: true,
        data: tableData,
        columns: [
          { title: 'ID' },
          { title: 'Title' },
          { title: 'Description' },
          {
            title: 'Priority',
            render: (data) => {
              let style = '';
              if (data === 'high') style = 'badge bg-danger';
              else if (data === 'medium') style = 'badge bg-warning text-dark';
              else if (data === 'low') style = 'badge bg-success';
              return `<span class="${style}">${data}</span>`;
            },
          },
          {
            title: 'Status',
            render: (data) => {
              let style = '';
              if (data === 'In open') style = 'badge bg-info text-dark';
              else if (data === 'In progress') style = 'badge bg-primary';
              else if (data === 'resolved') style = 'badge bg-success';
              else if (data === 'closed') style = 'badge bg-secondary';
              return `<span class="${style}">${data}</span>`;
            },
          },
          { title: 'Project Name' },
          {
            title: 'Created At',
            render: (data) => {
              const date = new Date(data);
              return date.toLocaleDateString();
            },
          },
          {
            title: 'Due Date',
            render: (data) => {
              const date = new Date(data);
              return date.toLocaleDateString();
            },
          },
        ],
        dom: 'Bfrtip',
        buttons: ['csv', 'excel', 'pdf'],
        fixedColumns: true,
      });

      $('#example tbody').on('click', 'tr', function () {
        const rowData = datatable.row(this).data();
        if (rowData) {
          const ticketId = rowData[0];
          setTicketId(ticketId);
          setShow(true);
        }
      });

       datatable.draw();

      return () => {
        $.fn.dataTable.ext.search.pop();
        datatable.destroy();
      };
    }
  }, [tableData, loading, selectPriority, selectStatus, selectedProjects,show]);

  const toggleProjectSelection = (project) => {
    setSelectedProjects((prev) =>
      prev.includes(project)
        ? prev.filter((p) => p !== project)
        : [...prev, project]
    );
  };

  const refreshTable = () => {
   // tableData.clear().rows.add(tableData).draw();
  };

  const handleCallBack=()=>{
    setShow(false)
           // setTicketId('');
        
    
  }
  console.log("check show state",show)
  if (error) return <p>Error: {error}</p>;
  if (loading) return <p>Loading...</p>;

  const projectNames = [...new Set(tableData.map((item) => item[5]))];

  return (
    <>
      {!show ? (
        <div className="container mt-5">
          <div className="row mb-3">
            <div className="col-md-4" style={{ width: '200px' }}>
              <label htmlFor="priorityFilter" className="form-label">
                Filter by Priority
              </label>
              <select
                id="priorityFilter"
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
            <div className="col-md-4" style={{ width: '200px' }}>
              <label htmlFor="statusFilter" className="form-label">
                Filter by Status
              </label>
              <select
                id="statusFilter"
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
              <DropdownButton
                id="dropdown-projects"
                title="Select Projects"
                className="w-100"
                variant="outline-primary"
              >
                {projectNames.map((project) => (
                  <Dropdown.Item key={project} as="div" className="px-3">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={`project-${project}`}
                      value={project}
                      checked={selectedProjects.includes(project)}
                      onChange={() => toggleProjectSelection(project)}
                    />
                    <label htmlFor={`project-${project}`} className="form-check-label">
                      {project}
                    </label>
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          </div>
          <table
            id="example"
            className="table table-striped table-bordered"
            style={{ width: '100%' }}
          ></table>
        </div>
      ) : (
        <TicketDetail
          ticket={ticketId}
          onBack={handleCallBack}
        />
      )}
    </>
  );
}

export default Repoet2;
