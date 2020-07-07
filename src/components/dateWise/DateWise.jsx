import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { DatePicker, Button, Skeleton } from "antd";
import {
  getGlobalData,
  changeStatus
} from "./../../utils/routes";
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

const DateWise = () => {
  const [table, setTable] = useState("");
  const [startDate, setStartDate] = useState(() => {
    return getFormattedDate(new Date());
  });
  const [endDate, setEndDate] = useState(() => {
    return getFormattedDate(new Date());
  });
  const [data, setData] = useState("");
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [generateButton, setGenerateButton] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setShowSkeleton(true);
      setGenerateButton(true);
      try {
        let todayData = await axios.get(
          `${getGlobalData}/?site=global&start=${startDate}&end=${endDate}`
        );
        let cpyResult = [];

        for (let websiteData of todayData.data.doc.result) {
          for (let externalLink of websiteData.externalLinks) {
            if (externalLink.link !== undefined) {
              let cpy = JSON.parse(JSON.stringify(websiteData));
              cpy["externalLinks"] = [externalLink];
              cpyResult.push(cpy);
            }
          }
        }
        console.log(cpyResult)
        todayData.data.doc.result = cpyResult;
        setTable(todayData.data.doc.result);
        setShowSkeleton(false);
        setGenerateButton(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleDateChange = (date, d) => {
    setStartDate(d[0]);
    setEndDate(d[1]);
  };

  const csvData = [["article-Link", "External-Link", "Rel", "Date of Post"]];
  const generateCsv = (data) => {
    for (let i = 0; i < data.length; i++) {
      let arr = data[i].externalLinks;
      for (let j = 0; j < arr.length; j++) {
        var temp = [];
        temp.push(data[i].articlelink);
        temp.push(arr[j].link);
        if (arr[j].rel === undefined) {
          temp.push("Not-Defined");
        } else {
          temp.push(arr[j].rel);
        }
        temp.push(getFormattedDate(data[i].lastmod));
        csvData.push(temp);
      }
    }
    return csvData;
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

  const handleSearch = async () => {
    setButtonDisabled(true);
    if (table) {
      try {
        if (table.length !== 0) {
          let response = await generateCsv(table);
          setData(response);
          toast.success("Creating CSV");
          setButtonDisabled(false);
        } else {
          setButtonDisabled(true);
          toast.error("No data to generate");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div className="fluid-container" style={{ backgroundColor: "#f5f5f0" }}>
      <div className="container pt-5 pb-5">
        <div className="mb-4">
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
            <div className="col-lg-3">
              <Button
                type="primary"
                size="default"
                onClick={() => handleSearch()}
                disabled={generateButton}
              >
                Generate CSV
            </Button>
            </div>
            <div className="col text-right">
              <CSVLink data={data}>
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
          <Skeleton loading={showSkeleton} active>
            <div className="col-lg-12">
              {table.length !== 0 ? (
                <div
                  style={{
                    overflowX: "scroll",
                    height: "100%",
                    display: "block",
                    overflowY: "hidden",
                  }}
                >
                  <table className="table " border="1">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Site</th>
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
                              style={{ backgroundColor: "#fff" }}
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
                                      <p key={j}>{extLink.rel ? extLink.rel : "dofollow"}</p>
                                    );
                                  })
                                ) : (
                                    <p>--</p>
                                  )}
                              </td>
                              <td>
                                {tab.externalLinks.length > 0 ? (
                                  tab.externalLinks.map((extLink, j) => {
                                    return (
                                      <input key={j}
                                        type="checkbox"
                                        checked={extLink.status}
                                        onChange={() => onStatusChecked(extLink.link, tab.articlelink, extLink.status)}
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
              ) : (
                  <div style={{ textAlign: "center" }}>
                    No data. Scrap to see data
                </div>
                )}
            </div>
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export default DateWise;
