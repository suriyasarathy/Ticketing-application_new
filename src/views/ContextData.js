// import { createContext, useState, useContext, useEffect } from "react";
//this  is working code 
// const Context = createContext();

// export const ContextProvider = ({ children }) => {
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);


//   // ✅ Fetch user from session cookie on page refresh
//  // Fetch user session on mount
// useEffect(() => {
//   const fetchUser = async () => {
//     try {
//       const res = await fetch("http://localhost:3000/me", {
//         credentials: "include",
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setUser({
//           userId: data.id,
//           roleId: data.role_id,
//           role: data.role,
//         });
//         setIsLoggedIn(true);
//         console.log("User data from session:", data);
//       } else {
//         setUser(null);
//         setIsLoggedIn(false);
//       }
//     } catch (err) {
//       console.error("Session fetch error:", err);
//       setUser(null);
//       setIsLoggedIn(false);
//     }
//   };

//   fetchUser();
// }, []);

// // Fetch project from session only when logged in
// useEffect(() => {
//   if (!isLoggedIn) return;

//   const fetchSelectedProject = async () => {
//     try {
//       const res = await fetch("http://localhost:3000/current-project", {
//         credentials: "include",
//       });

//       if (res.ok) {
//         const data = await res.json();
//         console.log("Selected project ID from session:", data.projectId);
//         setSelectedProject(data.projectId);
//       } else {
//         setSelectedProject(null);
//       }
//     } catch (err) {
//       console.error("Error fetching selected project:", err);
//       setSelectedProject(null);
//     }
//   };

//   fetchSelectedProject();
// }, [isLoggedIn]);


//   // Function to set the selected project ID and store it in session
//   const setProject = async (projectId) => {
//     console.log("Setting project ID:", projectId);
//     try {
//       const res = await fetch("http://localhost:3000/set-project", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ projectId }),
//         credentials: "include", // Send HttpOnly cookie
//       });

//       if (res.ok) {
//         setSelectedProject(projectId); // Update the selected project state
//       } else {
//         console.error("Failed to set project ID in session");
//       }
//     } catch (err) {
//       console.error("Error setting project ID:", err);
//     }
//   };

//   const login = (userData) => {
//     setUser({
//       userId: userData.userId,
//       roleId: userData.roleId,
//       role: userData.role,
//     });
//     setIsLoggedIn(true);
//   };

//   const logout = async () => {
//     await fetch("http://localhost:3000/logout", {
//       method: "POST",
//       credentials: "include",
//     });
//     setUser(null);
//     setIsLoggedIn(false);
//     setSelectedProject(null); 
//     sessionStorage.clear();
//     // Clear selected project on logout
//   };

//   return (
//     <Context.Provider
//       value={{
//         selectedProject,
//         setSelectedProject :setProject, // Add setProject function
//         isLoggedIn,
//         user,
//         setUser,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </Context.Provider>
//   );
// };

// export const useProject = () => useContext(Context);
// export const useAuth = () => useContext(Context);

// import { createContext, useState, useContext, useEffect } from "react";

// const Context = createContext();

// export const ContextProvider = ({ children }) => {
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);

//   // ✅ Fetch user from session cookie on page refresh
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/me", {
//           credentials: "include", // Send HttpOnly cookie
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setUser({
//             userId: data.id,
//             roleId: data.role_id,
//             role: data.role,
//           });
//           console.log("User data from context api session:", data);
//           setIsLoggedIn(true);
//         } else {
//           setUser(null);
//           setIsLoggedIn(false);
//         }
//       } catch (err) {
//         console.error("Session fetch error:", err);
//         setUser(null);
//         setIsLoggedIn(false);
//       }
//     };

//     fetchUser();

//     // Fetch selected project ID when the user is logged in
   
//   }, [isLoggedIn]);
  
//   useEffect(() => {
//   if (!user) return;

//   const fetchSelectedProject = async () => {
//     try {
//       const res = await fetch("http://localhost:3000/current-project", {
//         credentials: "include",
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setSelectedProject(data.projectId);
//       } else {
//         setSelectedProject(null);
//       }
//     } catch (err) {
//       console.error("Error fetching selected project:", err);
//       setSelectedProject(null);
//     }
//   };

//   fetchSelectedProject();
// }, [user]);


//   // Function to set the selected project ID and store it in session
//   const setProject = async (projectId) => {
//     console.log("Setting project ID:", projectId);
    
//   try {
//     const res = await fetch("http://localhost:3000/set-project", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ projectId }),
//       credentials: "include",
//     });

//     if (res.ok) {
//       setSelectedProject(projectId);
//     } else {
//       console.error("Failed to set project ID in session");
//     }
//   } catch (err) {
//     console.error("Error setting project ID:", err);
//   }
// };




//  const login = (userData) => {
//   setUser({
//     userId: userData.userId,
//     roleId: userData.roleId,
//     role: userData.role,
//   });
//   setIsLoggedIn(true);
//   if (userData.projectId) {
//     setSelectedProject(userData.projectId);
//   }
// };


//   const logout = async () => {
//     await fetch("http://localhost:3000/logout", {
//       method: "POST",
//       credentials: "include",
//     });
//     setUser(null);
//     setIsLoggedIn(false);
//     setSelectedProject(null); // Clear selected project on logout
//   };

//  return (
//   <Context.Provider
//     value={{
//       selectedProject,
//       setProject,   // Correct function to expose
//       isLoggedIn,
//       user,
//       login,
//       logout,
//     }}
//   >
//     {children}
//   </Context.Provider>
// );}

// export const useProject = () => useContext(Context);
// export const useAuth = () => useContext(Context);

import { createContext, useState, useContext, useEffect, useRef } from "react";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const excludedRoutes = ["/login", "/forgot-password", "/reset-password"];

  // Activity flag: 0 = no activity, 1 = activity happened
  const activityFlag = useRef(0);
  // setIsLoggedIn =sessionStorage.getItem("login");

  // Listen to user activity and set flag to 1
  useEffect(() => {
    const handleUserActivity = () => {
      activityFlag.current = 1;
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
    };
  }, []);

  // Heartbeat timer: every 15 mins check activity flag and send heartbeat if needed
  useEffect(() => {
                    console.log("Sending heartbeat..1.");

    if (!isLoggedIn) return; // only run when logged in
    if (excludedRoutes.some((route) => location.pathname.startsWith(route))) return;

    const interval = setInterval(async () => {
                console.log("Sending heartbeat..1.");

      if (activityFlag.current === 1) {
        try {
          console.log("Sending heartbeat...");
         
          const res = await fetch("http://localhost:3000/session-check'", {
            credentials: "include",
          });
          if (res.ok) {
            console.log("Heartbeat sent");
            activityFlag.current = 0; // reset flag after heartbeat
          }
        } catch (error) {
          console.error("Heartbeat error:", error);

        }
      } else {
        console.log("No activity, no heartbeat sent");
      }
    }, 20*60 * 1000); // 20 minutes

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Your existing code: fetchUser, fetchSelectedProject, login, logout ...

  // ✅ Fetch user from session cookie on page refresh
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser({
            userId: data.id,
            roleId: data.role_id,
            role: data.role,
          });
          setIsLoggedIn(true);
          console.log("User data from session:", data);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Session fetch error:", err);
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
     if (excludedRoutes.some((route) => location.pathname.startsWith(route))) return;


    const fetchSelectedProject = async () => {
      try {
        const res = await fetch("http://localhost:3000/current-project", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Selected project ID from session:", data.projectId);
          setSelectedProject(data.projectId);
        } else {
          setSelectedProject(null);
        }
      } catch (err) {
        console.error("Error fetching selected project:", err);
        setSelectedProject(null);
      }
    };

    fetchSelectedProject();
  }, [isLoggedIn]);

  const setProject = async (projectId) => {
    console.log("Setting project ID:", projectId);
    try {
      const res = await fetch("http://localhost:3000/set-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
        credentials: "include",
      });

      if (res.ok) {
        setSelectedProject(projectId);
      } else {
        console.error("Failed to set project ID in session");
      }
    } catch (err) {
      console.error("Error setting project ID:", err);
    }
  };

  const login = (userData) => {
    setUser({
      userId: userData.userId,
      roleId: userData.roleId,
      role: userData.role,
    });
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setIsLoggedIn(false);
    setSelectedProject(null);
    sessionStorage.clear();
  };

  return (
    <Context.Provider
      value={{
        selectedProject,
        setSelectedProject: setProject,
        isLoggedIn,
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useProject = () => useContext(Context);
export const useAuth = () => useContext(Context);
