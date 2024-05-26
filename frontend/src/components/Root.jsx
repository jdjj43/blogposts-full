import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { fetchUser } from "../helpers/apiHelper";
import Loading from "./Loading/Loading";
export const Root = ({ loggedIn, setLoggedIn, userData, setUserData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const logOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("Authorization");
    setLoggedIn(false);
    setUserData({});
    navigate("/");
  };

  useEffect(() => {
    const userLoggedIn = async () => {
      const token = localStorage.getItem("Authorization");
      if (token) {
        const data = await fetchUser(token);
        if (data.user) {
          setUserData(data.user);
          setLoggedIn(true);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          return;
        }
      } else {
        setIsLoading(false);
        return;
      }
    };
    userLoggedIn();
  }, []);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    return (
      <>
        <div className="container">
          <div className="navbar">
            <div className="logo">
              <Link to={"/"}>
                <h1>BlogsPosts</h1>
              </Link>
            </div>
            <div className="links">
              {userData.author && (
                <>
                  <Link to={"/post/create"} className="link">Create Post</Link>
                  <Link to={"/user/posts"} className="link">Your Posts</Link>
                </>
              )}
              {!loggedIn ? (
                <>
                  <Link to={"/login"} className="link">Login</Link>{" "}
                  <Link to={"/register"} className="link">Register</Link>
                </>
              ) : (
                <a href="/" onClick={logOut} className="link">
                  Logout
                </a>
              )}
            </div>
          </div>
          <div id="content">
            <Outlet />
          </div>
        </div>
      </>
    );
  }
};
