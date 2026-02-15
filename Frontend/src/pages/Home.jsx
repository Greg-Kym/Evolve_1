import "./Home.css";
import logoImage from "../images/fb448c4d2caddc0f7745ebee00045e7d.png";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="container-homepage">
      <div className="homepage-navbar">
        <div className="logo-div">
          <img src={logoImage} alt="Mountain-Logo" className="logo" />
          <p className="company-name">Mountain 0f Love</p>
        </div>
        <button className="nav-home-button" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>

      <div className="main-homepage">
        <p className="welcome">
          Find Your Desired <br />{" "}
          <span className="spn-partner">
            Partner{" "}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M50 30 
               C 50 0, 0 0, 0 35 
               C 0 60, 50 100, 50 100 
               C 50 100, 100 60, 100 35 
               C 100 0, 50 0, 50 30"
                stroke="#194388"
                fill="rgba(240, 98, 114, 0.1)"
                strokeWidth="3"
              />
            </svg>
          </span>{" "}
          With Us <span className="yoo">...</span>
        </p>

        <div>hello</div>
        <p className="welcome-2">The Best Dating Platform.</p>
        <button className="download-bttn">Download App </button>
      </div>
    </div>
  );
}
