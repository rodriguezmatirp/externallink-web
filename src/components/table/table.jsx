// import React, { useEffect, useState } from "react";
// import styles from "./table.module.css";
// import axios from "axios";
// import { getSitemaps, getScrapedData } from "../../utils/routes";
// import { CSVLink } from "react-csv";
// import { FaFileDownload } from "react-icons/fa";

// function Table(props) {
//   const [table, setTable] = useState("");
//   const [data, setData] = useState("");
//   const [skip, setSkip] = useState(0);
//   useEffect(() => {
//     const fetchData = async () => {
//       let id = props.match.params.url;
//       let list = await axios.get(getSitemaps);
//       if (id < list.data.result.length) {
//         let url = list.data.result[id].link;
//         let data = await axios.get(
//           `${getScrapedData}/?site=${url}&limit=20&skip=${skip}`
//         );
//         console.log(data);
//         setTable(data.data.doc);
//         setData(list.data.result[id]);
//       }
//     };
//     fetchData();
//   }, [skip]);

//   const counter = (val) => {
//     if (val === "pre") {
//       setSkip(skip - 20);
//     } else if (val === "next") setSkip(skip + 20);
//   };
//   console.log(skip);
//   console.log(table);

//   return (
//     <div className="fluid-container" style={{ backgroundColor: "#e7f6fd" }}>
//       <div className="container pt-5 pb-5">
//         <div className="col-lg-12">
//           <div className="title h5">
//             <p>
//               <strong>Title:</strong> <span>{data ? data.title : null}</span>
//             </p>
//           </div>
//           <div className="sitemap h5">
//             <p>
//               <strong>Sitemap:</strong> <span>{data ? data.link : null}</span>
//             </p>
//           </div>
//           {table ? (
//             <CSVLink data={table}>
//               <FaFileDownload
//                 style={{
//                   fontSize: 36,
//                   marginBottom: 8,
//                 }}
//               />
//               Download
//             </CSVLink>
//           ) : null}
//         </div>

//         <div className="col-lg-12">
//           <div>
//             <div className={`card ${styles.cardEdit2}`}>
//               <table
//                 className="table table-striped"
//                 // style={{
//                 //   overflowX: "scroll",
//                 //   width: "100%",
//                 //   display: "block",
//                 // }}
//               >
//                 <thead>
//                   <tr>
//                     <th scope="col">Date</th>
//                     <th scope="col">Site</th>
//                     <th scope="col">External Links</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <th scope="row">1</th>
//                     <td>Mark</td>
//                     <td rowSpan="2">Otto</td>
//                   </tr>
//                   <tr>
//                     <th scope="row">2</th>
//                     <td>Jacob</td>
//                     <td>Thornton</td>
//                   </tr>
//                   <tr>
//                     <th scope="row">3</th>
//                     <td>Larry</td>
//                     <td>the Bird</td>
//                   </tr>
//                   <tr>
//                     <th scope="row">3</th>
//                     <td>Larry</td>
//                     <td>the Bird</td>
//                   </tr>
//                 </tbody>
//               </table>
//               {/* <div className="row px-3 pt-3">
//                 <div className="col-lg-3 h5">
//                   <strong>Date</strong>
//                 </div>
//                 <div className="col-lg-3 h5">
//                   <strong>Parent Link</strong>
//                 </div>
//                 <div className="col-lg-3 h5">
//                   <strong>External Link</strong>
//                 </div>
//                 <div className="col-lg-3 h5">
//                   <strong>Rel</strong>
//                 </div>
//               </div>
//               <hr /> */}
//               {/* {table
//                 ? table.map((tab, i) => {
//                     return (
//                       <div className="row p-3" key={i}>
//                         <div className="col-lg-3">{tab.created_at}</div>
//                         <div className="col-lg-3">{tab.articlelink}</div>
//                         <div className="col-lg-3">
//                           {tab.externalLinks.length > 0 ? (
//                             tab.externalLinks.map((link, i) => {
//                               return <p key={i}>{link.link}</p>;
//                             })
//                           ) : (
//                             <p>No external Link</p>
//                           )}
//                         </div> */}
//               {/* {tab.externalLinks.length > 0
//                           ? tab.externalLinks.map((link) => {
//                               if (link.rel === "dofollow")
//                                 return (
//                                   <div className="col-lg-3">
//                                     <p className="badge badge-success">
//                                       {link.rel}
//                                     </p>
//                                   </div>
//                                 );
//                               else
//                                 return (
//                                   <div className="col-lg-3">
//                                     <p className="badge badge-warning">
//                                       {link.rel}
//                                     </p>
//                                   </div>
//                                 );
//                             })
//                           : null} */}
//               {/* <div className="col-lg-3">
//                           <p className="badge badge-success">Success</p>
//                           <br />
//                           <p className="badge badge-warning">Warning</p>
//                         </div>
//                       </div>
//                     ); */}
//               {/* }) */}
//               {/*  : null} */}
//             </div>
//             <nav aria-label="Page navigation example">
//               <ul className="pagination">
//                 {skip > 0 ? (
//                   <li className="btn btn-primary" onClick={() => counter("pre")}>
//                     Previous
//                   </li>
//                 ) : null}

