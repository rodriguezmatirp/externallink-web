import React, { useState, useEffect } from "react";
import styles from "./globalCSV.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { getGlobalData } from "./../../utils/routes";
import { CSVLink } from "react-csv";
import { FaFileDownload } from "react-icons/fa";
import { toast } from "react-toastify";

export default function GlobalCSV() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [table, setTable] = useState("");
  const [loader, setLoader] = useState(true);
  const [show, setShow] = useState(false);
  const [todayCSV, setTodayCSV] = useState("");
  const [yesterdayCSV, setYesterdayCSV] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let today = new Date();
      let yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      let todayStart = getFormattedDate(today);
      let yesterdayStart = getFormattedDate(yesterday);

      try {
        let todayData = await axios.get(
          `${getGlobalData}/?site=global&start=${todayStart}&end=${todayStart}`
        );
        let yesterdayData = await axios.get(
          `${getGlobalData}/?site=global&start=${yesterdayStart}&end=${yesterdayStart}`
        );
        setTodayCSV(todayData.data.doc);
        setYesterdayCSV(yesterdayData.data.doc);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const generateCSV = async () => {
    setShow(true);
    setLoader(true);
    /* const endLoop = Date.now() + 4000;
     while (Date.now() < endLoop) {
      let a = 1 + 1;
    } */
    try {
      let start = getFormattedDate(startDate);
      let end = getFormattedDate(endDate);
      let data = await axios.get(
        `${getGlobalData}/?site=global&start=${start}&end=${end}`
      );
      setTable(data.data.doc);
      setLoader(false);
    } catch (error) {
      setShow(false);
      toast.error("Something went wrong");
    }
  };

  const getFormattedDate = (date) => {
    var todayTime = new Date(date);
    var day = todayTime.getDate();
    var month = todayTime.getMonth() + 1;
    var year = todayTime.getFullYear();
    return year + "-" + month + "-" + day;
  };

  let result = [["published_date", "articlelink", "externalLinks"]];
  let CsvOperation = (table) => {
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
      //console.log(links);
      var dateobj = new Date(table[i].created_at.toString());
      result.push([dateobj.toString(), table[i].articlelink, links]);
    }
    return result;
  };
  let datedCSV = CsvOperation(table);
  let todayCSVData = CsvOperation(todayCSV);
  let yesterdayCSVData = CsvOperation(yesterdayCSV);

  return (
    <div className="fluid-container">
      <div className={`p-2 ${styles.verticalLine}`}>
        <div className={`${styles.TypeCard} ml-3`}>
          <div>
            <h5>
              <strong>Download CSV</strong>
            </h5>
            <div className="row">
              <div className="col-lg-6 p-3">
                <CSVLink data={todayCSVData}>
                  <FaFileDownload
                    style={{
                      fontSize: 36,
                      marginBottom: 8,
                    }}
                  />
                  Today
                </CSVLink>
              </div>
              <div className="col-lg-6 p-3">
                <CSVLink data={yesterdayCSVData}>
                  <FaFileDownload
                    style={{
                      fontSize: 36,
                      marginBottom: 8,
                    }}
                  />
                  Yesterday
                </CSVLink>
              </div>
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
                  onClick={() => generateCSV()}
                >
                  Generate CSV
                </p>
              </div>
            </div>
            {show ? (
              <div>
                {loader ? (
                  <img
                    src="./assets/images/Spinner.gif"
                    alt="loader"
                    height="100"
                  />
                ) : (
                  <CSVLink data={datedCSV}>
                    <FaFileDownload
                      style={{
                        fontSize: 36,
                        marginBottom: 8,
                      }}
                    />
                    Download
                  </CSVLink>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
