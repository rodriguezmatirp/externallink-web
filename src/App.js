import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/navbar";
import Table from "./components/table/table";
import Homepage from "./components/homepage/homepage";
import Index from "./components/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/login/login";
import Register from "./components/register/register";
import { AuthContext } from "./contexts/userContext";
import NotFound from "./components/notFound/notFound";
import DateWise from "./components/dateWise/DateWise";
import AdminFilter from "./components/adminFilter/adminFilter";
import AdminST from "./components/emailFilter/emailFilter";
import WebsiteInfo from "./components/websiteInfo/websiteInfo";

function App() {
    return ( <
        >
        <
        ToastContainer / >
        <
        Navbar / >
        <
        Switch >
        <
        Route exact path = "/datewise"
        component = { DateWise }
        /><
        Route exact path = "/admin_info"
        component = { WebsiteInfo }
        /> <
        Route exact path = "/"
        component = { Index }
        /> <
        Route exact path = "/admin_email"
        component = { AdminST }
        /><
        PrivateRoute exact path = "/home"
        component = { Homepage }
        /> <
        PrivateRoute exact path = "/table"
        component = { Table }
        /> <
        Route exact path = "/login"
        component = { Login }
        /> <
        Route exact path = "/register"
        component = { Register }
        /> <
        Route exact path = "/admin_restrict"
        component = { AdminFilter }
        /> <
        Route path = "*"
        component = { NotFound }
        /> < /
        Switch > <
        />
    );
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    const Data = useContext(AuthContext);
    return ( <
        Route {...rest }
        render = {
            (props) =>
            Data.token !== "" ? < Component {...props }
            /> : <Redirect to="/
            " />
        }
        />
    );
};

export default App;