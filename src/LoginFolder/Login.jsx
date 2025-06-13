import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../src/views/ContextData"; // Adjust the path to match your project

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, login, user } = useAuth(); // Use context here

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     if (Number(user.roleId) === 5) {
  //       console.log("Admin user detected, redirecting to admin dashboard");
        
  //       navigate("/admin/dashboard");
  //     } else {
  //       navigate("/ProjectList");
  //     }
  //   }
  // }, [isLoggedIn, navigate, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok) {
      // Save user info in context/global state
      login({
        userId: data.user.id,
        roleId: data.user.role_id,
        role: data.user.role,
      });
      sessionStorage.setItem("login",true)
      // Optional: store token if your app uses both session + JWT
      // localStorage.setItem("authToken", data.token);

      // Redirect based on role
      if (Number(data.user.role_id) === 5) {
        console.log("Admin user detected, redirecting to admin dashboard");
        navigate("/admin/dashbaord");
      } else {
         navigate("/developer/projectlist");
      }
    } else {
      setError(data.message || "Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError("An error occurred. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="text-center mb-4" style={{ color: "#333" }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary w-100 ${loading ? "disabled" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && (
          <div className="alert alert-danger text-center mt-3" role="alert">
            {error}
          </div>
        )}
        <div className="text-center mt-3">
          <button
            className="btn btn-link p-0"
            style={{ textDecoration: "none", color: "#007bff" }}
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
