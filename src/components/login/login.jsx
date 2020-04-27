import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./login.module.css";
import { DispatchContext, AuthContext } from "../../contexts/userContext";

export default function Login() {
  const [type, setType] = useState("password");
  const dispatch = useContext(DispatchContext);
  let Data = useContext(AuthContext);

  const toggleType = () => {
    type === "password" ? setType("text") : setType("password");
  };

  console.log(Data);

  return (
    <div className="fluid-container" style={{ backgroundColor: "#e7f6fd" }}>
      <div className="container" style={{ paddingTop: "50px" }}>
        <div
          className="row"
          style={{ marginRight: "-16px", marginLeft: "-16px" }}
        >
          <div className="col-lg-8 col-md-7 col-12" style={{ padding: "50px" }}>
            <img
              src="./assets/images/GroupLog.svg"
              width="100%"
              className="contact__image"
              height="100%"
              alt=""
            />
          </div>
          <div className="col-lg-4 col-md-5 col-12 pb-4">
            <div className="col-lg-12">
              <h4 className="title mt-4 mb-4">
                {" "}
                <strong>
                  Hi, <br /> Welcome Back
                </strong>
              </h4>
            </div>
            <form>
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
                    type={type}
                    className="form-control"
                    id="email"
                  />
                </div>
              </div>
              <div
                className="col-lg-12 text-right "
                style={{ color: "#007bff", cursor: "pointer" }}
                onClick={() => toggleType()}
              >
                {type === "password" ? (
                  <>
                    <FaEye
                      style={{
                        marginBottom: 3,
                      }}
                    />{" "}
                    <span>Show</span>
                  </>
                ) : (
                  <>
                    <FaEyeSlash
                      style={{
                        marginBottom: 3,
                      }}
                    />{" "}
                    <span>Hide</span>
                  </>
                )}
              </div>
              <div className="col-lg-12 mt-4">
                <button
                  type="submit"
                  className={`btn btn-outline-primary btn-block ${styles.prime_btn}`}
                  //   onClick={this.handleSubmit}
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
