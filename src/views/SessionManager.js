import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IDLE_WARNING_TIME = 3600 * 1000; // 15 seconds
const LOGOUT_COUNTDOWN = 12 * 1000;  // 15 seconds after warning
const TOTAL_IDLE_TIME = IDLE_WARNING_TIME + LOGOUT_COUNTDOWN;


function SessionManager() {
  const [idleTime, setIdleTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(120); // in seconds
  let activityEvents = ["mousemove", "keydown", "mousedown", "touchstart"];
  const excludedRoutes = ["/login", "/forgot-password", "/reset-password"];
    const loginStatus = sessionStorage.getItem("login");
    const navigate = useNavigate();

  
  // Logout API

 useEffect(() => {
  const hasCookie = document.cookie.includes("session_id");

  if (!loginStatus || hasCookie) {
    axios.post("http://localhost:3000/logout", {}, { withCredentials: true })
      .then(() => {
        console.log("Orphan session destroyed");
        navigate("/login");
        sessionStorage.clear();
      })
      .catch((err) => {
        console.error("Failed to destroy orphan session:", err);
      });
  }
}, []);


  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    sessionStorage.clear();
   

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Reset idle timer on user activity
const resetIdleTimer = useCallback(() => {
  setIdleTime(0);
  setShowWarning(false);
  setCountdown(120);  // Reset countdown timer
}, []);

  // Add event listeners to reset on activity
  useEffect(() => {
    activityEvents.forEach((event) => window.addEventListener(event, resetIdleTimer));

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, resetIdleTimer));
    };
  }, [resetIdleTimer]);

  // Timer for tracking idle time
  useEffect(() => {
    const interval = setInterval(() => {
      setIdleTime((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Show warning modal after 13 mins
useEffect(() => {
      if (excludedRoutes.some((route) => location.pathname.startsWith(route))) return;

  if (idleTime >= IDLE_WARNING_TIME && idleTime < TOTAL_IDLE_TIME) {
    setShowWarning(true);
  } else if (idleTime >= TOTAL_IDLE_TIME) {
    logout();
  } else {
    setShowWarning(false); // Important to hide the modal if user moves
  }
}, [idleTime]);


  // Countdown logic
  useEffect(() => {
    let countdownInterval;
    if (showWarning && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      logout();
    }

    return () => clearInterval(countdownInterval);
  }, [showWarning, countdown]);

  return (
    <>
     {showWarning && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.4)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}
  >
    <div
      style={{
        background: "#f9f9f9",
        padding: "30px 40px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        textAlign: "center",
        width: "380px",
        color: "#333",
      }}
    >
      {/* Optional icon */}
      <div style={{ fontSize: "40px", marginBottom: "15px", color: "#007bff" }}>
        ⏳
      </div>

      <h3 style={{ marginBottom: "10px" }}>Session Expiring Soon</h3>

      <p style={{ fontSize: "16px", marginBottom: "25px", lineHeight: "1.5" }}>
        You have been inactive for a while. For your security, your session will automatically end in{" "}
        <strong>
          {String(Math.floor(countdown / 60)).padStart(2, "0")}:
          {String(countdown % 60).padStart(2, "0")}
        </strong>.
      </p>

      <p style={{ fontSize: "14px", color: "#666" }}>
        To continue your session, please move your mouse or press any key.
      </p>
    </div>
  </div>
)}

    </>
  );
}

export default SessionManager;
