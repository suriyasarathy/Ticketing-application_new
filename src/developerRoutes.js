
import UserProfile from "views/UserProfile";
import ProjectList from "../src/views/userPage/ProjectList";

import ProjectForm from "views/Project/ProjectForm";

const developerRoutes = [
 
  {
    path: "/user-profile",
    name: "User Profile",
    component: UserProfile,
    layout: "/developer",
  },
  {
    path: "/projectlist",
    name: "Project List",
    component: ProjectList,
    layout: "/developer",
  },
  {
    path: "/create-project",
    name: "Create Project",
    component: ProjectForm,
    layout: "/developer",
  },
  
];

export default developerRoutes;
