import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUsersData, deleteUserData } from "../../utils/routes";
import { toast } from "react-toastify";
import { InfoCircleOutlined, DeleteFilled } from "@ant-design/icons";

const AdminST = () => {

    const [name, setName] = useState("")
    const [data, setData] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            let obj = JSON.parse(localStorage.getItem("UserData"))
            console.log(obj)
            const name_ = obj.user.name
            setName(name_)
            try {
                let data = await axios.get(`${getUsersData}`)
                let result = []
                data.data.result.doc.forEach((data) => {
                    result.push({ username: data.name, email: data.email, created: data.createdAt })
                })
                console.log(result)
                setData(result)
            } catch (e) {
                console.log(e)
                toast.error("Something Went wrong")
            }
        }
        fetchData();
    }, []);

    const deleteUser = async (userEmail, username) => {
        var pass = window.prompt("Admin access needed ")
        if (pass === "Delete") {
            if (window.confirm("Delete " + username + " Account")) {
                axios.get(`${deleteUserData}/?username=${userEmail}`)
                toast.success("Successfully deleted user -" + username)
            } else {
                toast.error("Delete failed")
                return
            }
            window.location.reload()
        } else {
            toast.error("Delete Failed")
        }
    }

    const infoUser = async (email) => {
        data.forEach((data_) => {
            if (data_.email === email) {
                console.log(data_.created)
                var created_date = new Date(data_.created)
                var date = created_date.getDate();
                var month = created_date.getMonth();
                var year = created_date.getFullYear();
                toast.warn("Created at " + date + "-" + (month + 1) + "-" + year)
            }
        })
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
                        style={{ backgroundColor: "#eee", marginTop: "10%" }}
                    >
                        <div className="row">
                            {data.length > 0 ? (
                                data.map((user, i) => {
                                    return (
                                        <div className="container-fluid" key={i}
                                            style={{ padding: "10px", backgroundColor: "#EDEDED" }}
                                        >
                                            <div className="row"
                                                style={{ fontSize: "20px" }}>
                                                <div className="col-md-4 text-center" >
                                                    {user.username}
                                                </div>
                                                <div className="col-md-6">
                                                    {user.email}
                                                </div>
                                                <div className="col-md-1">
                                                    <div
                                                        onClick={() => infoUser(user.email)}
                                                        style={{ cursor: "pointer", fontSize: "25px", color: "#85E62C" }}
                                                    >
                                                        <InfoCircleOutlined />
                                                    </div>
                                                </div>
                                                <div className="col-md-1">
                                                    <div
                                                        onClick={() => deleteUser(user.email, user.username)}
                                                        style={{ cursor: "pointer", fontSize: "25px", color: "#EB4141" }}
                                                    >
                                                        <DeleteFilled />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                    <div className="col-lg-6">
                                        <h4>No Userdata</h4>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default AdminST;