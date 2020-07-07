import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import axios from "axios";
import {
  getScrapedData,
  getFilterData,
  getGlobalData,
  getCSVData,
  getDownloadCSV,
  changeStatus
} from "../../utils/routes";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Pagination, Checkbox, DatePicker } from "antd";
import "react-datepicker/dist/react-datepicker.css";
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
  { label: "Nofollow", value: "Nofollow" }
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
        let cpyResult = [];

        for (let websiteData of data.data.doc.result) {
          for (let externalLink of websiteData.externalLinks) {
            let cpy = JSON.parse(JSON.stringify(websiteData));
            if (externalLink.link !== undefined) {
              cpy["externalLinks"] = [externalLink];
              cpyResult.push(cpy);
            }
          }
        }

        data.data.doc.result = cpyResult;
        // console.log(data)
        setTable(data.data.doc.result);
        setMainMeta(data.data.doc.meta);
        setData(obj);
        setMain(true);
        setTitle(titl);
        setLoader(false);
        await axios.get(
          `${getCSVData}?site=${encodeURIComponent(url)}&title=${titl}`
        );
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
    console.log(filterData)
    let cpyResult = [];

    for (let websiteData of filterData.data.doc) {
      if (websiteData.dofollow != null) {
        for (let dofollow of websiteData.dofollow) {
          let cpy = JSON.parse(JSON.stringify(websiteData));
          if (dofollow.link !== undefined) {
            cpy["dofollow"] = [dofollow];
            cpyResult.push(cpy);
          }
        }
      } else if (websiteData.nofollow != null) {
        for (let nofollow of websiteData.nofollow) {
          let cpy = JSON.parse(JSON.stringify(websiteData));
          if (nofollow.link !== undefined) {
            cpy["nofollow"] = [nofollow];
            cpyResult.push(cpy);
          }
        }
      }
    }

    filterData.data.doc = cpyResult;
    setFilterMeta(filterData.data.meta);
    setFilter(true);
    setMain(false);
    setSearch(false);
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
      window.location.reload()
      setAll(true);
      setNofollow(false);
      setDofollow(false);
    }

    setTable(filterData.data.doc);
  };


  const handleSearch = async () => {
    setLoader(true);
    let obj = JSON.parse(localStorage.getItem("link"));
    let url = obj.site;
    try {
      let data = await axios.get(
        `${getGlobalData}/?site=${url}&start=${startDate}&end=${endDate}&limit=20&skip=0`
      );
      console.log(data)
      let cpyResult = [];

      for (let websiteData of data.data.doc.result) {
        for (let externalLink of websiteData.externalLinks) {
          let cpy = JSON.parse(JSON.stringify(websiteData));
          if (externalLink.link !== undefined) {
            cpy["externalLinks"] = [externalLink];
            cpyResult.push(cpy);
          }
        }
      }

      data.data.doc.result = cpyResult;
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


  const onStatusChecked = async (link, parent_link, check) => {
    try {
      let data = await axios.get(
        `${changeStatus}?link=${link}&parent=${parent_link}`
      )
      let dataCpy = []
      dataCpy.push(data.data.doc.result)
      let cpyResult = []
      for (let websiteData of dataCpy) {
        for (let externalLink of websiteData.externalLinks) {
          let cpy = JSON.parse(JSON.stringify(websiteData));
          if (externalLink.link !== undefined) {
            cpy["externalLinks"] = [externalLink];
            cpyResult.push(cpy);
          }
        }
      }

      dataCpy = cpyResult;
      setTable(dataCpy);
    } catch (e) {
      console.log(e)
    }
  }

  const handlePageChange = async (p, ps) => {
    let obj = JSON.parse(localStorage.getItem("link"));
    let url = obj.site;
    let skip = (p - 1) * ps;
    try {
      if (main) {
        let data = await axios.get(
          `${getScrapedData}/?site=${url}&limit=20&skip=${skip}`
        );
        let cpyResult = [];

        for (let websiteData of data.data.doc.result) {
          for (let externalLink of websiteData.externalLinks) {
            let cpy = JSON.parse(JSON.stringify(websiteData));
            if (externalLink.link !== undefined) {
              cpy["externalLinks"] = [externalLink];
              cpyResult.push(cpy);
            }
          }
        }

        data.data.doc.result = cpyResult;
        setTable(data.data.doc.result);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      }
      if (filter) {
        let filterData = await axios.get(
          `${getFilterData}/?site=${url}&limit=20&skip=${skip}`
        );
        let cpyResult = [];

        for (let websiteData of filterData.data.doc) {
          if (websiteData.dofollow != null) {
            for (let dofollow of websiteData.dofollow) {
              let cpy = JSON.parse(JSON.stringify(websiteData));
              if (dofollow.link !== undefined) {
                cpy["dofollow"] = [dofollow];
                cpyResult.push(cpy);
              }
            }
          } else if (websiteData.nofollow != null) {
            for (let nofollow of websiteData.nofollow) {
              let cpy = JSON.parse(JSON.stringify(websiteData));
              if (nofollow.link !== undefined) {
                cpy["nofollow"] = [nofollow];
                cpyResult.push(cpy);
              }
            }
          }
        }

        filterData.data.doc = cpyResult;
        setTable(filterData.data.doc);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      }
      if (search) {
        let data = await axios.get(
          `${getGlobalData}/?site=${url}&start=${startDate}&end=${endDate}&limit=20&skip=${skip}`
        );
        let cpyResult = [];

        for (let websiteData of data.data.doc.result) {
          for (let externalLink of websiteData.externalLinks) {
            let cpy = JSON.parse(JSON.stringify(websiteData));
            if (externalLink.link !== undefined) {
              cpy["externalLinks"] = [externalLink];
              cpyResult.push(cpy);
            }
          }
        }

        data.data.doc.result = cpyResult;
        setSearchMeta(data.data.doc.meta);
        setTable(data.data.doc.result);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(table);

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
    <div className="fluid-container" style={{ backgroundColor: "#f5f5f0" }}>
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
                    defaultValue={["Nofollow" , "Dofollow"]}
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
                  <a href={`${getDownloadCSV}/${title}.csv`}>
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
                  <table className="table" border="1">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Website</th>
                        <th scope="col">External Links</th>
                        <th scope="col">Type</th>
                        <th scope="col">Status</th>
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
                                backgroundColor: "#fff",
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
                              <td style={{ width: "60%" }}>
                                <a
                                  href={tab.articlelink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {tab.articlelink}
                                </a>
                              </td>
                              <td>
                                {all ? (
                                  tab.externalLinks.length > 0 ? (
                                    tab.externalLinks.map((extLink, j) => {
                                      return (
                                        <p key={j}><a
                                          href={extLink.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {extLink.link}
                                        </a></p>
                                      );
                                    })
                                  ) : (
                                      <p>No External Links</p>
                                    )
                                ) : null}
                                {nofollow ? (
                                  tab.nofollow.length > 0 ? (
                                    tab.nofollow.map((noFollowLink, j) => {
                                      return (
                                        <p key={j}><a
                                          href={noFollowLink.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {noFollowLink.link}
                                        </a></p>
                                      );
                                    })
                                  ) : (
                                      <p>No External Links</p>
                                    )
                                ) : null}
                                {dofollow ? (
                                  tab.dofollow.length > 0 ? (
                                    tab.dofollow.map((doFollowLink, j) => {
                                      return (
                                        <p key={j}><a
                                          href={doFollowLink.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {doFollowLink.link}
                                        </a></p>
                                      );
                                    })
                                  ) : (
                                      <p>No External Links</p>
                                    )
                                ) : null}
                              </td>
                              <td>
                                {all ? (
                                  tab.externalLinks.length > 0 ? (
                                    tab.externalLinks.map((extLink, j) => {
                                      return (<p key={j}>
                                        {extLink.rel
                                          ? extLink.rel
                                          : "dofollow"}</p>
                                      );
                                    })
                                  ) : (
                                      <p>--</p>
                                    )
                                ) : null}
                                {nofollow ? (
                                  tab.nofollow.length > 0 ? (
                                    tab.nofollow.map((noFollowLink, j) => {
                                      return (
                                        <p key={j}>{noFollowLink.rel}</p>
                                      );
                                    })
                                  ) : (
                                      <p>--</p>
                                    )
                                ) : null}
                                {dofollow ? (
                                  tab.dofollow.length > 0 ? (
                                    tab.dofollow.map((doFollowLink, j) => {
                                      return (
                                        <p key={j}>{doFollowLink.rel}</p>
                                      );
                                    })
                                  ) : (
                                      <p>--</p>
                                    )
                                ) : null}
                              </td>
                              <td>{all ? (
                                tab.externalLinks.length > 0 ? (
                                  tab.externalLinks.map((extLink, j) => {
                                    return (<input key={j}
                                      type="checkbox"
                                      checked={extLink.status}
                                      onChange={() => onStatusChecked(extLink.link, tab.articlelink, extLink.status)}
                                    ></input>
                                    );
                                  })
                                ) : (
                                    <p>--</p>
                                  )
                              ) : null}
                                {nofollow ? (
                                  tab.nofollow.length > 0 ? (
                                    tab.nofollow.map((noFollowLink, j) => {
                                      return (
                                        <input key={j}
                                          type="checkbox"
                                          checked={noFollowLink.status}
                                          onChange={() => onStatusChecked(noFollowLink.link, tab.articlelink, noFollowLink.status)}
                                        ></input>
                                      );
                                    })
                                  ) : (
                                      <p>--</p>
                                    )
                                ) : null}
                                {dofollow ? (
                                  tab.dofollow.length > 0 ? (
                                    tab.dofollow.map((doFollowLink, j) => {
                                      return (
                                        <input key={j}
                                          type="checkbox"
                                          checked={doFollowLink.status}
                                          onChange={() => onStatusChecked(doFollowLink.link, tab.articlelink, doFollowLink.status)}
                                        ></input>
                                      );
                                    })
                                  ) : (
                                      <p>--</p>
                                    )
                                ) : null}</td>
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
