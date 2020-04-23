import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Form from "../addForm/form";
import styles from "./navbar.module.css";

function Navbar() {
  const [modalIsOpen, setIsOpen] = useState(false);

  const toggleModal = (value) => {
    setIsOpen(value);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <h5
            className="navbar-brand pt-2"
            style={{
              fontWeight: 700,
              color: "rgba(12, 213, 8, 0.952)",
            }}
          >
            Article Scraper
          </h5>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul
              className="navbar-nav mr-auto nav justify-content-end"
              style={{ width: "100%" }}
            >
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/home"
                  style={{ color: "rgb(133, 123, 123)" }}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="#"
                  style={{ color: "rgb(133, 123, 123)" }}
                >
                  Sign In
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="#"
                  style={{ color: "rgb(133, 123, 123)" }}
                >
                  Sign Out
                </NavLink>
              </li>
              <li className="nav-item ml-2">
                <NavLink
                  type="button"
                  className={`btn ${styles.btnSecondaryBlue}`}
                  onClick={() => toggleModal(true)}
                  to="/home"
                >
                  Add Sitemap
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Form toggleModal={toggleModal} modalIsOpen={modalIsOpen} />
    </>
  );
}

export default Navbar;
