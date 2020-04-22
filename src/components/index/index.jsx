import React from "react";
import styles from "./index.module.css";

export default function Index() {
  return (
    <div className="fluid-container">
      <div className={`${styles.top}`}>
        <div className={styles.grad}>
          <div className="container">
            <div className="row pb-4" style={{ paddingTop: "75px" }}>
              <div className="col-lg-6 mb-4">
                <p className={styles.heading}>Scraper for everyone </p>
                <span style={{ color: "white", fontSize: "27px" }}>
                  Whatever you want — we'll scrap for you
                </span>
              </div>
              <div className="col-lg-6">
                <div
                  className="card"
                  style={{ borderRadius: "5px", border: 0 }}
                >
                  <div className={`${styles.head} text-center pt-3`}>
                    <h4>
                      <strong>Register </strong>
                    </h4>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="form-row">
                        <div className="col-lg-6 mb-4">
                          <label
                            for="name"
                            style={{ color: "rgb(66, 63, 63)" }}
                          >
                            <strong>First Name</strong>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="col-lg-6 mb-4">
                          <label
                            for="name"
                            style={{ color: "rgb(66, 63, 63)" }}
                          >
                            <strong>Last Name</strong>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="col-lg-6 mb-4">
                          <label
                            for="email"
                            style={{ color: "rgb(66, 63, 63)" }}
                          >
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
            </div>
            <div className="container">
              <div className="col-lg-12 mx-auto">
                <div className="row" style={{ marginTop: "78px" }}>
                  <div className="col-lg-3 text-center">
                    <p className={styles.tag}>
                      30 <small style={{ fontSize: "20px" }}>Titles</small>
                    </p>
                  </div>
                  <div className="col-lg-3 text-center">
                    <p className={styles.tag}>
                      20 <small style={{ fontSize: "20px" }}>Sitemaps</small>
                    </p>
                  </div>
                  <div className="col-lg-3 text-center">
                    <p className={styles.tag}>
                      500+<small style={{ fontSize: "20px" }}>Articles</small>
                    </p>
                  </div>
                  <div className="col-lg-3 text-center">
                    <p className={styles.tag}>
                      5<small style={{ fontSize: "20px" }}>current users</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
