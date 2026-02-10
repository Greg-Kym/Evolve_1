import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import logoImage from "../images/fb448c4d2caddc0f7745ebee00045e7d.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      
      const { data } = await axios.post(
        "http://localhost:5000/api/authentication/logout",
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Logged out successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src={logoImage} alt="Logo" />
        <span>Mountain of Love</span>
      </div>

      <div className="navbar-links">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;