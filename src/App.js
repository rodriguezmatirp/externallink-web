import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/navbar";
import WebsiteTable from "./components/table/table";
import Homepage from "./components/homepage/homepage";
import Index from "./components/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/login/login";
import Register from "./components/register/register";
import { AuthContext } from "./contexts/userContext";
import NotFound from "./components/notFound/notFound";
import DateWise from "./components/dateWise/DateWise";
import filter from "./components/filter/filter";
import users from "./components/users/users";
import stats from "./components/stats/stats";
import ExternalLinks from "./components/externalLinks/externalLinks";

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
        /> <
        Route exact path = "/stats"
        component = { stats }
        />{" "} <
        Route exact path = "/externalLink"
        component = { ExternalLinks }
        /> <
        Route exact path = "/"
        component = { Index }
        />{" "} <
        Route exact path = "/users"
        component = { users }
        /> <
        PrivateRoute exact path = "/home"
        component = { Homepage }
        />{" "} <
        PrivateRoute exact path = "/table"
        component = { WebsiteTable }
        />{" "} <
        Route exact path = "/login"
        component = { Login }
        />{" "} <
        Route exact path = "/register"
        component = { Register }
        />{" "} <
        Route exact path = "/filter"
        component = { filter }
        />{" "} <
        Route path = "*"
        component = { NotFound }
        />{" "} < /
        Switch > { " " } <
        />
    );
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    const Data = useContext(AuthContext);
    return ( <
        Route {...rest }
        render = {
            (props) =>
            Data.token !== "" ? ( <
                Component {...props }
                />
            ) : ( <
                Redirect to = "/
                " / >
            )
        }
        />
    );
};

export default App;