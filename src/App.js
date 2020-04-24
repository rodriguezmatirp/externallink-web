import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/navbar";
import Table from "./components/table/table";
import Homepage from "./components/homepage/homepage";
import Index from "./components/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/login/login";

function App() {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <Switch>
        <Route exact path="/" component={Index} />
        <Route exact path="/home" component={Homepage} />
        <Route exact path="/table/:url" component={Table} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </>
  );
}

export default App;
