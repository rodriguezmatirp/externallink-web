import React, { useEffect, useState } from "react";
import axios from "axios";
import { crawlAll, webInfo, deleteWebsite } from "../../utils/routes";
import { toast } from "react-toastify";
import { DeleteFilled } from "@ant-design/icons";
import { Button, Pagination, Radio } from 'antd';

const WebInfo = () => {

    const [name, setName] = useState("")
    const [data, setData] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [main, setMain] = useState(true)
    const [mainMeta, setMainMeta] = useState(0)
    const pageSize = 20;
    const [type, setType] = useState("websiteCount")
    const [sort, setSort] = useState('-1')
    const [pageNum, setPageNum] = useState(1)


    useEffect(() => {
        document.title = "Crawler Stats"
        const fetchData = async () => {
            let obj = JSON.parse(localStorage.getItem("UserData"))
            // console.log(obj)
            const name_ = obj.user.name
            setName(name_)
            var skip = (pageNum - 1) * pageSize
            try {
                // await axios.get(`${updateData}`)
                let data = await axios.get(`${webInfo}?limit=${pageSize}&skip=${skip}&sort=${sort}&type=${type}`)
                console.log(data.data.result.doc)
                setMainMeta(data.data.result.meta)
                setData(data.data.result.doc)
                setMain(true)
            } catch (e) {
                console.log(e)
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },
        [sort, type, pageNum]);
    const deleteWebsite_ = (url) => {
        var pass = window.prompt("Admin access needed ")
        if (pass === "confirm") {
            if (window.confirm("Delete " + url)) {
                axios.get(`${deleteWebsite}/?link=${url}`)
                toast.success("Successfully deleted " + url)
            } else {
                toast.error("Delete failed")
                return
            }
            window.location.reload()
        } else {
            toast.error("Delete Failed")
        }
    }

    const handleRadioChange = (e) => {
        var value = e.target.value
        if (value === "wc") {
            setType("websiteCount")
        } else if (value === "dw") {
            setType("dateWise")
        } else if (value === "asc") {
            setSort('1')
        } else if (value === "desc") {
            setSort('-1')
        }
        console.log(value)
    }

    const handlePageChange = async (p, ps) => {
        setPageNum(p)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    const crawlall = async () => {
        try {
            toast.success("Crawling started")
            setButtonDisabled(true)
            await axios.get(crawlAll)
            toast.success("Crawling all the data")
        } catch (e) {
            console.log(e)
            setButtonDisabled(false)
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="container pt-5 pb-5">
            <div className=" mb-4">
                <div className="h3 ">
                    <p>
                        <strong>
                            Welcome <span>{name ? name : "Admin"}</span>
                        </strong></p>
                </div>
                <div className="col">
                    <div style={{ fontSize: "24px", color: "#87f04f" }}>
                        Crawl Websites&emsp;
                        <Button type="primary"
                            onClick={() => crawlall()}
                            size="26px"
                            disabled={buttonDisabled}
                        >Start</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col" >
                        <Radio.Group
                            defaultValue="wc"
                            style={{ marginTop: 16 }}
                            onChange={handleRadioChange}
                            className="type"
                        >
                            <Radio.Button value="wc">Website Count</Radio.Button>
                            <Radio.Button value="dw">Date Wise</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className="col text-right">
                        <Radio.Group
                            defaultValue="desc"
                            style={{ marginTop: 16 }}
                            onChange={handleRadioChange}
                        >
                            <Radio.Button value="asc">Ascending</Radio.Button>
                            <Radio.Button value="desc">Descending</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
            </div >
            <div className="row">
                <div className="col-lg-12">
                    {data.length !== 0 ? (
                        <div
                            style={{
                                overflowX: "scroll",
                                height: "100%",
                                display: "block",
                                overflowY: "hidden"
                            }}
                        >
                            <table className="table " border="1">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">URL</th>
                                        <th scope="col">Sitemap</th>
                                        <th scope="col">Last Crawl Date</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Sitemap Count</th>
                                        <th scope="col">website Count</th>
                                        <th scope="col">Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data
                                        ? data.map((data_, i) => {
                                            var date = undefined
                                            var time = undefined
                                            if (data_.updatedAt !== undefined) {
                                                date = data_.updatedAt.substring(
                                                    0,
                                                    data_.updatedAt.indexOf("T")
                                                );
                                                time = new Date(data_.updatedAt).toLocaleTimeString()
                                            }
                                            return (
                                                <tr
                                                    style={{ backgroundColor: "#fff" }}
                                                    key={i}
                                                >
                                                    <td>{data_.title}</td>
                                                    <td>
                                                        <a
                                                            href={data_.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {data_.link}
                                                        </a>
                                                    </td>
                                                    <td>{date ? (<p>{date}</p>) : (<p>Null</p>)}</td>
                                                    <td>{date ? (<p>{time}</p>) : (<p>Null</p>)}</td>
                                                    <td>
                                                        {data_.sitemap_count}
                                                    </td>
                                                    <td>
                                                        {data_.website_count}
                                                    </td>
                                                    <td>
                                                        <div
                                                            className="text-center"
                                                            onClick={() => deleteWebsite_(data_.link)}
                                                            style={{ cursor: "pointer", fontSize: "20px", color: "#EB4141" }}
                                                        >
                                                            <DeleteFilled />
                                                        </div>
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
                                Loading....Please Wait
                </div>
                        )}
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
        </div >
    );
};

export default WebInfo;