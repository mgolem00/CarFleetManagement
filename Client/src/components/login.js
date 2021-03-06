import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () =>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function onChangeUsername(e) {
        setUsername(e.target.value);
    }
    
    function onChangePassword(e) {
        setPassword(e.target.value);
    }
    
    function handleLogin(e) {
        e.preventDefault();
        
        fetch("http://localhost:4000/api/login", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {"Content-type": "application/json;charset=UTF-8"}
        })
        .then((resp)=>resp.json())
        .then((data)=>{
            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken);
                if(data.user){
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
                console.log("LOGGED IN");
                navigate('/');
            } else {
                console.log("Authentication error");
            }
        })
        .catch((err)=>console.log(err));
    }

    return(
    <div className="login">
        <div className="loginBox">
            <b>Log in to CarFleetManagement</b><br/>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                value={username}
                onChange={onChangeUsername}
                onBlur={onChangeUsername}
            ></input>

            <label htmlFor="password">Password</label>
            <input
                type="password"
                value={password}
                onChange={onChangePassword}
                onBlur={onChangePassword}
            ></input>
            <button onClick={(e) => {handleLogin(e);}}>Login</button>
        </div>
    </div>
    )
};
export default Login;