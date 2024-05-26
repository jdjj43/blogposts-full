import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = ({ loggedIn, setLoggedIn, setUserData }) => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const url = "http://localhost:3000/api/user/login";
      const requestBody = {
        username: loginData.username,
        password: loginData.password,
      };
      const res = await axios.post(url, requestBody);
      if (res.data.Login) {
        setUserData(res.data.user);
        localStorage.setItem("Authorization", `Bearer ${res.data.accessToken}`);
        setLoggedIn(true);
        navigate("/");
      } else {
        navigate("/login?message=loginfailed");
      }
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (loggedIn) {
      navigate("/"); // Redirigir a la página principal
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <legend className="form-title">Login</legend>
          <div className="input-container">
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={loginData.username}
              onChange={handleOnChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleOnChange}
            />
          </div>
          <div className="btn-container">
            <button type="submit" className="submit-button">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return <></>;
  }
};
