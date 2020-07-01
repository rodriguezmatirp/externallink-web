import React, { useEffect, useState } from "react";
import axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";
import { DatePicker, Button, Skeleton } from "antd";
import { getGlobalData } from "./../../utils/routes";
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
    <div className="fluid-container" style={{ backgroundColor: "#f9fafb" }}>
      <div className="container pt-5 pb-5">
        <div className="row mb-4">
          <div className="col-lg-6 text-right">
            <RangePicker onChange={handleDateChange} />
          </div>
          <div className="col-lg-6">
            <Button
              type="primary"
              size="default"
              onClick={() => handleSearch()}
              disabled={generateButton}
            >
              Generate CSV
            </Button>
          </div>
        </div>
        <div className="row pt-2 pb-4">
          <div className="col-lg-4">
            {startDate === endDate ? (
              <div className="h4">
                <strong>{startDate}</strong>
              </div>
            ) : (
              <div className="h4">
                <strong>{startDate + " to " + endDate}</strong>
              </div>
            )}
          </div>
          <div className="col-lg-8 text-right">
            <CSVLink data={data}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                size="default"
                disabled={buttonDisabled}
              >
                Download
              </Button>
            </CSVLink>

            {/* <CSVLink data={data}>
              <FaCloudDownloadAlt
                style={{
                  fontSize: 28,
                  marginBottom: 8,
                }}
              />{" "}
              Export
            </CSVLink> */}
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
                                style={{ backgroundColor: "#f2f2f2" }}
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
