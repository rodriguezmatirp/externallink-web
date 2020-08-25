import React, { useEffect, useState } from "react";
import styles from "./externalLinks.module.css";
import axios from "axios";
import {
  getExternalLinks,
  changeStatusExtLink,
  downloadExternalLinks,
} from "../../utils/routes";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Pagination, DatePicker, Button, Spin, Alert, Table } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
const { RangePicker } = DatePicker;


const ExternalLinks = () => {
  const [table, setTable] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("websiteCount")
  const [sort, setSort] = useState('-1')
  const [status, setStatus] = useState("both")
  const [main, setMain] = useState(true);
  const [mainMeta, setMainMeta] = useState(0);
  const [loader, setLoader] = useState(true);
  const [pageNum, setPageNum] = useState(1)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const pageSize = 20

  const columns = [
    {
      title: 'Index',
      width: 60,
      dataIndex: 'index',
      fixed: 'left',
      align: 'center'
    },
    {
      title: 'Found Date',
      width: 110,
      dataIndex: 'fdate',
      fixed: 'left',
      align: 'center',
      sorter: {},
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastmod',
      width: 110,
      align: 'center'
    },
    {
      title: 'Website',
      dataIndex: 'website',
      width: 180,
      align: 'center'
    },
    {
      title: 'External Link',
      dataIndex: 'extLink',
      width: 170,
      align: 'center'
    },
    {
      title: 'Rel',
      dataIndex: 'rel',
      width: 80,
      align: 'center'
    },
    {
      title: 'Anchor Text',
      dataIndex: 'text',
      width: 150,
      align: 'center'

    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: 60,
      align: 'center',
      sorter: {},
    },
    {
      title: 'Status',
      dataIndex: 'statusObj',
      fixed: 'right',
      width: 70,
      align: 'center',
      render: (externalLinkObj) => <input
        type="checkbox"
        size="40px"
        checked={externalLinkObj.status}
        onChange={() => onStatusChecked(externalLinkObj.externalLink, externalLinkObj.status)}
      />,
      filters : [
        {text : 'Verified' , value : 'v'},
        {text : 'Not verified' , value : 'nv'}
      ],
      filterMultiple : true,
      defaultFilteredValue : [
        'v' , 'nv'
      ]
    },
  ];


  function onTableChange(pagination, filters, sorter, extra) {
    console.log(filters)
    if (sorter.field === "count") {
      setType("websiteCount")
    } else if (sorter.field === "fdate") {
      setType("dateWise")
    }
    if (sorter.order === "ascend") {
      setSort('1')
    } else if (sorter.order === "descend") {
      setSort('-1')
    }
    if (filters.statusObj === null) {
      setTable("")
    }else if(filters.statusObj[0] && filters.statusObj[1] ){
      setStatus("both")
    }
    else if (filters.statusObj[0] === 'nv') {
      setStatus("notVerified")
    } else if (filters.statusObj[0] === 'v') {
      setStatus("verified")
    }
  }

  const setTableData = async () => {
    var query = ""
    var skip = (pageNum - 1) * pageSize

    if (startDate !== "")
      query += "start=" + startDate + "&"
    if (endDate !== "")
      query += "end=" + endDate + "&"

    let data = await axios.get(
      `${getExternalLinks}?${query}limit=${pageSize}&skip=${skip}&sort=${sort}&type=${type}&showOnly=${status}`
    );

    console.log(data)
    if (data.data.result.length === 0) {
      toast.error("No Data")
    }

    setMainMeta(data.data.meta);

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
  }, [startDate, endDate, pageNum, type, sort, status]);



  const handleDateChange = (date, d) => {
    setStartDate(d[0]);
    setEndDate(d[1]);
    setPageNum(1)
  };

  const onStatusChecked = async (extLink, status) => {
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

  const downloadData = async () => {
    setButtonDisabled(true)
    var query = ""

    if (startDate !== "")
      query += "start=" + startDate + "&"
    if (endDate !== "")
      query += "end=" + endDate + "&"
    query += "-sort_" + sort + "-type_" + type + "-status_" + status

    try {
      await axios.get(
        `${downloadExternalLinks}?${query}&sort=${sort}&type=${type}&showOnly=${status}`
      );
      toast.success("File Ready!")
      window.open(`${downloadExternalLinks}?${query}&sort=${sort}&type=${type}&showOnly=${status}`)
    } catch (e) {
      toast.error("Something Went Wrong !")
      console.log(e)
    }
    setButtonDisabled(false)
  }
  // console.log(table);

  const data = []
  var i = 0;
  for (let item of table) {
    data.push({
      key: item,
      index: ((pageNum - 1) * pageSize) + i + 1,
      website: item["articleLink"],
      fdate: new Date(item["createdAt"]).toDateString(),
      lastmod: new Date(item["lastModified"]).toLocaleDateString(),
      text: item["anchorText"],
      rel: item["rel"],
      extLink: item["externalLink"],
      statusObj: item,
      count: item["externalLinkCount"]
    })
    i++;
  }

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
                    style={{ backgroundColor: "rgba(12, 213, 8, 0.952)", borderColor: "rgba(12, 213, 8, 0.952)" }}
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                </button>
                </div>
                <div
                  className="col text-right"
                >
                  <Button
                    type="primary"
                    style={{ backgroundColor: "rgba(12, 213, 8, 0.952)", borderColor: "rgba(12, 213, 8, 0.952)" }}
                    icon={<FaCloudDownloadAlt style={{ fontSize: "26px", paddingRight: "10px" }} />}
                    size="default"
                    onClick={downloadData}
                    disabled={buttonDisabled}
                  >
                    Export
                    </Button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <Table columns={columns} sticky scroll={{ x: 1500 }} border="1" dataSource={data} onChange={onTableChange} pagination={false} />
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