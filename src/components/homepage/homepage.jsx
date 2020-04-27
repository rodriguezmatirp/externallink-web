import React, { useState, useEffect } from "react";
import styles from "./homepage.module.css";
import axios from "axios";
import { getSitemaps } from "../../utils/routes";
import { NavLink } from "react-router-dom";
import GlobalCSV from "./../globalCSV/globalCSV";
import useInputState from "../../hooks/useInputState";

export default function Homepage() {
  const [list, setList] = useState("");
  const [query, handleQuery] = useInputState("");

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

  const savedata = (title, site) => {
    localStorage.setItem("link", JSON.stringify({ title, site }));
  };
  const searchData = () => {
    let filtered = list;
    if (query) {
      filtered = filtered.filter((data) => {
        return data.title.toLowerCase().startsWith(query.toLowerCase());
      });
    }
    return filtered;
  };

  const filteredData = searchData();
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
              value={query}
              onChange={handleQuery}
              aria-label="Search"
              aria-describedby="button-addon2"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              {filteredData.length > 0 ? (
                filteredData.map((item, i) => {
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
                              <NavLink
                                to="/table"
                                onClick={() => savedata(item.title, item.link)}
                              >
                                See data
                              </NavLink>
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
