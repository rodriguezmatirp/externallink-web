import React, { useEffect, useState } from "react";
import styles from "./datewise.module.css";
import axios from "axios";
import {
  changeStatus,
  getData
} from "../../utils/routes";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Pagination, Checkbox, DatePicker, Button, Spin, Alert , Table } from "antd";
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

const options = [
  { label: "Dofollow", value: "Dofollow" },
  { label: "Nofollow", value: "Nofollow" }
];

const DateWise = () => {
  const [table, setTable] = useState("");
  const [downloadData, setDownloadData] = useState("");
  const [startDate, setStartDate] = useState(() => {
    return getFormattedDate(new Date());
  });
  const [endDate, setEndDate] = useState(() => {
    return getFormattedDate(new Date());
  });
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
    var query = ""
    var tempFilename = ""

    if (!dofollow && !nofollow) {
      setTable(null)
      setButtonDisabled(true)
      toast.error("No data")
      return
    }
    if (nofollow && !dofollow) {
      query += "type=nofollow&"
      tempFilename += "-nofollow"
    } else if (!nofollow && dofollow) {
      query += "type=dofollow&"
      tempFilename += "-dofollow"
    }

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
      `${getData}/?${query}skip=${(pageNum-1)*pageSize}&limit=${pageSize}`
    );

    if (data.data.result.externalLinks.length === 0) {
      toast.error("No Data")
      setButtonDisabled(true)
    } else {
      setButtonDisabled(false)
    }

    generateCsv(data.data.result.externalLinks)
    setMainMeta(data.data.result.totalCount);
    // data.data.result.externalLinks = data.data.result.externalLinks.slice((pageNum - 1) * pageSize, (pageNum * pageSize))

    console.log(data)
    setFilename(tempFilename)
    setTable(data.data.result.externalLinks);
    setMain(true);
    setLoader(false)
  }

  useEffect(() => {
    document.title = "Datewise"
    const fetchData = async () => {
      try {
        // setLoader(true)
        setTableData()
        // console.log('---------------')
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

  const onStatusChecked = async (linkId, status) => {
    try {
      var changedStatus = !status
      await axios.get(
        `${changeStatus}?linkId=${linkId}&status=${changedStatus}`
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

  const csvHeader = ["Article-Link", "External-Link", "Title", "Rel", "Date of Post"];
  const generateCsv = (data) => {
    if (data !== null) {
      setDownloadData("")
      let dupe = []
      dupe.push(csvHeader)
      for (let i = 0; i < data.length; i++) {
        var temp = [];
        temp.push(data[i].articleLink);
        temp.push(data[i].externalLink);
        temp.push(data[i].anchorText)
        temp.push(data[i].rel);
        temp.push(getFormattedDate(data[i].lastModified));
        dupe.push(temp);
      }
    setDownloadData(dupe)
  }
  if (data === null) {
    toast.error("No data")
  }
};
const TableHeader = [
  {
    title: 'Index',
    dataIndex: 'index',
    width: 50,
    align: 'center'
  }
  ,{
   title: 'Date',
      dataIndex: 'date',
      width: 60,
      align: 'center'
  },
  {
      title: 'Website',
      dataIndex: 'website',
      width: 100,
      align: 'center',
      render : (website) =>
      <a 
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      >{website}</a>
  },
  {
      title: 'External Links',
      dataIndex: 'extLink',
      width: 100,
      align: 'left',
      render : (website) =>
      <a 
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      >{website}</a>
  },
  {
      title: 'Title',
      dataIndex: 'title',
      width: 60,
      align: 'center'
  },
  {
      title: 'Type',
      dataIndex: 'rel',
      width: 60,
      align: 'center'
  },
  {
      title: 'Status',
      dataIndex: 'status',
      fixed: 'right',
      width: 50,
      align: 'center',
      render: (tab) => <input
      type="checkbox"
      checked={tab.status}
      onChange={() => onStatusChecked(tab._id, tab.status)}
    ></input>,   
  }
];
var dateWiseTable = []
var i = ((pageNum - 1) * pageSize) ;  
for (let item in table) {
i += 1 
dateWiseTable.push({
      key: item,
      index : i , 
      date :new Date(table[item]["lastModified"]).toLocaleDateString(),
      website : table[item]["articleLink"],
      extLink :  table[item]["externalLink"],
      title : table[item]["anchorText"],
      rel : table[item]["rel"],
      status : table[item]
  })
}

  // console.log(table);

  return (
    <div className="fluid-container" style={{ backgroundColor: "#f5f5f0" }}>
      {loader ? (
        <div
          className="text-center"
          style={{ paddingTop: "300px", paddingBottom: "300px" }}
        >
          <Spin tip="Loading...">
            <Alert
              message="Datewise"
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
              <Table columns={TableHeader} scroll={{x : 1000}} sticky border="3" dataSource={dateWiseTable} pagination={false} />
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

export default DateWise;