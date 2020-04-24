import React, { useState, useEffect } from "react";
import styles from "./homepage.module.css";
import axios from "axios";
import { getSitemaps } from "../../utils/routes";
import { NavLink } from "react-router-dom";
import GlobalCSV from "./../globalCSV/globalCSV";

export default function Homepage() {
  const [list, setList] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getSitemaps);
        setList(response.data.result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  console.log(list);
  return (
    <div
      className="fluid-container pb-5"
      style={{ backgroundColor: "#e7f6fd" }}
    >
      <div className="container pt-4">
        <div className="col-lg-9 mx-auto">
          <div className="input-group mt-4 mb-4">
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon2"
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-success"
                type="button"
                id="button-addon2"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* <div className="articles text-dark h3 mt-4">
            <span>Your Articles</span>
          </div> */}
            <div className="row">
              {list.length > 0 ? (
                list.map((item, i) => {
                  let sitemap = item.link.substring(0, 20);
                  return (
                    <div
                      className="col-lg-6 col-xl-6 col-md-6 mt-4 pb-4"
                      key={i}
                    >
                      <div className={styles.TypeCard}>
                        <div className="row align-items-center no-gutters">
                          <div className="col mr-2 h5">
                            <div className=" text-secondary  mb-1">
                              <span className="text-dark font-weight-bold">
                                Title:{" "}
                              </span>
                              <span>{item.title}</span>
                            </div>
                            <div className=" text-secondary  mb-1">
                              <span className="text-dark font-weight-bold">
                                Url:{" "}
                              </span>
                              <span>{sitemap}...</span>
                            </div>
                            <div className=" text-secondary  mb-1">
                              <span className="text-dark font-weight-bold">
                                Algo:{" "}
                              </span>
                              <span>{item.algo}</span>
                            </div>
                            <div className="float-right">
                              <NavLink to={`/table/${i}`}>See data</NavLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-lg-6">
                  <h4>No any sitemap data</h4>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-4 mt-4">
            <GlobalCSV />
          </div>
        </div>
      </div>
    </div>
  );
}
