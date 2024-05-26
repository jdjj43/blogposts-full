import React, { useEffect, useState } from "react";
import { fetchAddPost, fetchUser } from "../helpers/apiHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading/Loading";

export const CreatePost = ({ posts, setPosts, userData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    published: false,
  });
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    let user;
    const token = localStorage.getItem("Authorization");
    const checkAuthor = async () => {
      if (Object.values(userData)[0] === undefined) {
        if (token) {
          setIsLoading(true);
          try {
            const data = await fetchUser(token);
            if (data.valid) {
              user = data.user;
              if (user.author === false) {
                navigate("/");
              } else {
                setIsLoading(false);
              }
            }
          } catch (error) {
            navigate("/");
          }
        } else {
          navigate("/");
        }
      } else {
        if (userData.author) {
          setIsLoading(false);
        } else {
          navigate("/");
        }
      }
    };
    if (token) {
      checkAuthor();
    } else {
      navigate("/");
    }
  }, []);

  const handleOnChange = (e) => {
    if (e.target.name === "published") {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchAddPost(
        formData.title,
        formData.description,
        formData.published
      );
      if (response.post.published) setPosts([...posts, response.post]);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="register-container createpost-container">
        <form onSubmit={handleOnSubmit}>
          <div className="form-edit-post-input">
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleOnChange}
              value={formData.title}
              min={1}
              max={100}
              required
            />
          </div>
          <div className="form-edit-post-input">
            <label htmlFor="description">Description: </label>
            <textarea name="description" value={formData.description} onChange={handleOnChange} min={1} max={1500} required></textarea>
          </div>
          <div className="published-checkbox">
            <input
              type="checkbox"
              name="published"
              id="published"
              placeholder="published"
              onChange={handleOnChange}
              checked={formData.published}
            />
            <label htmlFor="published">Published</label>
          </div>
          <div className="btn-container">
            <button type="submit" className="submit-button">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};
