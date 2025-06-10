

// import React, { useState, useEffect } from 'react';
// import $ from 'jquery';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'datatables.net-bs5/css/dataTables.bootstrap5.css';
// import 'datatables.net-bs5';
// import 'datatables.net-buttons-bs5';
// import 'datatables.net-buttons/js/buttons.html5.js';
// import 'datatables.net-buttons/js/buttons.print.js';
// import 'datatables.net-fixedcolumns-bs5';
// import { Dropdown, Button, DropdownButton } from 'react-bootstrap';
// import 'jszip';
// import 'pdfmake/build/vfs_fonts';
// import { useNavigate } from 'react-router-dom';
// import TicketDetail from './TicketDetail';


// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// // pdfMake.vfs = pdfFonts.pdfMake.vfs;

// function Repoet2() {
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [show,setshow] =useState(false);
//   const [ticketId,setTicketId] =useState('');


//   const [selectPriority, setSelectPriority] = useState('');
//   const [selectStatus, setSelectStatus] = useState('');
//   const [selectedProjects, setSelectedProjects] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/tickets');
//         const text = await response.text();

//         console.log('Server response:', text); // Log the response

//         try {
//           const data = JSON.parse(text);

//           if (response.ok) {
//             const formattedData = data.map((item) => [
//               item.Ticket_id,
//               item.Tittle,
//               item.description,
//               item.priority,
//               item.status,
//               item.project_name,
//               item.created_at	,
//               item.Due_date,
//             ]);
//             setTableData(formattedData);
//           } else {
//             throw new Error('Failed to fetch data');
//           }
//         } catch (jsonError) {
//           console.error('Failed to parse JSON:', text);
//           throw new Error('Failed to parse JSON');
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!loading && tableData.length > 0) {
//       $.fn.dataTable.ext.search.push((settings, data) => {
//         const priority = data[3];
//         const status = data[4];
//         const project = data[5];

//         if (
//           (selectPriority === '' || selectPriority === priority) &&
//           (selectStatus === '' || selectStatus === status) &&
//           (selectedProjects.length === 0 || selectedProjects.includes(project))
//         ) {
//           return true;
//         }
//         return false;
//       });

//       const datatable = $('#example').DataTable({
//         destroy: true,
//         data: tableData,
//         columns: [
//           { title: 'ID' },
//           { title: 'Title' },
//           { title: 'Description' },
//           { 
//             title: 'Priority', 
//             render: (data) => {
//               let style = '';
//               if (data === 'high') style = 'badge bg-danger';
//               else if (data === 'medium') style = 'badge bg-warning text-dark';
//               else if (data === 'low') style = 'badge bg-success';
//               return `<span class="${style}">${data}</span>`;
//             }
//           },
//           { 
//             title: 'Status', 
//             render: (data) => {
//               let style = '';
//               if (data === 'In open') style = 'badge bg-info text-dark';
//               else if (data === 'In progress') style = 'badge bg-primary';
//               else if (data === 'resolved') style = 'badge bg-success';
//               else if (data === 'closed') style = 'badge bg-secondary';
//               return `<span class="${style}">${data}</span>`;
//             }
//           },
//           { title: 'Project Name',
          
//           },
//           { title: 'created at',
//             render :(data)=>{
//               const date = new Date(data);
//               return date.toLocaleDateString();   
//             }
//           },
//           { title: 'Due data' ,
//             render :(data)=>{
//               const date = new Date(data);
//               return date.toLocaleDateString();   
//             } 
//           },
//         ],
//         dom: 'Bfrtip',
//         buttons: [
//           'csv',
//           'excel',
//           'pdf',
//         ],
//         fixedColumns: true,
//       });

//       $('#example tbody').on('click', 'tr', function () {
//         const rowData = datatable.row(this).data();
//         if (rowData) {
//           const ticketId = rowData[0]; // Assuming ticket ID is the first column
//          // navigate(`/admin/TicketDetail?id=${ticketId}`);
//          setTicketId(ticketId);
//          setshow(true);
//         }
//       });
      

//       datatable.draw();

//       return () => {
//         $.fn.dataTable.ext.search.pop();
//         datatable.destroy();
//       };
//     }
//   }, [tableData, loading, selectPriority, selectStatus, selectedProjects]);

//   const toggleProjectSelection = (project) => {
//     setSelectedProjects((prev) =>
//       prev.includes(project)
//         ? prev.filter((p) => p !== project)
//         : [...prev, project]
//     );
//   };

//   if (error) return <p>Error: {error}</p>;
//   if (loading) return <p>Loading...</p>;

//   const projectNames = [...new Set(tableData.map((item) => item[5]))];

//   return (
//     <>
//     {!show ? (
     
//       <div className="container mt-5">
//       <div className="row mb-3">
//         <div className="col-md-4" style={{ width: '200px' }}>
//           <label htmlFor="priorityFilter" className="form-label">
//             Filter by Priority
//           </label>
//           <select
//             id="priorityFilter"
//             className="form-select"
//             value={selectPriority}
//             onChange={(e) => setSelectPriority(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//         </div>
//         <div className="col-md-4" style={{ width: '200px' }}>
//           <label htmlFor="statusFilter" className="form-label">
//             Filter by Status
//           </label>
//           <select
//             id="statusFilter"
//             className="form-select"
//             value={selectStatus}
//             onChange={(e) => setSelectStatus(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="In open">Open</option>
//             <option value="In progress">In Progress</option>
//             <option value="resolved">Resolved</option>
//             <option value="closed">Closed</option>
//           </select>
//         </div>
//         <div className="col-md-4">
//           <label className="form-label">Filter by Project</label>
//           <DropdownButton
//             id="dropdown-projects"
//             title="Select Projects"
//             className="w-100"
//             variant="outline-primary"
//           >
//             {projectNames.map((project) => (
//               <Dropdown.Item key={project} as="div" className="px-3">
//                 <input
//                   type="checkbox"
//                   className="form-check-input me-2"
//                   id={`project-${project}`}
//                   value={project}
//                   checked={selectedProjects.includes(project)}
//                   onChange={() => toggleProjectSelection(project)}
//                 />
//                 <label htmlFor={`project-${project}`} className="form-check-label">
//                   {project}
//                 </label>
//               </Dropdown.Item>
//             ))}
//           </DropdownButton>
//         </div>
//       </div>
//       <table
//         id="example"
//         className="table table-striped table-bordered"
//         style={{ width: '100%' }}
//       ></table>
//       </div>
      

//     ) : (

// <TicketDetail ticket={ticketId}/>
        
      
//     )}  
      
//       </>
//   );
// }
// import React,{useEffect,useState} from "react";


// // react-bootstrap components
// import {
//   Badge,
//   Button,
//   Card,
//   Navbar,
//   Nav,
//   Table,
//   Container,
//   Row,
//   Col,
//   Form,
//   OverlayTrigger,
//   Tooltip,
// } from "react-bootstrap";

// function Dashboard() {
//   const [chartData, setChartData] = useState({});

 

//   useEffect(() => {
//     const fetchPieChartData = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/piechart', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
//         },
//       });
//         if (!response.ok) {
//           throw new Error('Failed to fetch pie chart data');
//         }
//         const data = await response.json();
//        // console.table(data)
//         const labelsArr=[];
//         const seriesArr=[];
//         data.forEach(element => {
//           console.log(element.status);
//           labelsArr.push(element.status);
//           seriesArr.push(element.percentage);
//         });
//         setChartData({
//           label:labelsArr,
//           series:seriesArr
//         })
        
//        // setPieChartData(data)
//       } catch (err) {
//         console.error(err.message)
//         //setError(err.message);
//       }
//     };

//     fetchPieChartData();
//   }, []);
//   console.log("datas",chartData)
  
//   return (
//     <>
//       <Container fluid>
//         <Row>
//           <Col lg="3" sm="6">
//             <Card className="card-stats">
//               <Card.Body>
//                 <Row>
//                   <Col xs="5">
//                     <div className="icon-big text-center icon-warning">
//                       <i className="nc-icon nc-chart text-warning"></i>
//                     </div>
//                   </Col>
//                   <Col xs="7">
//                     <div className="numbers">
//                       <p className="card-category">Number</p>
//                       <Card.Title as="h4">150GB</Card.Title>
//                     </div>
//                   </Col>
//                 </Row>
//               </Card.Body>
//               <Card.Footer>
//                 <hr></hr>
//                 <div className="stats">
//                   <i className="fas fa-redo mr-1"></i>
//                   Update Now
//                 </div>
//               </Card.Footer>
//             </Card>
//           </Col>
//           <Col lg="3" sm="6">
//             <Card className="card-stats">
//               <Card.Body>
//                 <Row>
//                   <Col xs="5">
//                     <div className="icon-big text-center icon-warning">
//                       <i className="nc-icon nc-light-3 text-success"></i>
//                     </div>
//                   </Col>
//                   <Col xs="7">
//                     <div className="numbers">
//                       <p className="card-category">Revenue</p>
//                       <Card.Title as="h4">$ 1,345</Card.Title>
//                     </div>
//                   </Col>
//                 </Row>
//               </Card.Body>
//               <Card.Footer>
//                 <hr></hr>
//                 <div className="stats">
//                   <i className="far fa-calendar-alt mr-1"></i>
//                   Last day
//                 </div>
//               </Card.Footer>
//             </Card>
//           </Col>
//           <Col lg="3" sm="6">
//             <Card className="card-stats">
//               <Card.Body>
//                 <Row>
//                   <Col xs="5">
//                     <div className="icon-big text-center icon-warning">
//                       <i className="nc-icon nc-vector text-danger"></i>
//                     </div>
//                   </Col>
//                   <Col xs="7">
//                     <div className="numbers">
//                       <p className="card-category">Errors</p>
//                       <Card.Title as="h4">23</Card.Title>
//                     </div>
//                   </Col>
//                 </Row>
//               </Card.Body>
//               <Card.Footer>
//                 <hr></hr>
//                 <div className="stats">
//                   <i className="far fa-clock-o mr-1"></i>
//                   In the last hour
//                 </div>
//               </Card.Footer>
//             </Card>
//           </Col>
//           <Col lg="3" sm="6">
//             <Card className="card-stats">
//               <Card.Body>
//                 <Row>
//                   <Col xs="5">
//                     <div className="icon-big text-center icon-warning">
//                       <i className="nc-icon nc-favourite-28 text-primary"></i>
//                     </div>
//                   </Col>
//                   <Col xs="7">
//                     <div className="numbers">
//                       <p className="card-category">Followers</p>
//                       <Card.Title as="h4">+45K</Card.Title>
//                     </div>
//                   </Col>
//                 </Row>
//               </Card.Body>
//               <Card.Footer>
//                 <hr></hr>
//                 <div className="stats">
//                   <i className="fas fa-redo mr-1"></i>
//                   Update now
//                 </div>
//               </Card.Footer>
//             </Card>
//           </Col>
//         </Row>
//         <Row>
//           <Col md="8">
//             <Card>
//               <Card.Header>
//                 <Card.Title as="h4">Users Behavior</Card.Title>
//                 <p className="card-category">24 Hours performance</p>
//               </Card.Header>
//               <Card.Body>
//                 <div className="ct-chart" id="chartHours">
//                   <ChartistGraph
//                     data={{
//                       labels: [
//                         "9:00AM",
//                         "12:00AM",
//                         "3:00PM",
//                         "6:00PM",
//                         "9:00PM",
//                         "12:00PM",
//                         "3:00AM",
//                         "6:00AM",
//                       ],
//                       series: [
//                         [287, 385, 490, 492, 554, 586, 698, 695],
//                         [67, 152, 143, 240, 287, 335, 435, 437],
//                         [23, 113, 67, 108, 190, 239, 307, 308],
//                       ],
//                     }}
//                     type="Line"
//                     options={{
//                       low: 0,
//                       high: 800,
//                       showArea: false,
//                       height: "245px",
//                       axisX: {
//                         showGrid: false,
//                       },
//                       lineSmooth: true,
//                       showLine: true,
//                       showPoint: true,
//                       fullWidth: true,
//                       chartPadding: {
//                         right: 50,
//                       },
//                     }}
//                     responsiveOptions={[
//                       [
//                         "screen and (max-width: 640px)",
//                         {
//                           axisX: {
//                             labelInterpolationFnc: function (value) {
//                               return value[0];
//                             },
//                           },
//                         },
//                       ],
//                     ]}
//                   />
//                 </div>
//               </Card.Body>
//               <Card.Footer>
//                 <div className="legend">
//                   <i className="fas fa-circle text-info"></i>
//                   Open <i className="fas fa-circle text-danger"></i>
//                   Click <i className="fas fa-circle text-warning"></i>
//                   Click Second Time
//                 </div>
//                 <hr></hr>
//                 <div className="stats">
//                   <i className="fas fa-history"></i>
//                   Updated 3 minutes ago
//                 </div>
//               </Card.Footer>
//             </Card>
//           </Col>

//           {/* piechart */}
//           <Col md="4">
//       <Card>
//         <Card.Header>
//           <Card.Title as="h4">Ticket Statistics</Card.Title>
//           <p className="card-category">Last Campaign Performance</p>
//         </Card.Header>
//         <Card.Body>
//           <div className="ct-chart ct-perfect-fourth" id="chartPreferences">
//             <ChartistGraph data={chartData} type="Pie" />
//           </div>
//           <div className="legend">
//             {/* {chartData.labels.map((label, index) => (
//               <span key={index}>
//                 <i
//                   className={`fas fa-circle text-${index === 0 ? "info" : index === 1 ? "danger" : "warning"}`}
//                 ></i>{" "}
//                 {label}{" "}
//               </span>
//             ))} */}
//           </div>
//           <hr />
//           <div className="stats">
//             <i className="far fa-clock"></i> Campaign sent 2 days ago
//           </div>
//         </Card.Body>
//       </Card>
//     </Col>
//         </Row>
//         <Row>
//           <Col md="6">
//             <Card>
//               <Card.Header>
//                 <Card.Title as="h4">2017 Sales</Card.Title>
//                 <p className="card-category">All products including Taxes</p>
//               </Card.Header>
//               <Card.Body>
//                 <div className="ct-chart" id="chartActivity">
//                   <ChartistGraph
//                     data={{
//                       labels: [
//                         "Jan",
//                         "Feb",
//                         "Mar",
//                         "Apr",
//                         "Mai",
//                         "Jun",
//                         "Jul",
//                         "Aug",
//                         "Sep",
//                         "Oct",
//                         "Nov",
//                         "Dec",
//                       ],
//                       series: [
//                         [
//                           542,
//                           443,
//                           320,
//                           780,
//                           553,
//                           453,
//                           326,
//                           434,
//                           568,
//                           610,
//                           756,
//                           895,
//                         ],
//                         [
//                           412,
//                           243,
//                           280,
//                           580,
//                           453,
//                           353,
//                           300,
//                           364,
//                           368,
//                           410,
//                           636,
//                           695,
//                         ],
//                       ],
//                     }}
//                     type="Bar"
//                     options={{
//                       seriesBarDistance: 10,
//                       axisX: {
//                         showGrid: false,
//                       },
//                       height: "245px",
//                     }}
//                     responsiveOptions={[
//                       [
//                         "screen and (max-width: 640px)",
//                         {
//                           seriesBarDistance: 5,
//                           axisX: {
//                             labelInterpolationFnc: function (value) {
//                               return value[0];
//                             },
//                           },
//                         },
//                       ],
//                     ]}
//                   />
//                 </div>
//               </Card.Body>
//               <Card.Footer>
//                 <div className="legend">
//                   <i className="fas fa-circle text-info"></i>
//                   Tesla Model S <i className="fas fa-circle text-danger"></i>
//                   BMW 5 Series
//                 </div>
//                 <hr></hr>
//                 <div className="stats">
//                   <i className="fas fa-check"></i>
//                   Data information certified
//                 </div>
//               </Card.Footer>
//             </Card>
//           </Col>
//           <Col md="6">
//             <Card className="card-tasks">
//               <Card.Header>
//                 <Card.Title as="h4">Tasks</Card.Title>
//                 <p className="card-category">Backend development</p>
//               </Card.Header>
//               <Card.Body>
//                 <div className="table-full-width">
//                   <Table>
//                     <tbody>
//                       <tr>
//                         <td>
//                           <Form.Check className="mb-1 pl-0">
//                             <Form.Check.Label>
//                               <Form.Check.Input
//                                 defaultValue=""
//                                 type="checkbox"
//                               ></Form.Check.Input>
//                               <span className="form-check-sign"></span>
//                             </Form.Check.Label>
//                           </Form.Check>
//                         </td>
//                         <td>
//                           Sign contract for "What are conference organizers
//                           afraid of?"
//                         </td>
//                         <td className="td-actions text-right">
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-488980961">
//                                 Edit Task..
//                               </Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="info"
//                             >
//                               <i className="fas fa-edit"></i>
//                             </Button>
//                           </OverlayTrigger>
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-506045838">Remove..</Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="danger"
//                             >
//                               <i className="fas fa-times"></i>
//                             </Button>
//                           </OverlayTrigger>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <Form.Check className="mb-1 pl-0">
//                             <Form.Check.Label>
//                               <Form.Check.Input
//                                 defaultChecked
//                                 defaultValue=""
//                                 type="checkbox"
//                               ></Form.Check.Input>
//                               <span className="form-check-sign"></span>
//                             </Form.Check.Label>
//                           </Form.Check>
//                         </td>
//                         <td>
//                           Lines From Great Russian Literature? Or E-mails From
//                           My Boss?
//                         </td>
//                         <td className="td-actions text-right">
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-537440761">
//                                 Edit Task..
//                               </Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="info"
//                             >
//                               <i className="fas fa-edit"></i>
//                             </Button>
//                           </OverlayTrigger>
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-21130535">Remove..</Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="danger"
//                             >
//                               <i className="fas fa-times"></i>
//                             </Button>
//                           </OverlayTrigger>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <Form.Check className="mb-1 pl-0">
//                             <Form.Check.Label>
//                               <Form.Check.Input
//                                 defaultChecked
//                                 defaultValue=""
//                                 type="checkbox"
//                               ></Form.Check.Input>
//                               <span className="form-check-sign"></span>
//                             </Form.Check.Label>
//                           </Form.Check>
//                         </td>
//                         <td>
//                           Flooded: One year later, assessing what was lost and
//                           what was found when a ravaging rain swept through
//                           metro Detroit
//                         </td>
//                         <td className="td-actions text-right">
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-577232198">
//                                 Edit Task..
//                               </Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="info"
//                             >
//                               <i className="fas fa-edit"></i>
//                             </Button>
//                           </OverlayTrigger>
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-773861645">Remove..</Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="danger"
//                             >
//                               <i className="fas fa-times"></i>
//                             </Button>
//                           </OverlayTrigger>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <Form.Check className="mb-1 pl-0">
//                             <Form.Check.Label>
//                               <Form.Check.Input
//                                 defaultChecked
//                                 type="checkbox"
//                               ></Form.Check.Input>
//                               <span className="form-check-sign"></span>
//                             </Form.Check.Label>
//                           </Form.Check>
//                         </td>
//                         <td>
//                           Create 4 Invisible User Experiences you Never Knew
//                           About
//                         </td>
//                         <td className="td-actions text-right">
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-422471719">
//                                 Edit Task..
//                               </Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="info"
//                             >
//                               <i className="fas fa-edit"></i>
//                             </Button>
//                           </OverlayTrigger>
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-829164576">Remove..</Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="danger"
//                             >
//                               <i className="fas fa-times"></i>
//                             </Button>
//                           </OverlayTrigger>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <Form.Check className="mb-1 pl-0">
//                             <Form.Check.Label>
//                               <Form.Check.Input
//                                 defaultValue=""
//                                 type="checkbox"
//                               ></Form.Check.Input>
//                               <span className="form-check-sign"></span>
//                             </Form.Check.Label>
//                           </Form.Check>
//                         </td>
//                         <td>Read "Following makes Medium better"</td>
//                         <td className="td-actions text-right">
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-160575228">
//                                 Edit Task..
//                               </Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="info"
//                             >
//                               <i className="fas fa-edit"></i>
//                             </Button>
//                           </OverlayTrigger>
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-922981635">Remove..</Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="danger"
//                             >
//                               <i className="fas fa-times"></i>
//                             </Button>
//                           </OverlayTrigger>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <Form.Check className="mb-1 pl-0">
//                             <Form.Check.Label>
//                               <Form.Check.Input
//                                 defaultValue=""
//                                 disabled
//                                 type="checkbox"
//                               ></Form.Check.Input>
//                               <span className="form-check-sign"></span>
//                             </Form.Check.Label>
//                           </Form.Check>
//                         </td>
//                         <td>Unfollow 5 enemies from twitter</td>
//                         <td className="td-actions text-right">
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-938342127">
//                                 Edit Task..
//                               </Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="info"
//                             >
//                               <i className="fas fa-edit"></i>
//                             </Button>
//                           </OverlayTrigger>
//                           <OverlayTrigger
//                             overlay={
//                               <Tooltip id="tooltip-119603706">Remove..</Tooltip>
//                             }
//                           >
//                             <Button
//                               className="btn-simple btn-link p-1"
//                               type="button"
//                               variant="danger"
//                             >
//                               <i className="fas fa-times"></i>
//                             </Button>
//                           </OverlayTrigger>
//                         </td>
//                       </tr>
//                     </tbody>
//                   </Table>
//                 </div>
//               </Card.Body>
//               <Card.Footer>
//                 <hr></hr>
//                 <div className="stats">
//                   <i className="now-ui-icons loader_refresh spin"></i>
//                   Updated 3 minutes ago
//                 </div>
//               </Card.Footer>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// }

// export default Dashboard;


// export default Repoet2;
import React, { useState, useEffect } from 'react';

const TicketDetail = (props) => {
  const [tickets, setTickets] = useState([]); // To store the list of tickets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedTickets, setDetailedTickets] = useState([]); // Store the detailed tickets
  const ProjectId = props.ProjectIdFrom;
  const token =localStorage.getItem('authToken')
  useEffect(() => {
    const fetchDataTicket = async () => {
      try {
        // Fetch Project Tickets using the ProjectId
        const response = await fetch(`http://localhost:3000/ProjectTicket?id=${ProjectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
          },
        });
        const data = await response.json();
        
        if (response.ok) {
          setTickets(data); // Store list of tickets in state
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
  }, [ProjectId]); // Dependency on ProjectId

  // Fetch individual ticket details for each ticket in the tickets array
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const ticketDetailsPromises = tickets.map(async (ticket) => {
          const response = await fetch(`http://localhost:3000/tickets?id=${ticket.Ticket_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
            },
          });
          const data = await response.json();

          if (response.ok) {
            return data[0]; // Assuming the response is an array with the first object as the ticket detail
          } else {
            throw new Error('Failed to fetch ticket details');
          }
        });

        // Wait for all ticket detail fetches to complete
        const detailedTickets = await Promise.all(ticketDetailsPromises);
        setDetailedTickets(detailedTickets); // Store detailed tickets
      } catch (err) {
        console.error('Fetch Ticket Details Error:', err);
        setError(err.message);
      }
    };

    if (tickets.length > 0) {
      fetchTicketDetails(); // Fetch details only when tickets are available
    }
  }, [tickets]); // Dependency on tickets

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5 text-center">
        <p>Error: {error}</p>
        <a href="/" className="btn btn-primary">Go Back</a>
      </div>
    );
  }

  if (detailedTickets.length === 0) {
    return (
      <div className="alert alert-warning mt-5 text-center">
        <p>No ticket details found for this project.</p>
        <a href="/" className="btn btn-primary">Go Back</a>
      </div>
    );
  }

  // Assuming the first ticket's project_name is the same for all tickets
  const projectName = detailedTickets[0]?.project_name;

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f4f4f4", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", overflowX: "hidden" }}>
      <div style={{ width: "90%", maxWidth: "1200px", backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", fontFamily: "Arial, sans-serif", boxSizing: "border-box", overflowX: "hidden" }}>
        
        {/* Project Name Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ fontWeight: "bold", marginBottom: "5px" }}>{projectName}</h1>
        </div>

        {/* Iterate over detailed tickets and render details one after another */}
        {detailedTickets.map((ticket, index) => (
          <div 
            key={ticket.Ticket_id} 
            style={{
              marginBottom: '30px',
              border: '1px solid #ddd', // Add a border around each ticket
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', // Optional: Adds a slight shadow effect to differentiate the cards
              backgroundColor: "#ffffff" // Clean background for each ticket
            }}
          >
            {/* Ticket ID and Details */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h5 style={{ color: "#6c757d", fontSize: "16px" }}>Ticket ID: {ticket.Ticket_id}</h5>
            </div>
        
            {/* Fields in a Grid Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "16px", width: "100%" }}>
              <div><strong style={{ color: "#555" }}>Title:</strong> <span style={{ color: "#000" }}>{ticket.Tittle}</span></div>
              <div><strong style={{ color: "#555" }}>Created At:</strong> <span style={{ color: "#000" }}>{new Date(ticket.created_at).toLocaleString()}</span></div>
              <div><strong style={{ color: "#555" }}>Updated At:</strong> <span style={{ color: "#000" }}>{new Date(ticket.updated_at).toLocaleString()}</span></div>
          
              <div><strong style={{ color: "#555" }}>Priority:</strong> <span style={{ color: "#000" }}>{ticket.priority}</span></div>
              <div><strong style={{ color: "#555" }}>Status:</strong> <span style={{ color: "#000" }}>{ticket.status}</span></div>
              <div><strong style={{ color: "#555" }}>Assignee:</strong> <span style={{ color: "#000" }}>{ticket.assignee_name}</span></div>
          
              <div><strong style={{ color: "#555" }}>IP Address:</strong> <span style={{ color: "#000" }}>{ticket.Ip_address}</span></div>
              <div><strong style={{ color: "#555" }}>Type:</strong> <span style={{ color: "#000" }}>{ticket.type}</span></div>
              <div><strong style={{ color: "#555" }}>Reporter:</strong> <span style={{ color: "#000" }}>{ticket.reporter_name}</span></div>
              
              <div style={{ gridColumn: "span 3" }}><strong style={{ color: "#555" }}>Tagging:</strong> <span style={{ color: "#000" }}>{ticket.Tagging}</span></div>
            </div>
        
            {/* Description Box with Scroll */}
            <div style={{ maxHeight: "6em", overflowY: "auto", lineHeight: "1.5em", borderRadius: "5px", backgroundColor: "#f8f9fa", padding: "10px", border: "1px solid #ddd", width: "100%", boxSizing: "border-box" }}>
              <strong style={{ color: "#555" }}>Description:</strong>
              <p style={{ margin: "0", whiteSpace: "pre-wrap", color: "#000" }}>{ticket.description}</p>
            </div>

            {/* Horizontal Line at the End of Each Ticket */}
            <hr style={{ border: '1px solid #ddd', margin: '20px 0' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketDetail;
