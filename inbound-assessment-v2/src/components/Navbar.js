import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "./inbound-academy-logo.png";

const Navbar = () => {
  let show_hide = "test";

  let navigator = useNavigate();
  let location = useLocation();
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user-type");
    navigator("/login");
  };

  useEffect(() => {
    if (sessionStorage.getItem("token") === null) {
      navigator("/login");
      show_hide = "custom_hide";
    }
  }, []);

  if (sessionStorage.getItem("token") == null) {
    show_hide = "custom_hide";
  }
  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark ${show_hide}`}>
      <div className="container-fluid">
        {sessionStorage.getItem("user-type") == "user" ? (
          <Link className="navbar-brand" to="/student-dashboard">
            <img className="logoc" src={logo} s alt="logo" />
          </Link>
        ) : (
          <Link className="navbar-brand" to="/home">
            <img className="logoc" src={logo} alt="logo" />
          </Link>
        )}
        <div class="mobile_btns">
          <button onClick={handleLogout} className="btn mobile_logout">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;Logout
          </button>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="bx bx-menu"></i>
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {sessionStorage.getItem("token") ? (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/home"
                >
                  <i class="bx bxs-dashboard"></i>&nbsp;home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/addquestions" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/addquestions"
                >
                  <i class="bx bxs-bookmark-alt-plus"></i> &nbsp;Add Questions
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/view-result" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/view-result"
                >
                  <i class="bx bxs-analyse"></i>&nbsp;Result
                </Link>
              </li>
            </ul>
          ) : (
            ""
          )}
          <button onClick={handleLogout} className="btn desktop_logout">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
