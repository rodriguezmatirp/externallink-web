import React from "react";
import { NavLink } from "react-router-dom";

export default function Register() {
  return (
    <div className="fluid-container" style={{ backgroundColor: "#e7f6fd" }}>
      {/* <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="card" style={{ borderRadius: "5px", border: 0 }}>
              <div className={`${styles.head} text-center pt-3`}>
                <h4>
                  <strong>Register </strong>
                </h4>
              </div>
              <div className="card-body">
                <form>
                  <div className="form-row">
                    <div className="col-lg-6 mb-4">
                      <label for="name" style={{ color: "rgb(66, 63, 63)" }}>
                        <strong>First Name</strong>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="col-lg-6 mb-4">
                      <label for="name" style={{ color: "rgb(66, 63, 63)" }}>
                        <strong>Last Name</strong>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="col-lg-6 mb-4">
                      <label for="email" style={{ color: "rgb(66, 63, 63)" }}>
                        <strong>Email</strong>
                      </label>
                      <input type="email" className="form-control" />
                    </div>
                    <div className="col-lg-6 mb-4">
                      <label
                        for="password"
                        style={{ color: "rgb(66, 63, 63)" }}
                      >
                        <strong>Password</strong>
                      </label>
                      <input type="password" className="form-control" />
                    </div>

                    <div className="col-lg-12 mb-2">
                      <button
                        type="button"
                        className={`btn btn-secondary btn-lg btn-block ${styles.btnedt}`}
                      >
                        <strong style={{ fontSize: "17px" }}>
                          Sign Up
                          <i className="fas fa-caret-right"></i>
                        </strong>
                      </button>
                    </div>
                    <div className="col-lg-12 mt-2">
                      <label>Already have account ? Sign In</label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            
          </div>
        </div>
      </div> */}
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
                        name="name"
                        // value={this.state.name}
                        // onChange={this.handleChange}
                        type="text"
                        className="form-control"
                        id="name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="name">Last Name:</label>
                      <input
                        name="name"
                        // value={this.state.name}
                        // onChange={this.handleChange}
                        type="text"
                        className="form-control"
                        id="name"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="name">Email:</label>
                  <input
                    name="name"
                    // value={this.state.name}
                    // onChange={this.handleChange}
                    type="text"
                    className="form-control"
                    id="name"
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="email">Password:</label>
                  <input
                    name="email"
                    // // value={this.state.email}
                    // // onChange={this.handleChange}
                    type="password"
                    className="form-control"
                    id="email"
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="email">Confirm Password:</label>
                  <input
                    name="email"
                    // // value={this.state.email}
                    // // onChange={this.handleChange}
                    type="password"
                    className="form-control"
                    id="email"
                  />
                </div>
              </div>
              <div className="col-lg-12 mt-4">
                <button
                  type="submit"
                  className={`btn btn-outline-primary btn-block `}
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
