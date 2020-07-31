import React, { useState, useEffect } from "react";
import styles from "./homepage.module.css";
import axios from "axios";
import { getSitemaps } from "../../utils/routes";
import { NavLink } from "react-router-dom";
// import GlobalCSV from "./../globalCSV/globalCSV";
import useInputState from "../../hooks/useInputState";
import { RedoOutlined  } from "@ant-design/icons";
import { scrapData } from "./../../utils/routes";
import { toast } from "react-toastify";
import { Alert, Spin } from "antd";


export default function Homepage() {
  const [list, setList] = useState("");
  const [query, handleQuery] = useInputState("");

  useEffect(() => {
    document.title = "Home"
    const fetchData = async () => {
      try {
        const response = await axios.get(getSitemaps);
        setList(response.data.result);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    fetchData();
  }, []);

  const savedata = (title, site, id) => {
    localStorage.setItem("link", JSON.stringify({ title, site, id }));
  };
  const searchData = () => {
    let filtered = list;
    if (query) {
      filtered = filtered.filter((data) => {
        return (
          data.title.toLowerCase().startsWith(query.toLowerCase()) ||
          data.link.toLowerCase().startsWith(query.toLowerCase())
        );
      });
    }
    return filtered;
  };

  const refreshScrap = (url) => {
    axios.post(scrapData, { url });
    console.log(url)
    toast.success("Scrapper Start");
  };

  // const deleteWebsite_ = (url) => {
  //   var pass = window.prompt("Admin access needed ")
  //   if (pass === "confirmDelete") {
  //     if (window.confirm("Delete " + url)) {
  //       axios.get(`${deleteWebsite}/?link=${url}`)
  //       toast.success("Successfully deleted " + url)
  //     } else {
  //       toast.error("Delete failed")
  //       return
  //     }
  //     window.location.reload()
  //   } else {
  //     toast.error("Delete Failed")
  //   }
  // }

  const filteredData = searchData();
  return (
    <div
      className="fluid-container pb-5"
      style={{ backgroundColor: "#f9fafb" }}
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

        <div className="pt-5">
          <div className="col-lg-12">
            <div className="row">
              {filteredData.length > 0 ? (
                filteredData.map((item, i) => {
                  // let sitemap = item.link.substring(0, 20);
                  return (
                    <div
                      className="col-lg-3 col-xl-3 col-md-6 mt-4 pb-4"
                      key={i}
                    >
                      <div className={styles.TypeCard} 
                      style={{border : item.blocked ? "1.2px solid red" : "1.2px solid #46d714"}}
                      >
                        <div
                          className="float-right"
                          onClick={() => refreshScrap(item.link)}
                          style={{ cursor: "pointer", fontSize: "26px", color: "#41D0EB" }}
                        >
                          <RedoOutlined />
                        </div>
                        {/* <div
                          className="float-right"
                          onClick={() => deleteWebsite_(item.link)}
                          style={{ cursor: "pointer", fontSize: "26px", color: "#EB4141" }}
                        >
                          <DeleteFilled />
                        </div> */}
                        <NavLink
                          to="/table"
                          onClick={() =>
                            savedata(item.title, item.link, item._id)
                          }
                        >
                          <div className="row align-items-center no-gutters">
                            <div className="col mr-2 h6">
                              <div className=" text-secondary text-center p-3">
                                <span className="text-dark font-weight-bold float-left"
                                  style={{ paddingTop: "25px", paddingRight: "10px" }}>
                                  {item.title}
                                </span>
                              </div>
                            </div>
                          </div>
                        </NavLink>
                      </div>
                    </div>
                  );
                })
              ) : (
                  <div className="col">
                    <Spin tip="Loading...">
                      <Alert
                        message="Websites"
                        description="Your content is either loading or not found"
                        type="info"
                      />
                    </Spin>
                  </div>
                )}
            </div>
          </div>
          {/* <div className="col-lg-4 mt-4">
            <GlobalCSV />
          </div> */}
        </div>
      </div>
    </div>
  );
}
