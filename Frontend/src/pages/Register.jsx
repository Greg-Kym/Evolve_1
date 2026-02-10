import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      
      const { data } = await axios.post(
        "http://localhost:5000/api/authentication/register",
        { name, email, password },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        

        if (data.userId) {
            localStorage.setItem("userId", data.userId); 
        }
        
        localStorage.setItem("userName", data.name || name); 
        localStorage.setItem("isVerified", "false"); 

        
        navigate("/verify-email");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-text">Join Project X today</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="register-button">
            Sign Up
          </button>
        </form>

        <p className="redirect-link">
          Already have an account? <span onClick={() => navigate("/login")} style={{cursor: 'pointer', color: '#007bff'}}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default Register;