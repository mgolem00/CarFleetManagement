import React from "react";
//import { render } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import UserSpending from "./components/userSpending";
import UserMileage from "./components/userMileage";
import Login from "./components/login";
import CompanySpending from "./components/companySpending";
import CompanyMileage from "./components/companyMileage";
import Vehicles from "./components/vehicles";
import Users from "./components/users";

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/users" element={<Users />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/companyMileage" element={<CompanyMileage />} />
                    <Route path="/companySpending" element={<CompanySpending />} />
                    <Route path="/userMileage" element={<UserMileage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<UserSpending />} exact />
                </Routes>
            </Router>
        </div>
    );
};
    
//render(<App />, document.getElementById("root"));
const root = createRoot(document.getElementById("root"));
root.render(<App />);