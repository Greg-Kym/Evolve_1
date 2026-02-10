import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./EmailVerify.css";

const EmailVerify = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const sendOtpEmail = async () => {
    try {
      setSendingEmail(true);
      const userId = localStorage.getItem("userId");

      const { data } = await axios.post(
        "http://localhost:5000/api/authentication/send-verify-otp",
        { userId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      const { data } = await axios.post(
        "http://localhost:5000/api/authentication/verify-account",
        { userId, otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Account verified! Please login to continue. 🎉");
        localStorage.setItem("isVerified", "true");

        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-form">
        <h2 className="verify-title">Verify Account</h2>
        <p className="verify-subtitle">
          First, click the button to get your code.
        </p>

        <button
          onClick={sendOtpEmail}
          disabled={sendingEmail}
          className="send-otp-btn"
        >
          {sendingEmail ? "Sending..." : "Send Verification Email"}
        </button>

        <hr className="verify-divider" />

        <form onSubmit={handleVerify}>
          <div className="verify-input-group">
            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-Digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="otp-input-field"
            />
          </div>

          <button
            type="submit"
            className="verify-btn"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Go to Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;