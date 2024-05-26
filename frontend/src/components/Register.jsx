import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser, fetchUserRegister } from "../helpers/apiHelper";
import Loading from "./Loading/Loading";

export const Register = ({ loggedIn }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    const getUser = async () => {
      setLoading(true);
      try {
        const response = await fetchUser(token);
        setLoading(false);
        if (response.user._id !== undefined) {
          navigate("/");
        }
      } catch (error) {
        setLoading(false);
        return;
      }
    };
    if (token) {
      getUser();
    } else {
      setLoading(false);
    }
  }, []);

  const handleChangeForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchUserRegister(formData);
      navigate("/login?registered=true");
    } catch (error) {
      setErrors(error.response.data.errors);
      setLoading(false);
    }
  };

  return (
    <>
      <>{loading && <Loading />}</>
      <>
        <div className="errors">
          {errors &&
            errors.map((error, i) => (
              <div className="error" key={i}>
                <p>•{error.msg}</p>
              </div>
            ))}
        </div>
        <div className="register-container">
          <form onSubmit={handleOnSubmit}>
            <legend className="form-title">Register</legend>
            <div className="double-input">
              <div className="input-container">
                <label htmlFor="name">First Name: </label>
                <input
                  type="text"
                  onChange={handleChangeForm}
                  name="name"
                  placeholder="Your First Name"
                  value={formData.name}
                />
              </div>
              <div className="input-container">
                <label htmlFor="last_name">Last Name: </label>
                <input
                  type="text"
                  onChange={handleChangeForm}
                  name="last_name"
                  placeholder="Your Last Name"
                  value={formData.last_name}
                />
              </div>
            </div>
            <div className="input-container username">
              <label htmlFor="username">Username: </label>
              <input
                type="text"
                onChange={handleChangeForm}
                name="username"
                placeholder="Your username"
                autoComplete="new-username"
                value={formData.username}
              />
            </div>
            <div className="input-container email">
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                onChange={handleChangeForm}
                name="email"
                placeholder="Your Email"
                value={formData.email}
              />
            </div>
            <div className="double-input">
              <div className="input-container">
                <label htmlFor="password1">Password: </label>
                <input
                  type="password"
                  onChange={handleChangeForm}
                  name="password1"
                  placeholder="Your Password"
                  autoComplete="new-password"
                  value={formData.password1}
                />
              </div>
              <div className="input-container">
                <label htmlFor="password2">Repeat Your Password: </label>
                <input
                  type="password"
                  onChange={handleChangeForm}
                  name="password2"
                  placeholder="Repeat Your Password"
                  value={formData.password2}
                />
              </div>
            </div>
            <div className="btn-container">
              <button type="submit" className="submit-button">Register</button>
            </div>
          </form>
        </div>
      </>
    </>
  );
};
