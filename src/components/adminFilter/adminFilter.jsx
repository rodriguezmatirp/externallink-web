import React, { useEffect, useState } from "react";
import styles from "./adminFilter.module.css";
import axios from "axios";
import { restrictFilter, deleteRestricted } from "../../utils/routes";
import { toast } from "react-toastify";
import useInputState from "../../hooks/useInputState";
import { FieldTimeOutlined, DeleteFilled } from "@ant-design/icons";

const Admin = () => {
    const [data, setData] = useState("")
    const [name, setName] = useState("")
    const [filter, setFilter, rF] = useInputState("")

    useEffect(() => {
        document.title = "Admin_Restrict"
        const fetchData = async () => {
            let obj = JSON.parse(localStorage.getItem("UserData"))
            console.log(obj)
            const name_ = obj.user.name
            setName(name_)
            try {
                let data = await axios.get(
                    `${restrictFilter}`
                )
                let result = []
                data.data.result.doc.forEach((data) => {
                    result.push({ title: data.restricted_link, created: data.created_at, type: data.restricted_type })
                })
                console.log(result)
                setData(result)
            } catch (e) {
                console.log(e)
                toast.error("Something went wrong")
            }
        }
        fetchData();
    }, []);

    const timeScrap = async (link, type) => {
        data.forEach((data_) => {
            if (data_.title === link && data_.type === type) {
                console.log(data_.created)
                var created_date = new Date(data_.created)
                var date = created_date.getDate();
                var month = created_date.getMonth();
                var year = created_date.getFullYear();
                toast.warn("Created at " + date + "-" + (month + 1) + "-" + year)
            }
        })
    }

    const addFilter = async (e) => {
        let value = filter.trim()
        if (value === "") {
            toast.warn("Please Enter the value")
        } else {
            try {
                var select = document.getElementById("select").value
                console.log(select)
                let data = await axios.post(
                    `${restrictFilter}/?link=${value}&options=${select}`
                )
                rF();
                console.log(data)
                window.location = '/admin_restrict'
                toast.success("Restriction Added")
            } catch (e) {
                console.log(e)
                toast.error("Something went wrong")
            }
        }
    }

    const deleteRestrict_ = async (link, type) => {
        if (window.confirm("Remove " + link + " from Restricted")) {
            axios.get(`${deleteRestricted}/?link=${link}&type=${type}`)
            toast.success("Successfully removed " + link)
        } else {
            toast.error("Remove Falied")
            return
        }
        window.location.reload()
    }

    return (
        <div className="container pt-5 pb-5">
            <div className=" mb-4">
                <div className="h3 ">
                    <p>
                        <strong>
                            Welcome <span>{name ? name : "Admin"}</span>
                        </strong></p>
                    <div
                        className="fluid-container pb-5"
                        style={{ backgroundColor: "#f9fafb" }}
                    >
                        <div className="container pt-4">
                            <div className="col-lg-9 mx-auto">
                                <form>
                                    <div className="input-group mt-4 mb-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter URL restrict or Keywords"
                                            value={filter}
                                            onChange={setFilter}
                                            required={true}
                                        />

                                        <select
                                            className="selectpicker"
                                            style={{ fontSize: "16px" }} id="select" >
                                            <option defaultValue>Select options</option>
                                            <option value="ALL">Apply to all</option>
                                            <option value="EST">Except Startup Talky</option>
                                        </select>
                                        <button
                                            type="submit"
                                            className={`btn ${styles.prime_btn}`}
                                            onClick={() => addFilter()}
                                        >
                                            Restrict
                                    </button>
                                    </div>
                                </form>
                            </div>
                            <div className="pt-5">
                                <div className="col-lg-12">
                                    <div className="row">
                                        {data.length > 0 ? (
                                            data.map((item, i) => {
                                                return (
                                                    <div
                                                        className="col-4"
                                                        style={{ padding: "20px" }}
                                                        key={i}
                                                    >
                                                        <div className={styles.TypeCard}>
                                                            <div
                                                                className="float-left"
                                                                onClick={() => timeScrap(item.title, item.type)}
                                                                style={{ cursor: "pointer", fontSize: "26px", color: "#41D0EB" }}
                                                            ><FieldTimeOutlined />
                                                            </div>
                                                            <div
                                                                className="float-right"
                                                                onClick={() => deleteRestrict_(item.title, item.type)}
                                                                style={{ cursor: "pointer", fontSize: "26px", color: "#EB4141" }}
                                                            >
                                                                <DeleteFilled />
                                                            </div>
                                                            <div className="row align-items-center no-gutters">
                                                                <div className="col mr-2 h6">
                                                                    <div className=" text-secondary text-center p-3">
                                                                        <span className="text-dark font-weight-bold float-left"
                                                                            style={{ paddingTop: "25px", paddingRight: "10px" }}
                                                                        >
                                                                            {item.title} -  {item.type}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                                <div className="col-lg-6">
                                                    <h4>No Filters</h4>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
