import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import Form from "../addForm/form";
import styles from "./navbar.module.css";
import { AuthContext, DispatchContext } from "../../contexts/userContext";
// import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";

// const useStyles = makeStyles((theme) => ({
//   orange: {
//     height: "35px",
//     width: "35px",
//   },
// }));

const Navbar = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const Data = useContext(AuthContext);
  const toggleModal = (value) => {
    setIsOpen(value);
  };
  const Dispatch = useContext(DispatchContext);

  const handleLogout = () => {
    Dispatch({ type: "OUT" });
    toast.success("Log out successfully");
  };

  // const classes = useStyles();

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{
          boxShadow: "2px 0px 6px #707070",
        }}
      >
        <div className="container">
          <NavLink
            className="navbar-brand"
            style={{
              fontWeight: 700,
              color: "rgba(12, 213, 8, 0.952)",
            }}
            to="/"
          >
            Article Scraper
          </NavLink>
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
            {Data.token !== "" ? (
              <ul className="navbar-nav mr-auto" >
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/home"
                    style={{ color: "rgb(133, 123, 123)" }}
                    activeStyle={{
                      fontWeight: "bold",
                      color: "#65d668",
                      borderBottom : "1.5px solid #77f77b"
                    }}
                  >
                    WebsiteWise
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/datewise"
                    style={{ color: "rgb(133, 123, 123)" }}
                    activeStyle={{
                      fontWeight: "bold",
                      color: "#65d668",
                      borderBottom : "1.5px solid #77f77b"
                    }}
                  >
                    DateWise
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/filter"
                    style={{ color: "rgb(133, 123, 123)" }}
                    activeStyle={{
                      fontWeight: "bold",
                      color: "#f26666",
                      borderBottom : "1.5px solid #f78383"
                    }}
                  >
                    Filter
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/stats"
                    style={{ color: "rgb(133, 123, 123)" }}
                    activeStyle={{
                      fontWeight: "bold",
                      color: "#f2aa4b",
                      borderBottom : "1.5px solid #f7be72"
                    }}
                  >
                    Stats
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/users"
                    style={{ color: "rgb(133, 123, 123)" }}
                    activeStyle={{
                      fontWeight: "bold",
                      color: "#f2aa4b",
                      borderBottom : "1.5px solid #f7be72"
                    }}
                  >
                    Users
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/externalLink"
                    style={{ color: "rgb(133, 123, 123)" }}
                    activeStyle={{
                      fontWeight: "bold",
                      color: "#65d668",
                      borderBottom : "1.5px solid #77f77b"
                    }}
                  >
                    ExternalLinks
                  </NavLink>
                </li>
              </ul>
            ) : null}
            <ul
              className="navbar-nav mr-auto nav justify-content-end"
              style={{ width: "100%" }}
            >
              {Data.token === "" ? (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/login"
                      style={{ color: "rgb(133, 123, 123)" }}
                    >
                      Sign In
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/register"
                      style={{ color: "rgb(133, 123, 123)" }}
                    >
                      Sign Up
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      type="nav-link button"
                      className={`btn ${styles.btnSecondaryBlue}`}
                      onClick={() => toggleModal(true)}
                      to="/home"
                    >
                      Add Sitemap
                    </NavLink>
                  </li>
                  <li
                    className={`nav-item dropdown ml-2 ${styles.navLg}`}
                    // style={{ marginTop: "-6px" }}
                  >
                    <NavLink
                      to="#"
                      className="nav-link"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {/* <Avatar className={classes.orange}>
                        {Data.user.name[0]}
                      </Avatar> */}

                      {Data.user.name.split(" ")[0]}
                    </NavLink>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <NavLink
                        className="dropdown-item"
                        to="/"
                        onClick={handleLogout}
                      >
                        Log Out
                      </NavLink>
                    </div>
                  </li>
                  <li className={`nav-item ${styles.navSM}`}>
                    <NavLink
                      className="nav-link"
                      to="/"
                      style={{ color: "rgb(133, 123, 123)" }}
                      onClick={handleLogout}
                    >
                      Log Out
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Form toggleModal={toggleModal} modalIsOpen={modalIsOpen} />
    </>
  );
};

export default Navbar;
