import React, { useEffect, useState, useContext } from "react";
import styles from "./table.module.css";
import axios from "axios";
import {
  getScrapedData,
  getFilterData,
  checkArticle,
} from "../../utils/routes";
import { CSVLink } from "react-csv";
import { FaFileDownload } from "react-icons/fa";
import { Select } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getGlobalData } from "./../../utils/routes";
import { toast } from "react-toastify";
import { Checkbox } from "antd";
import { AuthContext } from "./../../contexts/userContext";
import { Pagination } from "antd";

const getFormattedDate = (date) => {
  var todayTime = new Date(date);
  var day = todayTime.getDate();
  var month = todayTime.getMonth() + 1;
  var year = todayTime.getFullYear();
  return year + "-" + month + "-" + day;
};

const Table = (props) => {
  const [table, setTable] = useState("");
  const [data, setData] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [all, setAll] = useState(true);
  const [dofollow, setDofollow] = useState(false);
  const [nofollow, setNofollow] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchMeta, setSearchMeta] = useState(0);
  const [main, setMain] = useState(true);
  const [mainMeta, setMainMeta] = useState(0);
  const [filter, setFilter] = useState(false);
  const [filterMeta, setFilterMeta] = useState(0);
  const Data = useContext(AuthContext);
  const { Option } = Select;

  useEffect(() => {
    const fetchData = async () => {
      let obj = JSON.parse(localStorage.getItem("link"));
      let url = obj.site;
      let data = await axios.get(
        `${getScrapedData}/?site=${url}&limit=20&skip=0`
      );
      setTable(data.data.doc.result);
      setMainMeta(data.data.doc.meta);
      setData(obj);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = async (value) => {
    let obj = JSON.parse(localStorage.getItem("link"));
    let url = obj.site;
    let filterData = await axios.get(
      `${getFilterData}/?site=${url}&limit=20&skip=0`
    );
    setFilterMeta(filterData.data.meta);
    setFilter(true);
    setMain(false);
    setSearch(false);
    setTable(filterData.data.doc);
    if (value === "nofollow") {
      setAll(false);
      setNofollow(true);
      setDofollow(false);
    }
    if (value === "dofollow") {
      setAll(false);
      setNofollow(false);
      setDofollow(true);
    }
    if (value === "all") {
      setAll(true);
      setNofollow(false);
      setDofollow(false);
    }
  };

  const handleCheck = async (id) => {
    const body = {
      article_id: id,
    };
    try {
      const response = await axios.post(checkArticle, body, {
        headers: { "x-auth-token": Data.token },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    // setShow(true);
    // setLoader(true);
    let obj = JSON.parse(localStorage.getItem("link"));
    let url = obj.site;
    try {
      let start = getFormattedDate(startDate);
      let end = getFormattedDate(endDate);
      let data = await axios.get(
        `${getGlobalData}/?site=${url}&start=${start}&end=${end}&limit=20&skip=0`
      );
      console.log(data);
      setSearchMeta(data.data.doc.meta);
      setSearch(true);
      setMain(false);
      setFilter(false);
      setTable(data.data.doc.result);
      // setTable(data.data.doc);
      // setLoader(false);
    } catch (error) {
      // setShow(false);
      toast.error("Something went wrong");
    }
  };

  const handlePageChange = async (p, ps) => {
    let obj = JSON.parse(localStorage.getItem("link"));
    let url = obj.site;
    let skip = (p - 1) * ps;
    try {
      if (main) {
        let data = await axios.get(
          `${getScrapedData}/?site=${url}&limit=20&skip=${skip}`
        );
        setTable(data.data.doc.result);
      }
      if (filter) {
        let filterData = await axios.get(
          `${getFilterData}/?site=${url}&limit=20&skip=${skip}`
        );
        setTable(filterData.data.doc);
      }
      if (search) {
        let start = getFormattedDate(startDate);
        let end = getFormattedDate(endDate);
        let data = await axios.get(
          `${getGlobalData}/?site=${url}&start=${start}&end=${end}&limit=20&skip=${skip}`
        );
        console.log(data);
        setSearchMeta(data.data.doc.meta);
        setTable(data.data.doc.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const counter = async (val) => {
  //   if (val === "pre") {
  //     setSkip(skip - 20);
  //     if (main) {
  //       let obj = JSON.parse(localStorage.getItem("link"));
  //       let url = obj.site;
  //       let data = await axios.get(
  //         `${getScrapedData}/?site=${url}&limit=20&skip=${skip}`
  //       );
  //       setTable(data.data.doc);
  //     }
  //   } else if (val === "next") {
  //     setSkip(skip + 20);
  //     if (main) {
  //       let obj = JSON.parse(localStorage.getItem("link"));
  //       let url = obj.site;
  //       let data = await axios.get(
  //         `${getScrapedData}/?site=${url}&limit=20&skip=${skip}`
  //       );
  //       setTable(data.data.doc);
  //     }
  //   }
  // };

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
          <div className="col-lg-9">
            <div
              style={{
                overflowX: "scroll",
                height: "1000px",
                display: "block",
                overflowY: "hidden",
              }}
            >
              <table className="table " border="1">
                <thead>
                  <tr>
                    <th scope="col"></th>
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
                            <td>
                              <Checkbox
                                onChange={() => handleCheck(tab._id)}
                                defaultChecked={
                                  tab.checked.includes(Data.user.id) === true
                                    ? true
                                    : false
                                }
                              ></Checkbox>
                            </td>
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
                                  {all ? (
                                    tab.externalLinks.length > 0 ? (
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
                                    )
                                  ) : null}
                                  {nofollow ? (
                                    tab.nofollow.length > 0 ? (
                                      tab.nofollow.map((noFollowLink, j) => {
                                        return (
                                          <tr key={j}>
                                            <td>
                                              <a
                                                href={noFollowLink.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                {noFollowLink.link}
                                              </a>
                                            </td>
                                            <td>{noFollowLink.rel}</td>
                                          </tr>
                                        );
                                      })
                                    ) : (
                                      <tr>
                                        <td>No External Links</td>
                                      </tr>
                                    )
                                  ) : null}
                                  {dofollow ? (
                                    tab.dofollow.length > 0 ? (
                                      tab.dofollow.map((doFollowLink, j) => {
                                        return (
                                          <tr key={j}>
                                            <td>
                                              <a
                                                href={doFollowLink.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                {doFollowLink.link}
                                              </a>
                                            </td>
                                            <td>{doFollowLink.rel}</td>
                                          </tr>
                                        );
                                      })
                                    ) : (
                                      <tr>
                                        <td>No External Links</td>
                                      </tr>
                                    )
                                  ) : null}
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
          <div className="col-lg-3">
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
            {/* <div className={styles.pagination}>
              {skip > 0 ? <p onClick={() => counter("pre")}>❮</p> : null}
              {table.length < 20 ? null : (
                <p onClick={() => counter("next")}>❯</p>
              )}
            </div> */}
            <Pagination
              defaultCurrent={1}
              total={
                (main && mainMeta) ||
                (search && searchMeta) ||
                (filter && filterMeta)
              }
              pageSize={20}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
