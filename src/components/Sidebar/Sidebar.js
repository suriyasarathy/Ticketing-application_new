import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

function Sidebar({ color, image, routes = [] }) {  // Default empty array for safety
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };
  console.log("Routes:", routes);

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      {image && <div className="sidebar-background" style={{ backgroundImage: `url(${image})` }} />}
      <div className="sidebar-wrapper">
        <Nav>
          {routes.map((route, key) =>
            route.subRoutes ? (
              <li key={key} className="nav-item">
                <div
                  className="nav-link"
                  onClick={() => toggleMenu(route.name)}
                  style={{ cursor: "pointer", fontWeight: "bold", color: "white" }}
                >
                  {route.icon && <i className={route.icon} style={{ marginRight: 10 }} />}
                  {route.name}
                </div>
                <ul
                  className="submenu"
                  style={{
                    listStyleType: "none",
                    paddingLeft: 20,
                    display: openMenu === route.name ? "block" : "none",
                  }}
                >
                  {route.subRoutes.map((subRoute, subKey) => (
                    <li key={subKey}>
                    <NavLink
  to={subRoute.layout ? subRoute.layout + subRoute.path : subRoute.path}
  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
>

                        <p>{subRoute.name}</p>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={key}>
                <NavLink
                  to={route.layout ? route.layout + route.path : route.path}
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  {route.icon && <i className={route.icon} style={{ marginRight: 10 }} />}
                  <p>{route.name}</p>
                </NavLink>
              </li>
            )
          )}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
