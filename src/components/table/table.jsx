
import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import axios from "axios";
import {
  changeStatus,
  getData
} from "../../utils/routes";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Pagination, Checkbox, DatePicker, Button } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
const { RangePicker } = DatePicker;


const options = [
  { label: "Dofollow", value: "Dofollow" },
  { label: "Nofollow", value: "Nofollow" }
];

const Table = () => {
  const [table, setTable] = useState("");
  const [Data, setData] = useState("");
  const [downloadData, setDownloadData] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dofollow, setDofollow] = useState(true);
  const [nofollow, setNofollow] = useState(true);
  const [main, setMain] = useState(true);
  const [mainMeta, setMainMeta] = useState(0);
  const [loader, setLoader] = useState(true);
  const [pageNum, setPageNum] = useState(1)
  const pageSize = 20
  const [filename, setFilename] = useState("")
  const [buttonDisabled, setButtonDisabled] = useState(false);


  const setTableData = async () => {
    let obj = JSON.parse(localStorage.getItem("link"));
    let url = obj.site;
    document.title = url
    var query = ""
    var tempFilename = url

    if (!dofollow && !nofollow) {
      setTable(null)
      setButtonDisabled(true)
      toast.error("No data")
      return
    }
    if (nofollow && !dofollow) {
      query += "type=nofollow&"
      tempFilename +="-nofollow"
    } else if (!nofollow && dofollow) {
      query += "type=dofollow&"
      tempFilename +="-dofollow"
    }

    if (startDate !== "") {
      query += "start=" + startDate + "&"
      tempFilename += "-start_" + startDate
    }
    if (endDate !== "") {
      query += "end=" + endDate + "&"
      tempFilename +="-end_"  + endDate
    }

    if (url) {
      query += "link=" + url + "&"
    }
    console.log(query)
    let data = await axios.get(
      `${getData}/?${query}`
    );

    if(data.data.result.length === 0){
      toast.error("No Data")
      setButtonDisabled(true)
    }

    let expandedResult = [];

    for (let websiteData of data.data.result) {
      for (let externalLink of websiteData.externalLinks) {
        let cpy = JSON.parse(JSON.stringify(websiteData));
        cpy["externalLinks"] = [externalLink];
        expandedResult.push(cpy);
      }
    }

    generateCsv(expandedResult)
    setMainMeta(expandedResult.length);
    expandedResult = expandedResult.slice((pageNum - 1) * pageSize, (pageNum * pageSize))

    console.log(data)
    setFilename(tempFilename)
    setTable(expandedResult);
    setData(obj);
    setMain(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTableData()
        console.log('---------------')
        setLoader(false)
      } catch (error) {
        console.log(error);
        setLoader(false)
      }
    };
    fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, nofollow, dofollow, pageNum ]);



  const handleDateChange = (date, d) => {
    setStartDate(d[0]);
    setEndDate(d[1]);
    setPageNum(1)
  };

  const handleFollowChange = (e) => {
    console.log(e)
    setPageNum(1)
    setNofollow(false)
    setDofollow(false)
    for (let x of e) {
      console.log(x)
      if (x === "Nofollow") {
        setNofollow(true)
      } else if (x === "Dofollow") {
        setDofollow(true)
      }
    }
  };

  const onStatusChecked = async (link, parent_link) => {
    try {
      await axios.get(
        `${changeStatus}?link=${link}&parent=${parent_link}`
      )
      setTableData()
    } catch (e) {
      console.log(e)
    }
  }

  const handlePageChange = async (p, ps) => {
    setPageNum(p)
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  const getFormattedDate = (date) => {
    var todayTime = new Date(date);
    var day = todayTime.getDate();
    var month = todayTime.getMonth() + 1;
    var year = todayTime.getFullYear();
    return year + "-" + month + "-" + day;
  };

  const csvHeader = ["Article-Link", "External-Link", "Title", "Rel", "Date of Post"];
  const generateCsv = (data) => {
    if (data !== null) {
      setDownloadData("")
      let dupe = []
      dupe.push(csvHeader)
      for (let i = 0; i < data.length; i++) {
        let arr = data[i].externalLinks;
        for (let j = 0; j < arr.length; j++) {
          var temp = [];
          temp.push(data[i].articlelink);
          temp.push(arr[j].link);
          temp.push(arr[j].text)
          if (arr[j].rel === undefined) {
            temp.push("doFollow");
          } else {
            temp.push(arr[j].rel);
          }
          temp.push(getFormattedDate(data[i].lastmod));
          dupe.push(temp);
        }
      }
      setDownloadData(dupe)
    }
    if(data === null){
      toast.error("No data")
    }
  };


  console.log(table);

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
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                </button>
                </div>
                <div className="col-lg-4 text-center">
                  <Checkbox.Group
                    options={options}
                    onChange={handleFollowChange}
                    defaultValue={["Nofollow", "Dofollow"]}
                  />
                </div>
                <div
                  className="col-lg-3 text-right"
                >
                  <CSVLink filename={filename + '.csv'} data={downloadData}>
                    <Button
                      type="primary"
                      icon={<FaCloudDownloadAlt style={{ fontSize: "26px", paddingRight: "10px" }} />}
                      size="default"
                      disabled={buttonDisabled}
                    >
                      Export
                    </Button>
                  </CSVLink>
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
                        <th scope="col">Index</th>
                        <th scope="col">Date</th>
                        <th scope="col">Website</th>
                        <th scope="col">External Links</th>
                        <th scope="col">Title</th>
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
                              <td >
                                <div style={{ display: 'flex', justifyContent: "center" }}>
                                  {((pageNum - 1) * pageSize) + i + 1}
                                </div>
                              </td>
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
                                {tab.externalLinks.length > 0 ? (
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
                                  )}
                              </td>
                              <td>
                                {tab.externalLinks.length > 0 ? (
                                  tab.externalLinks.map((extLink, j) => {
                                    return (
                                      <p key={j}>
                                        {extLink.text}
                                      </p>
                                    );
                                  })
                                ) : (
                                    <p>No text</p>
                                  )}
                              </td>
                              <td>
                                {tab.externalLinks.length > 0 ? (
                                  tab.externalLinks.map((extLink, j) => {
                                    return (<p key={j}>
                                      {extLink.rel
                                        ? extLink.rel
                                        : "dofollow"}</p>
                                    );
                                  })
                                ) : (
                                    <p>--</p>
                                  )}
                              </td>
                              <td>
                                {tab.externalLinks.length > 0 ? (
                                  tab.externalLinks.map((extLink, j) => {
                                    return (<input key={j}
                                      type="checkbox"
                                      checked={extLink.status}
                                      onChange={() => onStatusChecked(extLink.link, tab.articlelink)}
                                    ></input>
                                    );
                                  })
                                ) : (
                                    <p>--</p>
                                  )}
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
                    (main && mainMeta)
                  }
                  pageSize={pageSize}
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