import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // 1. Check if the user is logged in (Name exists)
  const isAuthenticated = localStorage.getItem("userName");
  
  // 2. Check if they have passed the OTP verification
  
  const isVerified = localStorage.getItem("isVerified") === "true";

  // If not logged in at all remove them
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but NOT verified, force them to the OTP page
  
  if (!isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // If they pass both checks, let them into the Dashboard!
  return children;
};

export default ProtectedRoute;