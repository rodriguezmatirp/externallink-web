import React, { useEffect, useState } from "react";
import styles from "./datewise.module.css";
import axios from "axios";
import { getDownloadCSV, getDownload } from "../../utils/routes";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { DatePicker } from "antd";
import { getGlobalData } from "./../../utils/routes";
import { toast } from "react-toastify";
import { CSVLink, CSVDownload } from "react-csv";
const { RangePicker } = DatePicker;

const getFormattedDate = (date) => {
  var todayTime = new Date(date);
  var day = todayTime.getDate();
  var month = todayTime.getMonth() + 1;
  var year = todayTime.getFullYear();
  return year + "-" + month + "-" + day;
};

const generateCsv = (data) => {
  const csvData = [["article-Link", "External-Link", "Rel", "Date of Post"]]
  for (let i = 0; i < data.length; i++) {
    let arr = data[i].externalLinks;
    for (let j = 0; j < arr.length; j++) {
      var temp=[]
      temp.push(data[i].articlelink)
      temp.push(arr[i].link)
      if(arr[i].rel==undefined){
        temp.push("Not-Defined")
      }
      else{
        temp.push(arr[i].rel)
      }
      temp.push(getFormattedDate(data[i].lastmod))
      csvData.push(temp);
    }
  }


}

const DateWise = () => {
  const [table, setTable] = useState("");
  const [startDate, setStartDate] = useState(() => {
    return getFormattedDate(new Date());
  });
  const [endDate, setEndDate] = useState(() => {
    return getFormattedDate(new Date());
  });
  // const [all, setAll] = useState(true);
  // const [dofollow, setDofollow] = useState(false);
  // const [nofollow, setNofollow] = useState(false);
  // const [search, setSearch] = useState(false);
  // const [searchMeta, setSearchMeta] = useState(0);
  // const [main, setMain] = useState(true);
  // const [mainMeta, setMainMeta] = useState(0);
  // const [filter, setFilter] = useState(false);
  // const [filterMeta, setFilterMeta] = useState(0);
  // const [title, setTitle] = useState("");
  // const { Option } = Select;

  useEffect(async () => {
    const fetchData = async () => {
      try {
        let todayData = await axios.get(
          `${getGlobalData}/?site=global&start=${startDate}&end=${endDate}`
        );

        setTable(todayData.data.doc.result);
        await generateCsv(todayData.data.doc.result);
        console.log(todayData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  const handleDateChange = (date, d) => {
    setStartDate(d[0]);
    setEndDate(d[1]);
  };

  // function handleChange(value) {
  //   console.log(`selected ${value}`);
  // }

  // const handleFollowChange = async (e) => {
  //   let obj = JSON.parse(localStorage.getItem("link"));
  //   let url = obj.site;
  //   let filterData = await axios.get(
  //     `${getFilterData}/?site=${url}&limit=20&skip=0`
  //   );
  //   setFilterMeta(filterData.data.meta);
  //   setFilter(true);
  //   setMain(false);
  //   setSearch(false);
  //   setTable(filterData.data.doc);
  //   if (e.target.value === "Nofollow" && e.target.checked) {
  //     setAll(false);
  //     setNofollow(true);
  //     setDofollow(false);
  //   }
  //   if (e.target.value === "Dofollow" && e.target.checked) {
  //     setAll(false);
  //     setNofollow(false);
  //     setDofollow(true);
  //   }
  //   if (e.target.checked === false) {
  //     setAll(true);
  //     setNofollow(false);
  //     setDofollow(false);
  //   }
  // };

  const handleSearch = async () => {
    try {
      await axios.get(
        `${getDownload}?link=global&start=${startDate}&end=${endDate}&title=${startDate}`
      );
      // console.log(data);
      // setSearchMeta(data.data.doc.meta);
      // setSearch(true);
      // setMain(false);
      // setFilter(false);
      // setTable(data.data.doc.result);
      toast.success("Creating CSV");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // const handlePageChange = async (p, ps) => {
  //   let obj = JSON.parse(localStorage.getItem("link"));
  //   let url = obj.site;
  //   let skip = (p - 1) * ps;
  //   try {
  //     if (main) {
  //       let data = await axios.get(
  //         `${getScrapedData}/?site=${url}&limit=20&skip=${skip}`
  //       );
  //       setTable(data.data.doc.result);
  //     }
  //     if (filter) {
  //       let filterData = await axios.get(
  //         `${getFilterData}/?site=${url}&limit=20&skip=${skip}`
  //       );
  //       setTable(filterData.data.doc);
  //     }
  //     if (search) {
  //       let start = getFormattedDate(startDate);
  //       let end = getFormattedDate(endDate);
  //       let data = await axios.get(
  //         `${getGlobalData}/?site=${url}&start=${start}&end=${end}&limit=20&skip=${skip}`
  //       );
  //       console.log(data);
  //       setSearchMeta(data.data.doc.meta);
  //       setTable(data.data.doc.result);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
      <div className="container pt-5 pb-5">
        <div className="row mb-4">
          <div className="col-lg-6 text-right">
            <RangePicker onChange={handleDateChange} />
          </div>
          <div className="col-lg-6">
            <button
              className={`btn ${styles.prime_btn}`}
              onClick={() => handleSearch()}
            >
              Generate CSV
            </button>
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
          {/* <div className="col-lg-4">
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="all">All</Option>
            </Select>
          </div> */}
          {/* <div className="col-lg-2 text-right">
            <Checkbox onChange={handleFollowChange} value="Dofollow">
              Dofollow
            </Checkbox>
          </div>
          <div className="col-lg-2">
            <Checkbox onChange={handleFollowChange} value="Nofollow">
              Nofollow
            </Checkbox>
          </div> */}
          <div className="col-lg-8 text-right" style={{ cursor: "pointer" }}>
            <a href={`${getDownloadCSV}/${startDate}_date.csv`}>
              <FaCloudDownloadAlt style={{ fontSize: "28px" }} /> Export
            </a>
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
                        <tr style={{ backgroundColor: "#f2f2f2" }} key={i}>
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
                                {/* {nofollow ? (
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
                                  ) : null} */}
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
        {/* <div className="col-lg-12 mt-5">
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
        </div> */}
      </div>
    </div>
  );
};

export default DateWise;
