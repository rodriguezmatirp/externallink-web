import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import axios from "axios";
import { getScrapedData } from "../../utils/routes";
import { CSVLink } from "react-csv";
import { FaFileDownload } from "react-icons/fa";
import { Select } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getGlobalData } from "./../../utils/routes";
import { toast } from "react-toastify";

const Table = (props) => {
  const [skip, setSkip] = useState(0);
  const [table, setTable] = useState("");
  const [data, setData] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { Option } = Select;

  useEffect(() => {
    const fetchData = async () => {
      let obj = JSON.parse(localStorage.getItem("link"));
      let url = obj.site;
      let data = await axios.get(
        `${getScrapedData}/?site=${url}&limit=20&skip=${skip}`
      );
      // console.log(list.data.result[id]);
      setTable(data.data.doc);
      setData(obj);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const handleSearch = async () => {
    // setShow(true);
    // setLoader(true);
    let obj = JSON.parse(localStorage.getItem("link"));
    let url = obj.site;
    try {
      let start = getFormattedDate(startDate);
      let end = getFormattedDate(endDate);
      let data = await axios.get(
        `${getGlobalData}/?site=${url}&start=${start}&end=${end}`
      );
      console.log(data);
      // setTable(data.data.doc);
      // setLoader(false);
    } catch (error) {
      // setShow(false);
      toast.error("Something went wrong");
    }
  };

  const getFormattedDate = (date) => {
    var todayTime = new Date(date);
    var day = todayTime.getDate();
    var month = todayTime.getMonth() + 1;
    var year = todayTime.getFullYear();
    return year + "-" + month + "-" + day;
  };

  const counter = (val) => {
    if (val === "pre") {
      setSkip(skip - 20);
    } else if (val === "next") setSkip(skip + 20);
  };

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
    <div className="fluid-container" style={{ backgroundColor: "#f9fafb" }}>
      <div className="container pt-5 pb-5">
        <div className="col-lg-12 mb-4">
          <p className="text-center h3 ">
            <strong>
              <span>{data ? data.title : null}</span>
            </strong>
          </p>
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div
              className={`card ${styles.cardEdit2}`}
              style={{
                overflowX: "scroll",
                height: "1000px",
                display: "block",
                overflowY: "hidden",
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
                        let date = tab.lastmod.substring(
                          0,
                          tab.lastmod.indexOf("T")
                        );
                        return (
                          <tr style={{ backgroundColor: "#f2f2f2" }} key={i}>
                            <td>{date}</td>
                            <td>
                              <a
                                href={tab.articlelink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {tab.articlelink}
                              </a>
                            </td>
                            <td>
                              <table className="table">
                                <tbody>
                                  {tab.externalLinks.length > 0 ? (
                                    tab.externalLinks.map((extLink, j) => {
                                      return (
                                        <tr key={j}>
                                          <td>
                                            <a
                                              href={extLink.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              {extLink.link}
                                            </a>
                                          </td>
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
          <div className="col-lg-4">
            <div className={`card p-3 mb-4 ${styles.cardEdit2}`}>
              <h5>
                <strong>Search by date</strong>
              </h5>
              <div className="col-lg-12 col-md-6 mt-2">
                <label>From:</label>
                <br />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  maxDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  scrollableMonthYearDropdown
                />
              </div>
              <div className="col-lg-12 col-md-6 mt-2">
                <label>To: </label>
                <br />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  scrollableMonthYearDropdown
                />
              </div>
              <div className="col-lg-12 mt-4">
                <p
                  className={`btn btn-outline-primary ${styles.prime_btn}`}
                  onClick={() => handleSearch()}
                >
                  Search
                </p>
              </div>
            </div>
            <div className={`card p-3 mb-4 ${styles.cardEdit2}`}>
              <h5>
                <strong>Filter</strong>
              </h5>
              <div className="row">
                <div className="col-lg-4 mx-auto">
                  <h5 className="text-center mt-1" htmlFor="">
                    Rel
                  </h5>
                </div>
                <div className="col-lg-8">
                  <Select
                    defaultValue="all"
                    style={{ width: "100%" }}
                    onChange={handleChange}
                  >
                    <Option value="all">All</Option>
                    <Option value="nofollow">Nofollow</Option>
                    <Option value="dofollow">Dofollow</Option>
                  </Select>
                </div>
              </div>
            </div>
            <div className={`card p-3 mb-4 ${styles.cardEdit2}`}>
              <h5>
                <strong>Download CSV</strong>
              </h5>
              <br />
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
};

export default Table;
