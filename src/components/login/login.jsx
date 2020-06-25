import React, { useState, useContext, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./login.module.css";
import { DispatchContext, AuthContext } from "../../contexts/userContext";
import useInputState from "../../hooks/useInputState";
import axios from "axios";
import { getLogined } from "./../../utils/routes";
import { toast } from "react-toastify";

export default function Login(props) {
  const [type, setType] = useState("password");
  const [email, handleEmail] = useInputState("");
  const [password, handlePassword] = useInputState("");
  const Dispatch = useContext(DispatchContext);
  const Data = useContext(AuthContext);

  useEffect(() => {
    Data.token !== "" && props.history.goBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleType = () => {
    type === "password" ? setType("text") : setType("password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let body = { email, password };
    try {
      const user = await axios.post(getLogined, body);
      Dispatch({
        type: "IN",
        user: {
          id: user.data.data._id,
          name: user.data.data.name,
          email: user.data.data.email,
        },
        token: user.headers["x-auth-token"],
      });
      toast.success("Sign In successfully");
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
            <form onSubmit={handleSubmit}>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="name">Email:</label>
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
                  <label htmlFor="password">Password:</label>
                  <input
                    name="password"
                    value={password}
                    onChange={handlePassword}
                    type={type}
                    className="form-control"
                    id="password"
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
