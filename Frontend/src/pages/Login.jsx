import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const { data } = await axios.post(
        "http://localhost:5000/api/authentication/login",
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);


        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.name);


        localStorage.setItem("isVerified", "true");


        navigate("/dashboard");

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Find your partner at Mountain of Love</p>

        <div className="login-input-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="yourmail@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="forgot-password" onClick={() => navigate("/reset-password")}>
            Forgot password?
          </p>
        </div>

        <button type="submit" className="login-submit-btn">
          Login
        </button>

        <p className="login-switch">
          Don't have an account? <span onClick={() => navigate("/register")} style={{ cursor: 'pointer', color: ' #194388' }}>Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;