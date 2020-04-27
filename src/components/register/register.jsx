import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./register.module.css";

export default function Register() {
  return (
    <div className="fluid-container" style={{ backgroundColor: "#e7f6fd" }}>
      <div className="container" style={{ paddingTop: "50px" }}>
        <div
          className="row"
          style={{ marginRight: "-16px", marginLeft: "-16px" }}
        >
          <div className="col-lg-7 col-md-7 col-12" style={{ padding: "50px" }}>
            <img
              src="./assets/images/register.svg"
              width="100%"
              className="contact__image"
              height="100%"
              alt=""
            />
          </div>
          <div className="col-lg-5 col-md-5 col-12 pb-4">
            <div className="col-lg-12">
              <h4 className="title mt-4 mb-4">
                {" "}
                <strong>
                  Welcome, <br />
                  Register Here
                </strong>
              </h4>
            </div>
            <form>
              <div className="col-lg-12 ">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="name">First Name:</label>
                      <input
                        name="fname"
                        // value={this.state.name}
                        // onChange={this.handleChange}
                        type="text"
                        className="form-control"
                        id="fname"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="name">Last Name:</label>
                      <input
                        name="lname"
                        // value={this.state.name}
                        // onChange={this.handleChange}
                        type="text"
                        className="form-control"
                        id="lname"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="name">Email:</label>
                  <input
                    name="email"
                    // value={this.state.name}
                    // onChange={this.handleChange}
                    type="text"
                    className="form-control"
                    id="email"
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="email">Password:</label>
                  <input
                    name="password"
                    // // value={this.state.email}
                    // // onChange={this.handleChange}
                    type="password"
                    className="form-control"
                    id="password"
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="email">Confirm Password:</label>
                  <input
                    name="password"
                    // // value={this.state.email}
                    // // onChange={this.handleChange}
                    type="password"
                    className="form-control"
                    id="cpassword"
                  />
                </div>
              </div>
              <div className="col-lg-12 mt-4">
                <button
                  type="submit"
                  className={`btn btn-outline-primary btn-block ${styles.prime_btn}`}
                  //   onClick={this.handleSubmit}
                >
                  Sign Up
                </button>
              </div>
              <div className="col-lg-12 mt-4">
                <label>
                  Already have account ? <NavLink to="/login">Sign In</NavLink>{" "}
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
