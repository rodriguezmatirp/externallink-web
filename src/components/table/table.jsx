import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import axios from "axios";
import { getSitemaps, getScrapedData } from "../../utils/routes";

function Table(props) {
  const [table, setTable] = useState("");
  const [data, setData] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      let id = props.match.params.url;
      let list = await axios.get(getSitemaps);
      if (id < list.data.result.length) {
        let url = list.data.result[id].link;
        let data = await axios.get(
          `${getScrapedData}/?site=${url}&limit=20&skip=0`
        );
        console.log(data);
        setTable(data.data.doc);
        setData(list.data.result[id]);
      }
    };
    fetchData();
  }, []);
  console.log(data);
  console.log(table);
  return (
    <div className="fluid-container" style={{ backgroundColor: "#E4E7ED" }}>
      <div className="container pt-5 pb-5">
        <div className="col-lg-12">
          <div className="title">
            <p>
              Title: <span>{data ? data.title : null}</span>
            </p>
          </div>
          <div className="sitemap">
            <p>
              Sitemap: <span>{data ? data.link : null}</span>
            </p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className={`card p-2 ${styles.cardEdit}`}>
            <div className={`card ${styles.cardEdit2}`}>
              <div className="row px-3 pt-3">
                <div className="col-lg-3 h5">
                  <strong>Date</strong>
                </div>
                <div className="col-lg-3 h5">
                  <strong>Parent Link</strong>
                </div>
                <div className="col-lg-3 h5">
                  <strong>External Link</strong>
                </div>
                <div className="col-lg-3 h5">
                  <strong>Rel</strong>
                </div>
              </div>
              <hr />
              {table
                ? table.map((tab, i) => {
                    return (
                      <div className="row p-3" key={i}>
                        <div className="col-lg-3">{tab.created_at}</div>
                        <div className="col-lg-3">{tab.parent_link}</div>
                        <div className="col-lg-3">
                          {tab.externalLinks.length > 0 ? (
                            tab.externalLinks.map((link, i) => {
                              return <p key={i}>{link.link}</p>;
                            })
                          ) : (
                            <p>No external Link</p>
                          )}
                        </div>
                        {/* {tab.externalLinks.length > 0
                          ? tab.externalLinks.map((link) => {
                              if (link.rel === "dofollow")
                                return (
                                  <div className="col-lg-3">
                                    <p className="badge badge-success">
                                      {link.rel}
                                    </p>
                                  </div>
                                );
                              else
                                return (
                                  <div className="col-lg-3">
                                    <p className="badge badge-warning">
                                      {link.rel}
                                    </p>
                                  </div>
                                );
                            })
                          : null} */}
                        <div className="col-lg-3">
                          <p className="badge badge-success">Success</p>
                          <br />
                          <p className="badge badge-warning">Warning</p>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
