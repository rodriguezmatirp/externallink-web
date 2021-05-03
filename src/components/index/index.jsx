import React from "react";
import styles from "./index.module.css";

export default function Index() {
  document.title = "Scrapper"
  return (
    <div className="fluid-container">
      <div className={`${styles.top}`}>
        <div className={styles.grad}>
          <div className="container">
            <div className="row pb-4" style={{ paddingTop: "75px" }}>
              <div className="col-lg-6 mb-4">
                <p className={styles.heading}>Web Scraper</p>
                <span style={{ color: "white", fontSize: "27px" }}>
                    Article Links from sitemaps for given domain website
                </span>
              </div>
            </div>
            <div className="container" style={{ paddingTop: "150px" }}>
              <div className="col-lg-12 mx-auto">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
