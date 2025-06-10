import React from "react";
import { useLocation, Route, Routes, useNavigate } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";
import sidebarImage from "assets/img/sidebar-3.jpg";

function Admin() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const navigate = useNavigate();
  console.log("Routes in Admin.js:", routes);

  // Redirect to login if not authenticated
  // React.useEffect(() => {
  //   const isLoggedIn = localStorage.getItem("LoggedIn") === "true";
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin" && prop.component) {
        return (
          <Route path={prop.path} element={React.createElement(prop.component)} key={key} />

        );
      }
      return null;
    });
  };
  

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
  }, [location]);

  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />
          <div className="content">
            <Routes>{getRoutes(routes)}</Routes>
          </div>
          <Footer />
        </div>
      </div>
      <FixedPlugin
        hasImage={hasImage}
        setHasImage={() => setHasImage(!hasImage)}
        color={color}
        setColor={setColor}
        image={image}
        setImage={setImage}
      />
    </>
  );
}

// ✅ Add this default export
export default Admin;
