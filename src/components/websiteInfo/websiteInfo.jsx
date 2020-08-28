import React, { useEffect, useState } from "react";
import axios from "axios";
import { crawlAll, webInfo, deleteWebsite, monitorCrawlList } from "../../utils/routes";
import { toast } from "react-toastify";
import { DeleteFilled } from "@ant-design/icons";
import { Button, Pagination, Radio, Table } from 'antd';


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
    const [currentlyCrawling, setCurrentlyCrawling] = useState("")
    const [scheduledTasks, setScheduledTasks] = useState("")

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
                let crawlList = await axios.get(`${monitorCrawlList}`)
                let data = await axios.get(`${webInfo}?limit=${pageSize}&skip=${skip}&sort=${sort}&type=${type}`)
                // console.log(data.data.result.doc)
                setMainMeta(data.data.result.totalCount)
                setData(data.data.result.doc)
                setCurrentlyCrawling(crawlList.data.monitorCrawlers.crawlWorkers)
                setScheduledTasks(crawlList.data.monitorCrawlers.crawlTasks)
                console.log(crawlList)
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

    const currentCrawlColumns = [
        {
            title: 'Time',
            dataIndex: 'time',
            width: 60,
            align: 'center'
        },
        {
            title: 'Currently Crawling',
            dataIndex: 'sitemap',
            width: 90,
            align: 'center'
        },
    ];
    var currentCrawl = []
    for (let item in currentlyCrawling) {
        currentCrawl.push({
            key: item,
            sitemap: currentlyCrawling[item]['domainSitemap'],
            time: currentlyCrawling[item]['crawlTime']/1000 + ' s'
        })
    }

    const toCrawlColumns = [
        {
            title: 'Index',
            dataIndex: 'index',
            width: 60,
            align: 'center'
        },
        {
            title: 'Scheduled',
            dataIndex: 'sitemap',
            width: 90,
            align: 'center'
        },
    ];
    var scheduled = []
    var i = 1
    for (let item in scheduledTasks) {
        scheduled.push({
            key: item,
            sitemap: scheduledTasks[item],
            index: i
        })
        i += 1
    }
    const statsTableHeader = [
        {
            title: 'Sitemap',
            dataIndex: 'sitemap',
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
            title: 'Last Crawl Date',
            dataIndex: 'crawlDate',
            width: 90,
            align: 'center'
        },
        {
            title: 'Time',
            dataIndex: 'crawlTime',
            width: 90,
            align: 'center'
        },
        {
            title: 'Sitemap Count',
            dataIndex: 'sitemapCount',
            width: 60,
            align: 'center'
        },
        {
            title: 'Articles Count',
            dataIndex: 'websiteCount',
            width: 60,
            align: 'center'
        },
        {
            title: 'Options',
            dataIndex: 'options',
            fixed: 'right',
            width: 60,
            align: 'center',
            render: (domainSitemap) => <div
            className="text-center"
            onClick={() => deleteWebsite_(domainSitemap)}
            style={{ cursor: "pointer", fontSize: "20px", color: "#EB4141" }}>
            <DeleteFilled />
            </div>,   
        }
    ];
    var statsTable = []
    for (let item in data) {
        statsTable.push({
            key: item,
            sitemap: data[item]["domainSitemap"],
            crawlDate :new Date(data[item]["updatedAt"]).toLocaleDateString(),
            crawlTime :new Date(data[item]["updatedAt"]).toLocaleTimeString(),
            sitemapCount :  data[item]["subSitemapCount"],
            websiteCount : data[item]["websiteCount"],
            options : data[item]["domainSitemap"]
        })
    }
    // console.log(statsTable)
    return (
        <div className="container pt-5 pb-5">
            <div className=" mb-4">
                <div className="h3 ">
                    <p>
                        <strong>
                            Welcome <span>{name ? name : "Admin"}</span>
                        </strong></p>
                </div>
                <div className="row">
                    <div className="col">
                        <div style={{ fontSize: "24px", color: "#87f04f" }}>
                            Crawl Websites&emsp;
                        <Button type="primary"
                                onClick={() => crawlall()}
                                size="26px"
                                disabled={buttonDisabled}
                            >Start</Button>&emsp;
                            <Button type="primary" style={{ background: "lightgreen" , border : "lightgreen" }}
                                onClick={() => window.location.reload()}
                                size="26px"
                            >Reload</Button>
                        </div>
                    </div>
                </div>
                <div className="row pt-5">
                    <div className="col">
                        <Table columns={currentCrawlColumns} sticky border="3" dataSource={currentCrawl} pagination={false} />
                    </div>
                    <div className="col">
                        <Table columns={toCrawlColumns} sticky scroll={{ y: 260 }} border="3" dataSource={scheduled} pagination={false} />
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
                <div className="col">
                <Table columns={statsTableHeader} sticky border="3" dataSource={statsTable} pagination={false} />
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