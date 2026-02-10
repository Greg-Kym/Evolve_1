import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  // Retrieve the name we saved during Login/Register
  const name = localStorage.getItem("userName") || "User";

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-welcome">
          Welcome BABY, <span className="highlight-name">{name}</span>!
        </h1>
        <p className="dashboard-status">
          You are successfully logged into the <strong> Mountain of Love</strong>.
        </p>
        
        
      </div>
    </div>
  );
};

export default Dashboard;