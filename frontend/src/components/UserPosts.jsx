import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchPostsByUser, fetchUser } from "../helpers/apiHelper";

export const UserPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("Authorization");
  useEffect(() => {
    const checkUserAndGetPosts = async() => {
      if(!token) {
        navigate('/');
      } else {
        try {
          const userData = await fetchUser(token);
          if(userData.user.author === false) {
            navigate('/');
          } else {
            const response = await fetchPostsByUser();
            setUserPosts(response);
          }
        } catch(error) {
          setErrors([{ message: "No posts found." }]);
        }
      }
    }
    checkUserAndGetPosts();
  }, [])

  return(
    <>
      <h1 className="title">Your Posts</h1>
      <div className="postsContainer">
        {
          userPosts.map((p) => (
            <div className="posts-post" key={p._id}>
              <h1>{p.title}</h1>
              <p>Published: {p.published ? "✅" : "❌"}</p>
              <p>{p.time_stamp}</p>
              { p.description.length > 260 ? (<p>{p.description.slice(0, 260)}...</p>) : (<p>{p.description}</p>)}

              <Link to={`/post/${p._id}`}>Go to post</Link>
            </div>
          ))
        }
      </div>
    </>
  )
}