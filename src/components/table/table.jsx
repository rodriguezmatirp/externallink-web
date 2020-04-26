import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import axios from "axios";
import { getScrapedData } from "../../utils/routes";
import { CSVLink } from "react-csv";
import { FaFileDownload } from "react-icons/fa";

function Table(props) {
  const [skip, setSkip] = useState(0);
  const [table, setTable] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let obj = JSON.parse(localStorage.getItem("link"));
      // let id = props.match.params.url;
      // let list = await axios.get(getSitemaps);
      // if (id < list.data.result.length) {
      //   let url = list.data.result[id].link;
      let url = obj.site;
      let data = await axios.get(
        `${getScrapedData}/?site=${url}&limit=20&skip=${skip}`
      );
      // console.log(list.data.result[id]);
      setTable(data.data.doc);
      setData(obj);
      // }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  const counter = (val) => {
    if (val === "pre") {
      setSkip(skip - 20);
    } else if (val === "next") setSkip(skip + 20);
  };
  // const handleSubmit = async () => {
  //   if(skip > and )
  // }

  let result = [["published_date", "articlelink", "externalLinks"]];
  let CsvOperation = async (table) => {
    let i = 0;

    for (i = 0; i < table.length; i++) {
      let j = 0;
      let links = [];
      for (j = 0; j < table[i].externalLinks.length; j++) {
        let link =
          "link " +
          (j + 1) +
          " :- " +
          table[i].externalLinks[j].link +
          "  , rel:-" +
          table[i].externalLinks[j].rel +
          "\n";

        links.push([link]);
      }
      //console.log(links);
      var dateobj = new Date(table[i].created_at.toString());
      result.push([dateobj.toString(), table[i].articlelink, links]);
    }
  };
  CsvOperation(table);
  return (
    <div className="fluid-container" style={{ backgroundColor: "#e7f6fd" }}>
      <div className="container pt-5 pb-5">
        <div className="col-lg-12">
          <div className="title h5">
            <p>
              <strong>Title:</strong> <span>{data ? data.title : null}</span>
            </p>
          </div>
          <div className="sitemap h5">
            <p>
              <strong>Sitemap:</strong> <span>{data ? data.link : null}</span>
            </p>
          </div>
          {table ? (
            <CSVLink data={result}>
              <FaFileDownload
                style={{
                  fontSize: 36,
                  marginBottom: 8,
                }}
              />
              Download
            </CSVLink>
          ) : null}
        </div>
        {/* <div className={styles.RNNXgb}>
          <div className={styles.SDkEP}>
            <div className={styles.a4bIc}>
              <TextField id="standard-basic" fullWidth />
            </div>
          </div>
        </div> */}
        <div className="col-lg-12">
          <div
            className={`card ${styles.cardEdit2}`}
            style={{
              overflowY: "scroll",
              height: "1000px",
              display: "block",
            }}
          >
            <table className="table ">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Site</th>
                  <th scope="col">External Links</th>
                </tr>
              </thead>
              <tbody>
                {table
                  ? table.map((tab, i) => {
                      let date = tab.created_at.substring(
                        0,
                        tab.created_at.indexOf("T")
                      );
                      return (
                        <tr style={{ backgroundColor: "#f2f2f2" }} key={i}>
                          <td>{date}</td>
                          <td>{tab.articlelink}</td>
                          <td>
                            <table className="table">
                              <tbody>
                                {tab.externalLinks.length > 0 ? (
                                  tab.externalLinks.map((extLink, j) => {
                                    return (
                                      <tr key={j}>
                                        <td>{extLink.link}</td>
                                        <td>{extLink.rel}</td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td>No External Links</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-12 mt-5">
          <div className="col-lg-6 text-center mx-auto">
            <div className={styles.pagination}>
              {skip > 0 ? <p onClick={() => counter("pre")}>❮</p> : null}
              {table.length < 20 ? null : (
                <p onClick={() => counter("next")}>❯</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;

// -webkit-tap-highlight-color: rgba(0,0,0,0);
// -webkit-font-smoothing: antialiased;
// line-height: 1.7;
// font-weight: 400;
// font-family: "Poppins";
// color: #616161;
// font-size: 14px;
// cursor: pointer;
// box-sizing: border-box;
// width: 70%;
// max-width: 1200px;
// position: relative;-webkit-tap-highlight-color: rgba(0,0,0,0);
// -webkit-font-smoothing: antialiased;
// line-height: 1.7;
// font-weight: 400;
// font-family: "Poppins";
// color: #616161;
// font-size: 14px;
// cursor: pointer;
// box-sizing: border-box;
// width: 70%;
// max-width: 1200px;
// position: relative;

// -webkit-tap-highlight-color: rgba(0,0,0,0);
// -webkit-font-smoothing: antialiased;
// line-height: 1.7;
// font-weight: 400;
// font-family: "Poppins";
// color: #616161;
// font-size: 14px;
// cursor: pointer;
// box-sizing: border-box;

// -webkit-tap-highlight-color: rgba(0,0,0,0);
// -webkit-font-smoothing: antialiased;
// box-sizing: border-box;
// font: inherit;
// font-family: inherit;
// border: 1px solid #e3e3e3;
// line-height: 100px!important;
// background-color: #fff;
// border-radius: 1000px;
// width: 100%;
// display: table;
// border-width: 0px;
// z-index: 6000;
// padding: 0px 100px;
// font-size: 24px!important;
// color: #9e9e9e;
// font-weight: 300;
// font-style: normal;
// box-shadow: 1px 4px 8px 1px rgba(0,0,0,0.2);
// margin: 10px 0;
