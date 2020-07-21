import React, { useEffect, useState } from "react";
import axios from "axios";
import { crawlAll, webInfo, deleteWebsite } from "../../utils/routes";
import { toast } from "react-toastify";
import { DeleteFilled } from "@ant-design/icons";
import { Button } from 'antd';

const WebInfo = () => {

    const [name, setName] = useState("")
    const [data, setData] = useState("")
    const [buttonDisabled , setButtonDisabled] = useState(false)

    useEffect(() => {
        document.title = "Admin_Info"
        const fetchData = async () => {
            let obj = JSON.parse(localStorage.getItem("UserData"))
            // console.log(obj)
            const name_ = obj.user.name
            setName(name_)
            try {
                let data = await axios.get(`${webInfo}`)
                console.log(data.data.result.doc)
                setData(data.data.result.doc)
            } catch (e) {
                console.log(e)
            }
        }
        fetchData();
    }, []);
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

    const crawlall = async()=>{
        try{
            toast.success("Crawling started")
            setButtonDisabled(true)
            await axios.get(crawlAll)
            toast.success("Crawling all the data")
        }catch(e){
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
                <div className="col text-left">
                    <div style={{ fontSize: "24px" , color : "#87f04f"}}>
                        Crawl Websites&emsp;
                        <Button type="primary" danger
                        onClick={()=>crawlall()}
                        disabled={buttonDisabled}
                        >Start</Button>
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
                                overflowY: "hidden",
                                marginTop: "8%"
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
                                            let date = data_.updatedAt.substring(
                                                0,
                                                data_.updatedAt.indexOf("T")
                                            );
                                            let time = new Date(data_.updatedAt).toLocaleTimeString()
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
            </div>
        </div >
    );
};

export default WebInfo;