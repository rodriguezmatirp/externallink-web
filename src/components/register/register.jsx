import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./register.module.css";
import useInputState from "../../hooks/useInputState";
import axios from "axios";
import { getRegistered } from "../../utils/routes";
import { DispatchContext } from "../../contexts/userContext";
import { toast } from "react-toastify";

export default function Register(props) {
  const [fname, handleFname] = useInputState("");
  const [lname, handleLname] = useInputState("");
  const [email, handleEmail] = useInputState("");
  const [password, handlePassword] = useInputState("");
  const [cpassword, handleCpassword] = useInputState("");
  const [showError, setShowError] = useState(false);
  const Dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (password !== cpassword) setShowError(true);
    else setShowError(false);
  }, [password, cpassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let name = `${fname} ${lname}`;
    let body = { name, email, password, cpassword };
    try {
      const user = await axios.post(getRegistered, body);
      Dispatch({
        type: "IN",
        user: {
          name: user.data.data.name,
          email: user.data.data.email,
        },
        token: user.headers["x-auth-token"],
      });
      toast.success("Sign Up successfully");
      props.history.push("/home");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
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
            <form onSubmit={handleSubmit}>
              <div className="col-lg-12 ">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="name">First Name:</label>
                      <input
                        name="fname"
                        value={fname}
                        onChange={handleFname}
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
                        value={lname}
                        onChange={handleLname}
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
                  <label>Email:</label>
                  <input
                    name="email"
                    value={email}
                    onChange={handleEmail}
                    type="text"
                    className="form-control"
                    id="email"
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    name="password"
                    value={password}
                    onChange={handlePassword}
                    type="password"
                    className="form-control"
                    id="password"
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Confirm Password:</label>
                  <input
                    name="password"
                    value={cpassword}
                    onChange={handleCpassword}
                    type="password"
                    className="form-control"
                    id="cpassword"
                  />
                </div>
              </div>
              {showError ? (
                <div className="col-lg-12">
                  <div className="alert alert-danger" role="alert">
                    Password do not match
                  </div>
                </div>
              ) : null}

              <div className="col-lg-12 mt-4">
                <button
                  type="submit"
                  className={`btn btn-outline-primary btn-block ${styles.prime_btn}`}
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
