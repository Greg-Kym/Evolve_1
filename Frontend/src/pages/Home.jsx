import "./Home.css";
import logoImage from "../images/fb448c4d2caddc0f7745ebee00045e7d.png";

export default function App() {
  return (
    <div className="container-homepage">
      <div className="homepage-navbar">
        <div className="logo-div">
          <img src={logoImage} alt="Mountain-Logo" className="logo" />
          <p className="company-name">Mountain 0f Love</p>
        </div>
        <button className="nav-home-button">Get Started</button>
      </div>

      <div></div>
      <div></div>
      <div></div>
      <div></div>

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
                stroke="#F06272"
                fill="rgba(240, 98, 114, 0.1)"
                stroke-width="3"
              />
            </svg>
          </span>{" "}
          With Us
        </p>
        <p className="welcome-2">The Best Dating Platform</p>
        <button className="download-bttn">Download App </button>
      </div>
    </div>
  );
}
