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
            </div>
            <div className="container" style={{ paddingTop: "150px" }}>
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