//                 <li className="btn btn-primary" onClick={() => counter("next")}>
//                   Next
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//         <div className={styles.RNNXgb}>
//           <div className={styles.SDkEP}>
//             <div className={styles.a4bIc}>
//               <div className={`${styles.pR49Ae} ${styles.gsfi}`}>
//                 <input
//                   type="text"
//                   className={`${styles.pR49Ae} ${styles.gsfi}`}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Table;

import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import axios from "axios";
import { getSitemaps, getScrapedData } from "../../utils/routes";
import { CSVLink } from "react-csv";
import { FaFileDownload } from "react-icons/fa";
// import useInputState from "../../hooks/useInputState";

function Table(props) {
  const [table, setTable] = useState("");
  const [data, setData] = useState("");
  // const [csvTable, setcsvTable] = useState("");
  // const [csvSkip, handlecsvSkipChange] = useInputState("");
  // const [csvLimit, handlecsvLimitChange] = useInputState("");
  useEffect(() => {
    const fetchData = async () => {
      let id = props.match.params.url;
      let list = await axios.get(getSitemaps);
      if (id < list.data.result.length) {
        let url = list.data.result[id].link;
        let data = await axios.get(
          `${getScrapedData}/?site=${url}&limit=20&skip=0`
        );
        console.log(data);
        setTable(data.data.doc);
        setData(list.data.result[id]);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);
  console.log(table);

  // const handleSubmit = async () => {
  //   if(skip > and )
  // }

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
    <div className="fluid-container" style={{ backgroundColor: "#e7f6fd" }}>
      <div className="container pt-5 pb-5">
        <div className="col-lg-12">
          <div className="title h5">
            <p>
              <strong>Title:</strong> <span>{data ? data.title : null}</span>
            </p>
          </div>
          <div className="sitemap h5">
            <p>
              <strong>Sitemap:</strong> <span>{data ? data.link : null}</span>
            </p>
          </div>
          {table ? (
            <CSVLink data={result}>
              <FaFileDownload
                style={{
                  fontSize: 36,
                  marginBottom: 8,
                }}
              />
              Download
            </CSVLink>
          ) : null}

          {/* <form>
            <div className="">
              <div className="col-lg-12 mb-4">
                <label style={{ color: "rgb(66, 63, 63)" }}>
                  <strong>Title</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={csvSkip}
                  onChange={handlecsvSkipChange}
                />
              </div>
              <div className="col-lg-12 mb-4">
                <label style={{ color: "rgb(66, 63, 63)" }}>
                  <strong>Sitemap</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={csvLimit}
                  onChange={handlecsvLimitChange}
                />
              </div>
              <div className="col-lg-12 mb-2">
                <button
                  type="button"
                  className={`btn btn-secondary btn-lg btn-block `}
                  onClick={handleSubmit}
                >
                  <strong style={{ fontSize: "17px" }}>Add</strong>
                </button>
              </div>
            </div>
          </form> */}
        </div>

        <div className="col-lg-12">
          <div>
            <div
              className={`card ${styles.cardEdit2}`}
              style={{
                overflowY: "scroll",
                height: "1500px",
                display: "block",
              }}
            >
              <table className="table ">
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
                      let date = tab.created_at.substring(
                        0,
                        tab.created_at.indexOf("T")
                      );
                      return (
                        <tr style={{ backgroundColor: "#f2f2f2" }} key={i}>
                          <td>{date}</td>
                          <td>{tab.articlelink}</td>
                          <td>
                            <table className="table">
                              <tbody>
                                {tab.externalLinks.length > 0 ? (
                                  tab.externalLinks.map((extLink, j) => {
                                    return (
                                      <tr key={j}>
                                        <td>{extLink.link}</td>
                                        <td>{extLink.rel}</td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                    <td>No External Link</td>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
