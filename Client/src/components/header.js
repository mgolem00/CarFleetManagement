import React, {useEffect} from "react";
import { Link } from 'react-router-dom';

const Header = () =>{

    let user = JSON.parse(localStorage.getItem("user"));

    const verifyRole = () => {
        /*
        if(localStorage.getItem("token") && localStorage.getItem("user")) {
            console.log("AYO");
            const options = {headers:{
                Authorization: "Bearer " + localStorage.getItem("token")
            }};
            useEffect(()=>{
                fetch("http://localhost:4000/api/getLoggedRole", options)
                .then((resRoleID)=>{
                    console.log(resRoleID);
                    if(resRoleID == 1 || resRoleID == 2) {
                        console.log("AYO TRUE");
                        return true;
                    }
                    else {
                        console.log("AYO FALSE");
                        return false;
                    }
                });
            }, []);
        }
        else {
            console.log("AYO FALSE");
            return false;
        }*/
        if(user.roleID == 1 || user.roleID == 2) {
            return true;
        }
        else {
            return false;
        }
    }

    return (
        <div>
            <div className="header">
                <h1>Car Fleet Management</h1>
                <p>Dobrodošli, {user.nameSurname}!</p>
            </div>

            {/*<div className="navbar">
                <Link to='/'>
                    User spending
                </Link>*/}

                {
                verifyRole() ? (
                <div className="navbar">
                    <Link to='/'>
                        User spending
                    </Link>
                    <Link to='/userMileage'>
                        User Mileage
                    </Link>
                    <Link to='/companySpending'>
                        Company Spending
                    </Link>
                    <Link to='/companyMileage'>
                        Company Mileage
                    </Link>
                    <Link to='/vehicles'>
                        Vehicles
                    </Link>
                    <Link to='/users'>
                        Users
                    </Link>
                    <div>
                        <Link to='/login' style={{backgroundColor: "crimson"}} onClick={()=>{
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                        }}>
                            {/*<i className="material-icons">exit_to_app</i>*/}
                            Logout
                        </Link>
                    </div>
                </div>
                ):(
                <div className="navbar">
                    <Link to='/'>
                        User spending
                    </Link>
                    <Link to='/userMileage'>
                        User Mileage
                    </Link>
                    <div>
                        <Link to='/login' style={{backgroundColor: "crimson"}} onClick={()=>{
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                        }}>
                            <i className="material-icons">exit_to_app</i>
                        </Link>
                    </div>
                </div>
                )}
            {/*</div>*/}
        </div>
    );
}

export default Header;