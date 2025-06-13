import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ContextProvider } from "./views/ContextData";  // ✅ Correct Import

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import TicketEditPage from "views/admin/TicketEditPage";
import CreateTeam from "views/CreateTeam";
import Admin from "layouts/Admin.js";
import Login from "./LoginFolder/Login";   
import LoginForget from "LoginFolder/LoginForget";
import User from "./views/userPage/User";
import CreateTicket from "views/CreateTicket";
import TicketDetailuser from "./views/userPage/TicketDetailUser";
import ResetPassword from "LoginFolder/ResetPassword";
import UserProfile from "./views/UserProfile";
import UserCreateTicket from "./views/userPage/userCreate";
import ProjectList from "./views/userPage/ProjectList";
import ProjetofTicket from "./views/userPage/Listofticket";
import ProjectEditPage from "views/admin/ProjectEditPage";
import CommentSection from "components/CommentSection";
import EmailTicket from "views/Email_Ticket_convert/EmailTicket";
import Email_CreateTicket from "views/Email_Ticket_convert/Email_CreateTicket";
import UserList from "views/Project/UserList";
import UserEdit from "views/Project/UserEdit";
import ProjectForm from "views/Project/ProjectForm";
import ClientForm from "views/Project/ClientForm";
import Team_mangement from "views/admin/Team_mangement";
import SessionManager from "views/SessionManager";
import Dashboard from "views/Dashboard";
import Developer from "../src/layouts/Developer"; // 👈 Import Developer Layout
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  
  <ContextProvider>  {/* ✅ Use Correctly Named Provider */}
  
    <BrowserRouter>
    <SessionManager />
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
          <Route path="/developer/*" element={<Developer />} /> {/* 👈 Add this */}

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user" element={<User />} />
        <Route path="/forgot-password" element={<LoginForget />} />
        <Route path="/" element={<Navigate to="/login" />} />
        {/* <Route path='/admin/Team' element={<CreateTeam/>}/> */}
        <Route path="/Create-ticket" element={<CreateTicket />} />
        <Route path="/reset-Password/:token" element={<ResetPassword />} />
        <Route path="/User-Profile/:id" element={<UserProfile />} />
        <Route path="/UserCreateTicket/:ProjectId" element={<UserCreateTicket />} />
        <Route path="/ProjectList" element={<ProjectList />} />
        <Route path="/ProjectOfTicket/:projectID" element={<ProjetofTicket />} />
        <Route path="/ticketDetail/:TicketId" element={<TicketDetailuser />} />
        <Route path="/ProjectEdit/:Id" element={<ProjectEditPage/>}/>
        <Route path="/TicketEditPage/:project_id/:Ticket_id" element={<TicketEditPage/>}/>
        <Route path ="/Commentsetion" element={<CommentSection/>}/>
        <Route path="/Email-ticket" element={<EmailTicket/>}/>
        <Route path= "/UserList" element={<UserList/>}/>
        <Route path="/Email_Create_ticket" element ={<Email_CreateTicket/>}/>
        <Route path="/UserEdit/:id" element={<UserEdit/>}/>
        <Route path="/Create_Project" element={<ProjectForm/>}/>
        <Route path="/ClientForm" element={<ClientForm/>}/>
        <Route path="/Team_mangement" element={<Team_mangement/>}/>
      </Routes>
    </BrowserRouter>
  </ContextProvider>
);
