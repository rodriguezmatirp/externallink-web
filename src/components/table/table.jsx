import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import axios from "axios";
import { getScrapedData, getFilterData } from "../../utils/routes";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Pagination, Checkbox, DatePicker } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import { getGlobalData, getCSVData } from "./../../utils/routes";
import { toast } from "react-toastify";
const { RangePicker } = DatePicker;

// const getFormattedDate = (date) => {
//   var todayTime = new Date(date);
//   var day = todayTime.getDate();
//   var month = todayTime.getMonth() + 1;
//   var year = todayTime.getFullYear();
//   return year + "-" + month + "-" + day;
// };

const options = [
  { label: "Dofollow", value: "Dofollow" },
  { label: "Nofollow", value: "Nofollow" },
];

const Table = () => {
  const [table, setTable] = useState("");
  const [Data, setData] = useState("");
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
  const [title, setTitle] = useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      let obj = JSON.parse(localStorage.getItem("link"));
      let url = obj.site;
      let titl = obj.title.replace(" ", "");
      try {
        let data = await axios.get(
          `${getScrapedData}/?site=${url}&limit=20&skip=0`
        );

        await axios.get(
          `${getCSVData}?site=${encodeURIComponent(url)}&title=${titl}`
        );
        setTable(data.data.doc.result);
        setMainMeta(data.data.doc.meta);
        setData(obj);
        setMain(true);
        setTitle(titl);
        setLoader(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (date, d) => {
    setStartDate(d[0]);
    setEndDate(d[1]);
  };

  const handleFollowChange = async (e) => {
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
    if (e[0] === "Nofollow") {
      setAll(false);
      setNofollow(true);
      setDofollow(false);
    }
    if (e[0] === "Dofollow") {
      setAll(false);
      setNofollow(false);
      setDofollow(true);
    }
    if (e[0] === undefined) {
      setAll(true);
      setNofollow(false);
      setDofollow(false);
    }
  };

  const handleSearch = async () => {
    setLoader(true);
    let obj = JSON.parse(localStorage.getItem("link"));
    let url = obj.site;
    try {
      let data = await axios.get(
        `${getGlobalData}/?site=${url}&start=${startDate}&end=${endDate}&limit=20&skip=0`
      );
      setSearchMeta(data.data.doc.meta);
      setSearch(true);
      setMain(false);
      setFilter(false);
      setNofollow(false);
      setDofollow(false);
      setTable(data.data.doc.result);
      setLoader(false);
    } catch (error) {
      setLoader(false);
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
        let data = await axios.get(
          `${getGlobalData}/?site=${url}&start=${startDate}&end=${endDate}&limit=20&skip=${skip}`
        );
        setSearchMeta(data.data.doc.meta);
        setTable(data.data.doc.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // let result = [["published_date", "articlelink", "externalLinks"]];
  // let CsvOperation = async (table) => {
  //   let i = 0;

  //   for (i = 0; i < table.length; i++) {
  //     let j = 0;
  //     let links = [];
  //     for (j = 0; j < table[i].externalLinks.length; j++) {
  //       let link =
  //         "link " +
  //         (j + 1) +
  //         " :- " +
  //         table[i].externalLinks[j].link +
  //         "  , rel:-" +
  //         table[i].externalLinks[j].rel +
  //         "\n";

  //       links.push([link]);
  //     }
  //     var dateobj = new Date(table[i].created_at.toString());
  //     result.push([dateobj.toString(), table[i].articlelink, links]);
  //   }
  // };
  // CsvOperation(table);

  return (
    <div className="fluid-container" style={{ backgroundColor: "#f9fafb" }}>
      {loader ? (
        <div
          className="text-center"
          style={{ paddingTop: "300px", paddingBottom: "300px" }}
        >
          <img
            className="img-fluid"
            src="./assets/images/loader.gif"
            alt="loader"
            width="80"
          />
        </div>
      ) : (
        <div className="container pt-5 pb-5">
          <div className=" mb-4">
            <p className="h3 ">
              <strong>
                External Link to <span>{Data ? Data.title : null}</span>
              </strong>
            </p>
            <div className="row pt-2">
              <div className="col-lg-3">
                <RangePicker onChange={handleDateChange} />
              </div>
              <div className="col-lg-2">
                <button
                  className={`btn ${styles.prime_btn}`}
                  onClick={() => handleSearch()}
                >
                  Done
                </button>
              </div>
              <div className="col-lg-4 text-center">
                <Checkbox.Group
                  options={options}
                  onChange={handleFollowChange}
                />
                {/* <Checkbox onChange={handleFollowChange} value={["Dofollow"]}>
                  Dofollow
                </Checkbox>
              </div>
              <div className="col-lg-2">
                <Checkbox onChange={handleFollowChange} value={["Nofollow"]}>
                  Nofollow
                </Checkbox> */}
              </div>
              <div
                className="col-lg-3 text-right"
                style={{ cursor: "pointer" }}
                // onClick={downloadCSV}
              >
                <a href={`http://localhost:3000/ftp/uploads/${title}.csv`}>
                  <FaCloudDownloadAlt style={{ fontSize: "28px" }} /> Export
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div
                style={{
                  overflowX: "scroll",
                  height: "100%",
                  display: "block",
                  overflowY: "hidden",
                }}
              >
                <table className="table " border="1">
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
                            <tr
                              style={{
                                backgroundColor: "#f2f2f2",
                              }}
                              key={i}
                            >
                              {/* <td>
                              <Checkbox
                                key={i}
                                checked={tab.checked.includes(Data.user.id)}
                                onChange={() => handleCheck(tab._id)}
                              ></Checkbox>
                            </td> */}
                              <td style={{ width: "60%" }}>{date}</td>
                              <td style={{ width: "100%" }}>
                                <a
                                  href={tab.articlelink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {Data.title}
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
          </div>
          <div className="col-lg-12 mt-5">
            <div className="col-lg-6 text-center mx-auto">
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
      )}
    </div>
  );
};

export default Table;
