import React, { useEffect, useState } from "react";
import "./App.css";
import { Switch, Route, Link } from "react-router-dom";
import Upload from "./Pages/Upload.pages";
import AddDealer from "./Pages/AddDealer.pages";
import { Navbar, Nav } from "react-bootstrap";
import Dealers from "./Pages/Dealers.pages";
import UpdateDealer from "./Pages/UpdateDealer.pages";
import Orders from "./Pages/Orders.pages";
import "bootstrap/dist/css/bootstrap.min.css";
import Report from "./Pages/Report.pages";

function App() {
  const [lastUpdated, setLastUpdated] = useState("");
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/lastupdated`)
      .then((response) => response.json())
      .then((data) => setLastUpdated(data.last_updated));
  }, []);
  return (
    <div className="">
      <Navbar bg="light" expand="lg" style={{ marginBottom: "1rem" }}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link to="/report" className="nav-link">
              Report
            </Link>
            <Link to="/" className="nav-link">
              Upload
            </Link>
            <Link to="/add/dealer" className="nav-link">
              Add Dealer
            </Link>
            <Link to="/dealers" className="nav-link">
              All Dealers
            </Link>
            <Link to="/orders" className="nav-link">
              All Orders
            </Link>
            <Navbar.Toggle />
          </Nav>
        </Navbar.Collapse>
        <Navbar.Text>
          Last Updated: {new Date(lastUpdated).toLocaleString()}
        </Navbar.Text>
      </Navbar>
      <Switch>
        <Route path="/dealers" component={Dealers} />
        <Route path="/add/dealer" component={AddDealer} />
        <Route path="/update/d/:dealer" component={UpdateDealer} />
        <Route path="/orders" component={Orders} />
        <Route path="/report" component={Report} />
        <Route path="/" component={Upload} />
      </Switch>
    </div>
  );
}

export default App;
