import React, { useEffect, useState } from "react";
import styles from "./externalLinks.module.css";
import axios from "axios";
import {
  getExternalLinks,
  changeStatusExtLink
} from "../../utils/routes";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Pagination, DatePicker, Button, Spin, Alert } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
const { RangePicker } = DatePicker;

const getFormattedDate = (date) => {
  var todayTime = new Date(date);
  var day = todayTime.getDate();
  var month = todayTime.getMonth() + 1;
  var year = todayTime.getFullYear();
  return year + "-" + month + "-" + day;
};


const ExternalLinks = () => {
  const [table, setTable] = useState("");
  const [downloadData, setDownloadData] = useState("");
  const [startDate, setStartDate] = useState(() => {
    return getFormattedDate(new Date());
  });
  const [endDate, setEndDate] = useState(() => {
    return getFormattedDate(new Date());
  });
  const [main, setMain] = useState(true);
  const [mainMeta, setMainMeta] = useState(0);
  const [loader, setLoader] = useState(true);
  const [pageNum, setPageNum] = useState(1)
  const pageSize = 20
  const [filename, setFilename] = useState("")
  const [buttonDisabled, setButtonDisabled] = useState(false);


  const setTableData = async () => {
    var query = ""
    var tempFilename = ""
    var skip = (pageNum - 1) * pageSize

    if (startDate !== "") {
      query += "start=" + startDate + "&"
      tempFilename += "-start_" + startDate
    }
    if (endDate !== "") {
      query += "end=" + endDate + "&"
      tempFilename += "-end_" + endDate
    }

    console.log(query)
    let data = await axios.get(
      `${getExternalLinks}?${query}limit=${pageSize}&skip=${skip}`
    );

    console.log(data)
    if (data.data.result.length === 0) {
      toast.error("No Data")
      setButtonDisabled(true)
    } else {
      setButtonDisabled(false)
    }

    generateCsv(data.data.result)
    setMainMeta(data.data.meta);

    console.log(data)
    setFilename(tempFilename)
    setTable(data.data.result);
    setMain(true);
    setLoader(false)
  }

  useEffect(() => {
    document.title = "External Links"
    const fetchData = async () => {
      try {
        // setLoader(true)
        setTableData()
        console.log('---------------')
      } catch (error) {
        console.log(error);
        setLoader(false)
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, pageNum ]);



  const handleDateChange = (date, d) => {
    setStartDate(d[0]);
    setEndDate(d[1]);
    setPageNum(1)
  };

  const onStatusChecked = async (extLink , status) => {
    try {
      await axios.get(
        `${changeStatusExtLink}?link=${extLink}&status=${status}`
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

  const csvHeader = ["Article-Link", "External-Link", "Date of Post" , "Count" , "Status"];
  const generateCsv = (data) => {
    if (data !== null) {
      setDownloadData("")
      let dupe = []
      dupe.push(csvHeader)
      for (let i = 0; i < data.length; i++) {
        var temp =[]
        temp.push(data[i].article_link)
        temp.push(data[i].externalLink)
        temp.push(getFormattedDate(data[i].lastmod))
        temp.push(data[i].count)
        if(data[i].status){
            temp.push("Verified")
        }else{
            temp.push("Not yet verified")
        }
        dupe.push(temp)
      }
      setDownloadData(dupe)
    }
    if (data === null) {
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
          <Spin tip="Loading...">
            <Alert
              message="External Links"
              description="Your data is loading..."
              type="info"
            />
          </Spin>

        </div>

      ) : (
          <div className="container pt-5 pb-5">
            <div className=" mb-4">
              {startDate === endDate ? (
                <p className="h3">
                  <strong>{startDate}</strong>
                </p>
              ) : (
                  <p className="h3">
                    <strong>{startDate + " to " + endDate}</strong>
                  </p>
                )}
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
                <div
                  className="col text-right"
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
                        <th scope="col">Count</th>
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
                                  href={tab.article_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {tab.article_link}
                                </a>
                              </td>
                              <td>
                              <a
                                  href={tab.externalLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {tab.externalLink}
                                </a>
                              </td>
                              <td>
                                {tab.externalLink_count}
                              </td>
                              <td>
                              <input
                                type="checkbox"
                                checked={tab.status}
                                  onChange={() => onStatusChecked(tab.externalLink , tab.status)}
                                >
                                </input>
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

export default ExternalLinks;