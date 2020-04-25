import React, { useState } from "react";
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

  const generateCSV = async () => {
    setShow(true);
    setLoader(true);
    const endLoop = Date.now() + 4000;
    while (Date.now() < endLoop) {
      let a = 1 + 1;
    }
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
      console.log(error.response);
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
  let CsvOperation = async (table) => {
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
  };
  CsvOperation(table);

  return (
    <div className="fluid-container">
      <div className={`p-2 ${styles.verticalLine}`}>
        <div className={`${styles.TypeCard} ml-3`}>
          <div>
            <h5>
              <strong>Download CSV</strong>
            </h5>
            <div className="row">
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
                  <CSVLink data={result}>
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
