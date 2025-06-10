import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForget = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset link sent! Check your email.");
        setError("");
      } else {
        setError(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="text-center mb-4" style={{ color: "#333" }}>Forgot Password</h1>
        {message ? (
          <div className="alert alert-success text-center">{message}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Enter your email:</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-100 ${loading ? "disabled" : ""}`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
        {error && (
          <div className="alert alert-danger text-center mt-3" role="alert">
            {error}
          </div>
        )}
        <div className="text-center mt-3">
          <button
            className="btn btn-link p-0"
            style={{ textDecoration: "none", color: "#007bff" }}
            onClick={handleBackToLogin}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForget;
